
import os
import sys
from werkzeug.security import generate_password_hash
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# This script helps create or reset an admin user's password
# Usage: python create_admin.py <email> <username> <password> [fullname]

basedir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(basedir, "users.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(100), nullable=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)

def create_admin(email, username, password, fullname=None):
    with app.app_context():
        # Check if user exists
        user = User.query.filter((User.email == email) | (User.username == username)).first()
        
        hashed_pw = generate_password_hash(password)
        
        if user:
            print(f"User {username} ({email}) already exists. Updating password and ensuring admin privileges...")
            user.password = hashed_pw
            user.is_admin = True
            if fullname:
                user.fullname = fullname
            db.session.commit()
            print("Successfully updated admin user.")
        else:
            print(f"Creating new admin user: {username} ({email})...")
            new_user = User(
                email=email,
                username=username,
                password=hashed_pw,
                fullname=fullname or username,
                is_admin=True
            )
            db.session.add(new_user)
            db.session.commit()
            print("Successfully created new admin user.")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python create_admin.py <email> <username> <password> [fullname]")
        print("Example: python create_admin.py admin@example.com admin mysecretpassword 'Admin User'")
    else:
        email = sys.argv[1]
        username = sys.argv[2]
        password = sys.argv[3]
        fullname = sys.argv[4] if len(sys.argv) > 4 else None
        
        create_admin(email, username, password, fullname)
