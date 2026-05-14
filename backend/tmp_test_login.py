import requests

BASE = 'http://localhost:5000/api'

def test_login(email, pwd, label):
    try:
        r = requests.post(f'{BASE}/login', json={'email': email, 'password': pwd}, timeout=5)
        d = r.json()
        if r.status_code == 200:
            print(f'[OK] {label}: logged in | is_admin={d.get("is_admin")} | username={d.get("username")}')
        else:
            print(f'[FAIL] {label}: {d}')
    except Exception as e:
        print(f'[ERROR] Backend not running or: {e}')

test_login('sesha@gmail.com', '123456', 'sesha user')
test_login('admin@jobcheck.ai', 'admin123', 'admin')
test_login('ratna@gmail.com', 'wrongpass', 'wrong password')
