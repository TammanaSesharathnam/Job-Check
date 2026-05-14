import requests

BASE = "http://localhost:5000/api"

tests = [
    ("sesha@gmail.com", "sesha@123", "sesha (NEW password)"),
    ("sesha@gmail.com", "123456", "sesha (OLD password)"),
    ("admin@jobcheck.ai", "admin123", "admin"),
]

print("=" * 55)
print("LIVE LOGIN TESTS AGAINST BACKEND")
print("=" * 55)
for email, pwd, label in tests:
    try:
        r = requests.post(f"{BASE}/login", json={"email": email, "password": pwd}, timeout=5)
        d = r.json()
        if r.status_code == 200:
            print(f"[PASS] {label}")
            print(f"       -> username={d.get('username')} is_admin={d.get('is_admin')}")
        else:
            print(f"[FAIL] {label}")
            print(f"       -> {d}")
    except Exception as e:
        print(f"[ERROR] Backend not reachable: {e}")
    print()
