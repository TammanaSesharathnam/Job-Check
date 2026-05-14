import os
import sqlite3

def check_users():
    db_path = os.path.join(os.path.dirname(__file__), "users.db")
    if not os.path.exists(db_path):
        print(f"Error: Database not found at {db_path}")
        return

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT id, username, email, is_admin FROM users")
        users = cursor.fetchall()
        
        if not users:
            print("No users found in the database.")
        else:
            print(f"Found {len(users)} users:")
            for u in users:
                print(f"ID: {u[0]}, Username: {u[1]}, Email: {u[2]}, Admin: {u[3]}")
        conn.close()
    except Exception as e:
        print(f"Error checking users: {e}")

if __name__ == "__main__":
    check_users()
