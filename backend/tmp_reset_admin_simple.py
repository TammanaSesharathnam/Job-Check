from app import app, db, User, bcrypt

with app.app_context():
    new_password = "Admin@2026"
    
    admins = User.query.filter_by(is_admin=True).all()
    for admin in admins:
        admin.password = bcrypt.generate_password_hash(new_password).decode("utf-8")
        db.session.commit()
        ok = bcrypt.check_password_hash(admin.password, new_password)
        print(f"[{'OK' if ok else 'FAIL'}] {admin.email} -> password = {new_password}")
