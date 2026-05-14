
import requests
import json

url = "http://localhost:5000/login"
password = "password123" # This is a guess for the test_register.py user 'sneha'

def test_login(login_id):
    print(f"Testing login for: {login_id}")
    try:
        response = requests.post(url, json={"email": login_id, "password": password})
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print(f"Success! Body: {response.json().get('username')}")
        else:
            print(f"Failed Body: {response.json()}")
    except Exception as e:
        print(f"Backend not reachable: {e}")

# We'll use the user we found in the DB or created earlier
# ID: 18, Username: sneha11, Email: sneha@gmail.com
test_login("sneha@gmail.com")
test_login("sneha11")
