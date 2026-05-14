import sqlite3
import os

db_path = "backend/users.db"
if not os.path.exists(db_path):
    print(f"Error: {db_path} not found")
else:
    conn = sqlite3.connect(db_path)
    res = conn.execute("SELECT sql FROM sqlite_master WHERE name='users'")
    print(res.fetchone()[0])
    conn.close()
