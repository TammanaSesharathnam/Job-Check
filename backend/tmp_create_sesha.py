from app import app, db, User, bcrypt

with app.app_context():
    # Create sesha user
    email = "sesha@gmail.com"
    if User.query.filter_by(email=email).first():
        print(f"User {email} already exists!")
    else:
        hashed = bcrypt.generate_password_hash("123456").decode("utf-8")
        user = User(
            fullname="Sesha",
            username="sesha",
            email=email,
            password=hashed,
            is_admin=False,
            role="user"
        )
        db.session.add(user)
        db.session.commit()
        print(f"Created user: {email} with password: 123456")
