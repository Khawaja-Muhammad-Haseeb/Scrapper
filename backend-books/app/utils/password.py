import bcrypt

def hash_password(password: str) -> str:
    """
    Hash a plain text password using native bcrypt.
    """
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain text password against a hashed password safely using native bcrypt.
    """
    try:
        if not plain_password or not hashed_password:
            return False

        hashed_bytes = (
            hashed_password.encode('utf-8')
            if isinstance(hashed_password, str)
            else hashed_password
        )
        plain_bytes = plain_password.encode('utf-8')

        return bcrypt.checkpw(plain_bytes, hashed_bytes)
    except Exception as e:
        print(f"Error verifying password: {e}")
        return False