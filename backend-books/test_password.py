from app.utils.password import hash_password, verify_password

password = "admin123"

hashed = hash_password(password)

print("Original:", password)
print("Hashed :", hashed)
print("Verify Correct :", verify_password(password, hashed))
print("Verify Wrong   :", verify_password("wrongpassword", hashed))