import requests

url = "http://localhost:5000/register"
data = {
    "name": "sneha",
    "username": "sneha11",
    "email": "sneha@gmail.com",
    "password": "password123",
    "is_admin": False
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
