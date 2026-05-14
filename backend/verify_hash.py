import sqlite3
import os
from flask_bcrypt import Bcrypt
from flask import Flask

app = Flask(__name__)
bcrypt = Bcrypt(app)

db_path = "backend/users.db"
email = "admin@jobcheck.com"
password = "admin123"

with app.app_context():
    conn = sqlite3.connect(db_path)
    res = conn.execute("SELECT password FROM users WHERE email=?", (email,))
    row = res.fetchone()
    if row:
        stored_hash = row[0]
        try:
            matches = bcrypt.check_password_hash(stored_hash, password)
            print(f"Bcrypt Match for '{email}': {matches}")
        except Exception as e:
            print(f"Error checking hash (likely not a bcrypt hash): {e}")
    else:
        print(f"User '{email}' not found.")
    conn.close()
