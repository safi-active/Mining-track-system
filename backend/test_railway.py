from passlib.context import CryptContext

ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
hashed = "$2b$12$1K3BpJDaP3QHUyOEPFWmcOQRbIP6VgfxR9amAinhVCYgPScdVSM9S"
result = ctx.verify("Ac12345@!", hashed)
print("Password match:", result)