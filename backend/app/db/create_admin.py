import sys
import getpass
from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.model.models import User
from app.core.security import hash_password

def create_admin_interactive(email: str = None, password: str = None):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if not email:
            email = input("Enter admin email: ").strip()
        if not password:
            password = getpass.getpass("Enter admin password: ").strip()

        if not email or not password:
            print("Error: Email and password cannot be empty.")
            return

        user = db.query(User).filter(User.email.ilike(email)).first()
        if user:
            user.hashed_password = hash_password(password)
            user.is_admin = True
            db.commit()
            print(f"Admin user '{email}' updated with new password successfully.")
        else:
            new_user = User(
                email=email,
                hashed_password=hash_password(password),
                is_admin=True
            )
            db.add(new_user)
            db.commit()
            print(f"Admin user '{email}' created successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error creating admin: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    em = sys.argv[1] if len(sys.argv) > 1 else None
    pw = sys.argv[2] if len(sys.argv) > 2 else None
    create_admin_interactive(em, pw)
