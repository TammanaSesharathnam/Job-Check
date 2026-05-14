import os
import sys
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from werkzeug.security import generate_password_hash

basedir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(basedir, "backend", "users.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(100), nullable=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default="user")
    is_admin = db.Column(db.Boolean, default=False)

def setup_admin():
    with app.app_context():
        # Ensure 'role' column exists
        try:
            db.session.execute(text("ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user'"))
            db.session.commit()
            print("Added role column.")
        except Exception as e:
            db.session.rollback()
            print(f"Role column might already exist: {e}")

        # Create/Update admin
        email = "admin@jobcheck.com"
        username = "admin"
        password = "admin123"
        hashed_pw = generate_password_hash(password)
        
        user = User.query.filter_by(email=email).first()
        if user:
            user.password = hashed_pw
            user.role = "admin"
            user.is_admin = True
            print("Updated existing admin.")
        else:
            user = User(
                email=email,
                username=username,
                password=hashed_pw,
                fullname="System Admin",
                role="admin",
                is_admin=True
            )
            db.session.add(user)
            print("Created new admin.")
        
        db.session.commit()
        print("Done.")

if __name__ == "__main__":
    setup_admin()
