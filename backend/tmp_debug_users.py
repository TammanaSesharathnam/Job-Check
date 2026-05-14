from app import app, db, User, bcrypt

with app.app_context():
    users = User.query.all()
    print("=== ALL USERS IN DB ===")
    for u in users:
        print(f"ID:{u.id} | email:{repr(u.email)} | username:{repr(u.username)} | is_admin:{u.is_admin} | role:{u.role}")
    
    print()
    print("=== TEST 'sesha@gmail.com' ===")
    test_user = User.query.filter_by(email="sesha@gmail.com").first()
    if test_user:
        print(f"Found user: {test_user.username}")
        # Try bcrypt
        try:
            ok = bcrypt.check_password_hash(test_user.password, "123456")
            print(f"bcrypt check '123456': {ok}")
        except Exception as e:
            print(f"bcrypt error: {e}")
        # Try werkzeug
        try:
            from werkzeug.security import check_password_hash
            ok2 = check_password_hash(test_user.password, "123456")
            print(f"werkzeug check '123456': {ok2}")
        except Exception as e:
            print(f"werkzeug error: {e}")
        print(f"Hash: {test_user.password}")
    else:
        print("User NOT found with email sesha@gmail.com")
        # Try username
        test_user2 = User.query.filter_by(username="sesha").first()
        if test_user2:
            print(f"Found by username 'sesha': id={test_user2.id}, email={test_user2.email}")
        else:
            print("Also not found by username 'sesha'")
