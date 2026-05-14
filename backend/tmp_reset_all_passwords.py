from app import app, db, User, bcrypt
import os

with app.app_context():
    # Print which DB file is being used
    db_path = app.config["SQLALCHEMY_DATABASE_URI"]
    print(f"DB URI: {db_path}")
    
    # Reset ALL non-admin users to simple known passwords
    users = User.query.all()
    print("\n=== RESETTING PASSWORDS ===")
    for u in users:
        if u.is_admin:
            # Keep admin password as admin123, just verify it
            ok = bcrypt.check_password_hash(u.password, "admin123")
            if not ok:
                u.password = bcrypt.generate_password_hash("admin123").decode("utf-8")
                print(f"  [FIXED] {u.email} -> admin123")
            else:
                print(f"  [OK]    {u.email} -> admin123 (unchanged)")
        else:
            # Reset ALL regular users to: <username>123
            new_pwd = u.username + "123"
            u.password = bcrypt.generate_password_hash(new_pwd).decode("utf-8")
            print(f"  [RESET] {u.email} -> {new_pwd}")
    
    db.session.commit()
    print("\n=== VERIFICATION ===")
    users = User.query.all()
    for u in users:
        if u.is_admin:
            ok = bcrypt.check_password_hash(u.password, "admin123")
            print(f"  {u.email:30s} | password=admin123 | verify={ok} | is_admin={u.is_admin}")
        else:
            new_pwd = u.username + "123"
            ok = bcrypt.check_password_hash(u.password, new_pwd)
            print(f"  {u.email:30s} | password={new_pwd:12s} | verify={ok} | is_admin={u.is_admin}")
    
    print("\nDone. Restart your backend now!")
