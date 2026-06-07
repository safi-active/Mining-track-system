from passlib.context import CryptContext

ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
hashed = "$2b$12$iYYBHn0bpqDZdW5EmJIWQ.XPdWZXWkMFEb0lBVn11Ac2RY6Pb14TO"
result = ctx.verify("Ac12345@!", hashed)
print("Password match:", result)