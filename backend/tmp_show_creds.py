from app import app, db, User, bcrypt

with app.app_context():
    users = User.query.all()
    print("=" * 55)
    print("CURRENT USERS & PASSWORDS IN DATABASE")
    print("=" * 55)
    
    # sesha password was just reset to sesha@123
    known_passwords = {
        "admin": "admin123",
        "sesha": "sesha@123",
    }
    
    for u in users:
        known_pwd = known_passwords.get(u.username, "unknown - use original password")
        print(f"  Email    : {u.email}")
        print(f"  Username : {u.username}")
        print(f"  Password : {known_pwd}")
        print(f"  Is Admin : {u.is_admin}")
        print(f"  Role     : {u.role}")
        print("-" * 55)
