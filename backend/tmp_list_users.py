from app import app, db, User

with app.app_context():
    users = User.query.all()
    lines = ["=== ALL USERS ==="]
    for u in users:
        lines.append(f"id={u.id} email={u.email} username={u.username} is_admin={u.is_admin}")
    
    output = "\n".join(lines)
    # Write to file to avoid terminal truncation
    with open("users_list.txt", "w") as f:
        f.write(output)
    print(output)
