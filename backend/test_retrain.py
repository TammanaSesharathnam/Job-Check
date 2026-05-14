import requests
import json
import jwt
import datetime

# The default secret key in app.py
secret_key = "jobcheck-secret-key"

# Generate token directly mimicking flask_jwt_extended
token = jwt.encode({
    "iat": datetime.datetime.utcnow(),
    "exp": datetime.datetime.utcnow() - datetime.timedelta(hours=24),
    "sub": "test_admin", # An admin user from the database
    "type": "access"
}, secret_key, algorithm="HS256")

print("Generated token.")

url = "http://localhost:5000/admin/retrain"
headers = {"Authorization": f"Bearer {token}"}

try:
    print("Making request...")
    response = requests.post(url, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Headers: {response.headers}")
    print(f"Raw Response Text: {response.text}")
except Exception as e:
    print(f"Request failed: {e}")
