import sqlite3
from flask_bcrypt import Bcrypt
from flask import Flask

# Path to the active database
db_path = 'JobCheck/backend/users.db'

def reset_admin():
    app = Flask(__name__)
    bcrypt = Bcrypt(app)
    
    # Generate the high-security signature
    password_hash = bcrypt.generate_password_hash('admin123').decode('utf-8')
    
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    
    # Force restore the admin account
    c.execute("""
        INSERT OR REPLACE INTO users (id, fullname, username, email, password, role, is_admin)
        VALUES (1, 'System Admin', 'admin@jobcheck.com', 'admin@jobcheck.com', ?, 'admin', 1)
    """, (password_hash,))
    
    conn.commit()
    conn.close()
    print("Admin credentials reset successfully in the active database.")

if __name__ == '__main__':
    reset_admin()
