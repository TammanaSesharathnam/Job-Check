import requests

# 1. Login to get token
login_url = "http://localhost:5000/login"
login_data = {
    "email": "sneha@gmail.com",
    "password": "password123"
}

try:
    print("Attempting to login...")
    login_response = requests.post(login_url, json=login_data)
    if login_response.status_code != 200:
        print(f"Login failed: {login_response.status_code} - {login_response.text}")
        exit(1)
    
    token = login_response.json().get("token")
    print("Login successful! Token obtained.")

    # 2. Call /predict
    predict_url = "http://localhost:5000/predict"
    predict_data = {
        "description": "We are hiring a Software Developer with 2+ years of experience in Python and Django."
    }
    headers = {
        "Authorization": f"Bearer {token}"
    }

    print("Attempting to call /predict...")
    predict_response = requests.post(predict_url, json=predict_data, headers=headers)
    print(f"Status Code: {predict_response.status_code}")
    print(f"Response Body: {predict_response.text}")

except Exception as e:
    print(f"An error occurred: {e}")
