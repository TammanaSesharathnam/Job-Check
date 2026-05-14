import requests
import sys
import random
import string

def test_register():
    url = "http://localhost:5000/register"
    username = "testuser_" + "".join(random.choices(string.ascii_lowercase, k=5))
    data = {
        "name": "Test User",
        "username": username,
        "email": f"{username}@example.com",
        "password": "password",
        "is_admin": False
    }
    try:
        response = requests.post(url, json=data, timeout=2)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the backend server.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_register()
