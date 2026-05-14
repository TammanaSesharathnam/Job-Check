
import requests
import json
import sqlite3
import os
from werkzeug.security import generate_password_hash

# We need a token to test admin routes.
# Let's find an admin user in the DB and simulate a login to get their token.

db_path = r"d:\JobCheck\JobCheck\backend\users.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()
cursor.execute("SELECT username, password FROM users WHERE is_admin = 1 LIMIT 1;")
admin = cursor.fetchone()
conn.close()

if not admin:
    print("No admin user found in database!")
    exit(1)

admin_username, admin_password_hash = admin
print(f"Testing with admin user: {admin_username}")

# Backend URL
url = "http://localhost:5000"

# Note: We don't know the plain password, so we'll temporary reset it for testing
# or just assume 'yournewpassword' if we just ran create_admin.py

try:
    # First, let's try to login as this admin
    # Since we don't know the password, we'll use our create_admin.py tool to set a known one
    import subprocess
    import sys
    
    test_email = "test_admin@example.com"
    test_user = "test_admin"
    test_pw = "test_pw_123"
    
    print("Creating/Resetting test admin...")
    subprocess.run([sys.executable, "create_admin.py", test_email, test_user, test_pw], capture_output=True)
    
    print("Logging in...")
    login_res = requests.post(f"{url}/login", json={"email": test_email, "password": test_pw})
    if login_res.status_code != 200:
        print(f"Login failed: {login_res.json()}")
        exit(1)
    
    token = login_res.json().get("token")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Now test admin routes
    routes = ["/admin/stats", "/admin/users", "/admin/feedback", "/admin/activity"]
    for route in routes:
        print(f"Testing {route}...")
        res = requests.get(f"{url}{route}", headers=headers)
        print(f"  Status: {res.status_code}")
        if res.status_code != 200:
            print(f"  Error: {res.json()}")
        else:
            print(f"  Success! ({len(res.json()) if isinstance(res.json(), list) else 'Object'})")

except Exception as e:
    print(f"Test error: {e}")
