import os
import sys
from getpass import getpass

sys.path.append(os.path.dirname(__file__))

from app.database.database import SessionLocal
from app.models.user import User
from app.routes.auth import hash_password


def prompt_non_empty(prompt_text, default=None):
    while True:
        value = input(prompt_text).strip()
        if value:
            return value
        if default is not None:
            return default
        print('This field is required.')


def main():
    print('Create or promote an admin user for MineTrack DRC')
    email = prompt_non_empty('Admin email: ')
    full_name = prompt_non_empty('Full name: ')
    province = prompt_non_empty('Province: ', default='Kinshasa')
    phone = input('Phone (optional): ').strip() or None

    password = getpass('Password: ')
    confirm = getpass('Confirm password: ')
    if password != confirm:
        print('Error: passwords do not match.')
        return
    if len(password) < 6:
        print('Error: password should be at least 6 characters.')
        return

    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            existing.full_name = full_name
            existing.province = province
            existing.phone = phone
            existing.role = 'admin'
            existing.is_admin = True
            existing.hashed_password = hash_password(password)
            print(f'Updated existing user {email} as admin.')
        else:
            admin = User(
                full_name=full_name,
                email=email,
                phone=phone,
                hashed_password=hash_password(password),
                province=province,
                role='admin',
                is_admin=True,
            )
            db.add(admin)
            print(f'Created new admin user {email}.')
        db.commit()
    except Exception as error:
        db.rollback()
        print('Error creating admin:', error)
    finally:
        db.close()


if __name__ == '__main__':
    main()
