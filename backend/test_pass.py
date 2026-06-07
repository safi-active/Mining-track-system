from passlib.context import CryptContext

ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
result = ctx.verify("mining2024", "$2b$12$grAbnqcNox0Kawo8L/8jEe/h9TDH1CzPUuqXpccQQkNhbyiFS6rRu")
print("Password match:", result)