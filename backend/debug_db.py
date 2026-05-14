
import sqlite3
import os

db_path = "users.db"

if not os.path.exists(db_path):
    print(f"Database not found at {db_path}")
    print(f"Current directory: {os.getcwd()}")
    print(f"Files in current directory: {os.listdir('.')}")
else:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        print(f"Tables: {tables}")
        
        if ('users',) in [t for t in tables]:
            cursor.execute("SELECT id, username, email, is_admin, password FROM users;")
            users = cursor.fetchall()
            print("Users in database:")
            for user in users:
                print(f"ID: {user[0]}, Username: {user[1]}, Email: {user[2]}, Admin: {user[3]}")
                pw = user[4]
                if pw.startswith('scrypt:') or pw.startswith('pbkdf2:'):
                    print(f"  Password looks like a hash: {pw[:20]}...")
                else:
                    print(f"  Password looks like PLAIN TEXT: {pw}")
        else:
            print("Users table not found.")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()
