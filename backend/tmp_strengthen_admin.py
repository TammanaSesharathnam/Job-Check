from app import app, db, User, bcrypt

with app.app_context():
    # Change admin password to something strong that won't trigger Chrome's breach warning
    admin = User.query.filter_by(username="admin").first()
    if admin:
        new_password = "JobCheck@Admin#2026"
        admin.password = bcrypt.generate_password_hash(new_password).decode("utf-8")
        db.session.commit()
        ok = bcrypt.check_password_hash(admin.password, new_password)
        print(f"Admin password updated!")
        print(f"  Email   : admin@jobcheck.ai")
        print(f"  Password: {new_password}")
        print(f"  Verified: {ok}")
    
    # Also update karti@gmail.com admin
    karti = User.query.filter_by(email="karti@gmail.com").first()
    if karti:
        new_password2 = "JobCheck@Karti#2026"
        karti.password = bcrypt.generate_password_hash(new_password2).decode("utf-8")
        db.session.commit()
        print(f"\nKarti admin password updated!")
        print(f"  Email   : karti@gmail.com")
        print(f"  Password: {new_password2}")
