import requests

def test_login():
    url = "http://localhost:5000/login"
    data = {"email": "admin", "password": "admin123"}
    try:
        response = requests.post(url, json=data, timeout=5)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_login()
