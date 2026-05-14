from app import app, db, User, bcrypt

with app.app_context():
    user = User.query.filter_by(email="sesha@gmail.com").first()
    if not user:
        print("ERROR: sesha@gmail.com not found in DB!")
    else:
        print(f"Found: id={user.id} username={user.username} email={user.email} is_admin={user.is_admin}")
        
        # Test common passwords
        test_passwords = ["123456", "1234567", "123456!", "sesha123", "sesha", "password", "admin123"]
        for pwd in test_passwords:
            try:
                ok = bcrypt.check_password_hash(user.password, pwd)
                if ok:
                    print(f"  MATCH FOUND: password = '{pwd}'")
            except Exception as e:
                print(f"  Error testing {pwd}: {e}")
        
        print(f"\nCurrent hash: {user.password}")
        print("\nResetting password to: sesha@123")
        user.password = bcrypt.generate_password_hash("sesha@123").decode("utf-8")
        db.session.commit()
        print("Password reset to 'sesha@123' successfully.")
        
        # Verify
        ok = bcrypt.check_password_hash(user.password, "sesha@123")
        print(f"Verification check: {ok}")
