import sqlite3
import os

db_path = "backend/users.db"
if not os.path.exists(db_path):
    print(f"Error: {db_path} not found")
else:
    conn = sqlite3.connect(db_path)
    res = conn.execute("SELECT email, password FROM users")
    for row in res.fetchall():
        print(f"Email: {row[0]}, Hash Start: {row[1][:10]}...")
    conn.close()
