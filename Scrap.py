from bs4 import BeautifulSoup
import requests as req
import pandas as pd
import json
import os
import time
from urllib.parse import urljoin


BASE_URL        = "https://books.toscrape.com/"
OUTPUT_DIR      = "books_data"
CHECKPOINT_FILE = "checkpoint.json"
LOG_FILE        = "scraper.log"
RETRY_LIMIT     = 3       
RETRY_DELAY     = 2       
REQUEST_DELAY   = 0.5    

RATING_MAP = {
    'Zero': 0, 'One': 1, 'Two': 2,
    'Three': 3, 'Four': 4, 'Five': 5
}

CSV_HEADERS = [
    'Title', 'Price', 'Rating', 'Availability',
    'Description', 'UPC', 'Price_Excl_Tax',
    'Price_Incl_Tax', 'Tax', 'Number_of_Reviews', 'Book_URL'
]

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

    soup    = BeautifulSoup(response.content, 'html.parser')
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


# MAIN SCRAPER
def scrape():
    # Setup
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    checkpoint = load_checkpoint()
    completed_categories = checkpoint.get('completed_categories', [])

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

        csv_path = os.path.join(OUTPUT_DIR, f"{cat_name}.csv")

        # Create CSV with headers if it doesn't exist yet
        if not os.path.exists(csv_path):
            pd.DataFrame(columns=CSV_HEADERS).to_csv(csv_path, index=False)

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
            books_on_page = []
            for book_url in book_urls:
                book_data = get_book_details(book_url)

                if book_data:
                    books_on_page.append(book_data)
                    print(f"    {book_data['Title']}")  
                else:
                    print(f"    Failed: {book_url}")  

                time.sleep(REQUEST_DELAY)

            # Write page's books to CSV
            if books_on_page:
                pd.DataFrame(books_on_page).to_csv(
                    csv_path, mode='a', header=False, index=False
                )
                print(f"  Saved {len(books_on_page)} books to {csv_path}") 

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
    clear_checkpoint()
    print("\nAll categories scraped successfully!") 
    print(f"   CSV files saved to: {OUTPUT_DIR}/")  



if __name__ == "__main__":
    scrape()