import requests

url = "http://127.0.0.1:5000/api/login"
payload = {
    "email": "admin@jobcheck.com",
    "password": "admin123"
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
