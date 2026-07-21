from bs4 import BeautifulSoup
import requests as req
import json
import os
import sys
import time
from urllib.parse import urljoin
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError, ConnectionFailure
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

BASE_URL        = "https://books.toscrape.com/"
CHECKPOINT_FILE = "checkpoint.json"

# MongoDB Config
MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = "books_toscrape"
BOOKS_COLLECTION = "books"
CATEGORIES_COLLECTION = "categories"
METADATA_COLLECTION = "metadata"

RETRY_LIMIT     = 3       
RETRY_DELAY     = 2       
REQUEST_DELAY   = 0.5    

RATING_MAP = {
    'Zero': 0, 'One': 1, 'Two': 2,
    'Three': 3, 'Four': 4, 'Five': 5
}

# MONGODB CONNECTION

def connect_to_mongodb():
    """Connect to MongoDB and return database object"""
    try:
        client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
        
        # Test connection
        client.admin.command('ping')
        print("Connected to MongoDB successfully")
        db = client[DB_NAME]
        return db
        
    except ConnectionFailure as e:
        print(f"Failed to connect to MongoDB: {e}")
        print("Check your MONGODB_URI and Atlas network access settings.")
        return None
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        return None


def create_indexes(db):
    """Create database indexes for better performance"""
    try:
        books = db[BOOKS_COLLECTION]
        
        # Create unique index on book_url (prevent duplicates)
        books.create_index("Book_URL", unique=True)
        print("Created indexes")
        
    except Exception as e:
        print(f"Warning: Could not create indexes: {e}")


# HELPERS
def fetch_with_retry(url):
    """Fetch a URL with retry logic"""
    for attempt in range(1, RETRY_LIMIT + 1):
        try:
            response = req.get(url, timeout=10)
            response.raise_for_status()         
            return response

        except req.exceptions.ConnectionError:
            print(f"  [Attempt {attempt}/{RETRY_LIMIT}] Connection error: {url}") 

        except req.exceptions.Timeout:
            print(f"  [Attempt {attempt}/{RETRY_LIMIT}] Timeout: {url}") 

        except req.exceptions.HTTPError as e:
            print(f"  [Attempt {attempt}/{RETRY_LIMIT}] HTTP error {e}: {url}") 
            if response.status_code == 404:
                print(f"  404 Not Found, skipping: {url}")  
                return None

        except req.exceptions.RequestException as e:
            print(f"  [Attempt {attempt}/{RETRY_LIMIT}] Request failed: {e}") 

        if attempt < RETRY_LIMIT:
            wait = RETRY_DELAY * attempt         
            print(f"  Waiting {wait}s before retry")  
            time.sleep(wait)

    print(f"  All {RETRY_LIMIT} attempts failed: {url}")  
    return None


def safe_text(element):
    """Return stripped text from a BS4 element, or None if element is missing."""
    return element.text.strip() if element else None


# CHECKPOINT
def load_checkpoint():
    """Load the checkpoint file if it exists, otherwise return a fresh state."""
    if os.path.exists(CHECKPOINT_FILE):
        with open(CHECKPOINT_FILE, 'r') as f:
            checkpoint = json.load(f)
        print(f"Resuming from checkpoint: {checkpoint}")
        return checkpoint
    return {"completed_categories": []}


def save_checkpoint(checkpoint):
    """Save current scraping state to disk."""
    with open(CHECKPOINT_FILE, 'w') as f:
        json.dump(checkpoint, f, indent=2)


def clear_checkpoint():
    """Delete the checkpoint file when scraping finishes successfully."""
    if os.path.exists(CHECKPOINT_FILE):
        os.remove(CHECKPOINT_FILE)
        print("Checkpoint cleared.")  


# SCRAPING FUNCTIONS
def get_categories():
    """Fetch the homepage and extract all category names + URLs."""
    print("Fetching category list...") 
    response = fetch_with_retry(BASE_URL)
    if not response:
        print("Could not fetch homepage. Aborting.")
        return []

    soup = BeautifulSoup(response.content, 'html.parser')
    side_categories = soup.find('div', class_='side_categories')

    if not side_categories:
        print("Could not find side_categories div. Page structure may have changed.") 
        return []

    all_links = side_categories.find_all('a')
    categories = []

    for link in all_links:
        category_name = link.get_text().strip()
        relative_url  = link.get('href')

        if category_name == 'Books':   
            continue

        absolute_url = urljoin(BASE_URL, relative_url)
        categories.append({"Name": category_name, "URL": absolute_url})

    print(f"Found {len(categories)} categories.")
    return categories


def get_book_urls_from_page(page_url):
    """Fetch a category listing page"""
    response = fetch_with_retry(page_url)
    if not response:
        return [], None

    soup = BeautifulSoup(response.content, 'html.parser')

    # Extract book links 
    book_urls = []
    for article in soup.find_all('article', class_='product_pod'):
        relative_url = article.h3.a.get('href')
        absolute_url = urljoin(page_url, relative_url)
        book_urls.append(absolute_url)

    # Check for next page
    next_url = None
    next_li  = soup.find('li', class_='next')
    if next_li:
        next_relative = next_li.find('a').get('href')
        next_url = urljoin(page_url, next_relative)

    return book_urls, next_url


def get_book_details(book_url):
    """Fetch a single book's detail page and extract all available information."""
    response = fetch_with_retry(book_url)
    if not response:
        return None

    soup = BeautifulSoup(response.content, 'html.parser')
    article = soup.find('article', class_='product_page')

    if not article:
        print(f"  Could not find product_page article: {book_url}") 
        return None

    # Title 
    title = safe_text(article.find('h1'))

    # Price 
    try:
        price_text = safe_text(article.find('p', class_='price_color'))
        price = float(price_text.replace('£', '').strip())
    except (ValueError, AttributeError):
        price = None

    # Rating
    try:
        rating_classes = article.find('p', class_='star-rating').get('class')
        rating = RATING_MAP.get(rating_classes[1])
    except (AttributeError, IndexError):
        rating = None

    #  Availability 
    availability = safe_text(article.find('p', class_='instock availability'))

    #  Description 
    try:
        desc_header = soup.find('div', id='product_description')
        description = desc_header.find_next_sibling('p').text.strip() if desc_header else None
    except AttributeError:
        description = None

    # Product info table
    table_data = {}
    try:
        table = article.find('table')
        if table:
            for row in table.find_all('tr'):
                cells = row.find_all('td')
                if len(cells) == 2:
                    table_data[cells[0].text.strip()] = cells[1].text.strip()
    except AttributeError:
        pass

    return {
        'Title'           : title,
        'Price'           : price,
        'Rating'          : rating,
        'Availability'    : availability,
        'Description'     : description,
        'UPC'             : table_data.get('UPC'),
        'Price_Excl_Tax'  : table_data.get('Price (excl. tax)'),
        'Price_Incl_Tax'  : table_data.get('Price (incl. tax)'),
        'Tax'             : table_data.get('Tax'),
        'Number_of_Reviews': table_data.get('Number of reviews'),
        'Book_URL'        : book_url
    }



# Database insertion function
def insert_book(db, book_data, category_name):
    """
    Insert book into MongoDB
    
    Returns: True if inserted, False if duplicate, None if error
    """
    try:
        books_collection = db[BOOKS_COLLECTION]
        
        # Add category to book data
        book_data['category'] = category_name
        
        # Insert (unique index prevents duplicates)
        books_collection.insert_one(book_data)
        return True

    except DuplicateKeyError:
        # Book already exists (same book_url)
        return False

    except Exception as e:
        print(f"    ✗ Error inserting book to MongoDB: {e}")
        return None


def insert_category(db, category_name):
    """Insert/update category metadata"""
    try:
        categories = db[CATEGORIES_COLLECTION]
        
        # Use upsert to insert or update
        categories.update_one(
            {"name": category_name},
            {"$set": {"name": category_name, "updated_at": datetime.utcnow()}},
            upsert=True
        )
        return True

    except Exception as e:
        print(f"  Warning: Could not update category metadata: {e}")
        return False


def update_metadata(db, total_books, total_categories):
    """Update scraping metadata"""
    try:
        metadata = db[METADATA_COLLECTION]
        
        metadata.update_one(
            {"_id": "scrape_stats"},
            {
                "$set": {
                    "total_books": total_books,
                    "total_categories": total_categories,
                    "last_scraped": datetime.utcnow()
                }
            },
            upsert=True
        )
        return True

    except Exception as e:
        print(f"Warning: Could not update metadata: {e}")
        return False

# MAIN SCRAPER
def scrape():
    # Connect to MongoDB
    db = connect_to_mongodb()
    if db is None:
        print("Cannot proceed without MongoDB connection")
        return

    # Create indexes
    create_indexes(db)

    # Setup
    checkpoint = load_checkpoint()
    completed_categories = checkpoint.get('completed_categories', [])
    total_books_scraped = 0
    #  Get categories 
    categories = get_categories()
    if not categories:
        print("No categories to scrape. Exiting.")  
        return

    # Loop through categories
    for category in categories:
        cat_name = category['Name']
        cat_url  = category['URL']

        # Skip already completed categories
        if cat_name in completed_categories:
            print(f"[SKIP] {cat_name} already done.")  
            continue

        print(f"Category: {cat_name}")
        # Insert category metadata
        insert_category(db, cat_name)

        
        page_url = cat_url
        page_num = 1
        

        # Paginate through category 
        while page_url:
            print(f"  Page {page_num}: {page_url}")  
            book_urls, next_url = get_book_urls_from_page(page_url)

            if not book_urls:
                print(f"  No books found on page {page_num}. Moving on.")  
                break

            # Scrape each book on this page
            for book_idx, book_url in enumerate(book_urls, start=1):
                book_data = get_book_details(book_url)

                if book_data:
                    print(f"{book_data['Title']}")
                    # Insert into MongoDB
                    result = insert_book(db, book_data, cat_name)
                    if result is True:
                        # Successfully inserted
                        total_books_scraped += 1
                        print(f"[{book_idx}/{len(book_urls)}] {book_data['Title']}")

                    elif result is False:
                        # Duplicate (already exists)
                        print(f"[{book_idx}/{len(book_urls)}] {book_data['Title']} (duplicate)")

                    else:
                        # Error
                        print(f"[{book_idx}/{len(book_urls)}] {book_data['Title']} (error)")  
                else:
                    print(f"Failed: {book_url}")  

                time.sleep(REQUEST_DELAY)
                

            # Save checkpoint after each page 
            save_checkpoint({
                'completed_categories': completed_categories,
                'current_category'    : cat_name,
                'current_page'        : page_num
            })

            page_url  = next_url
            page_num += 1

        # Category complete 
        completed_categories.append(cat_name)
        save_checkpoint({'completed_categories': completed_categories})
        print(f"Finished category: {cat_name}")  
    # All done
    update_metadata(db, total_books_scraped, len(categories))
    # clear_checkpoint()
    print("\nAll categories scraped successfully!") 


if __name__ == "__main__":
    if not MONGODB_URI:
        print("Error: MONGODB_URI environment variable is not set.")
        print("Create a .env file or set the variable in your environment, e.g.:")
        print("MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority")
        sys.exit(1)
    scrape()