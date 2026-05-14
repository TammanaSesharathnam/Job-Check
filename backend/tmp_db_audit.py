from app import app, db, User, Job, Feedback, JobLog
from sqlalchemy import text, inspect

with app.app_context():
    inspector = inspect(db.engine)
    
    out = []

    # ── SCHEMA ────────────────────────────────────────────────
    out.append("=" * 60)
    out.append("DATABASE SCHEMA")
    out.append("=" * 60)
    for table in inspector.get_table_names():
        out.append(f"\nTABLE: {table}")
        for col in inspector.get_columns(table):
            out.append(f"  {col['name']:25s} {str(col['type']):20s} nullable={col['nullable']} default={col.get('default')}")

    # ── USERS ─────────────────────────────────────────────────
    out.append("\n" + "=" * 60)
    out.append("USERS TABLE")
    out.append("=" * 60)
    users = User.query.all()
    out.append(f"Total users: {len(users)}")
    for u in users:
        out.append(f"  id={u.id} | email={u.email} | username={u.username} | fullname={u.fullname} | is_admin={u.is_admin} | role={u.role}")

    # ── JOBS ──────────────────────────────────────────────────
    out.append("\n" + "=" * 60)
    out.append("JOBS TABLE")
    out.append("=" * 60)
    jobs = Job.query.all()
    out.append(f"Total jobs: {len(jobs)}")
    for j in jobs:
        out.append(f"  id={j.id} | title={j.title} | company={j.company}")

    # ── FEEDBACK ──────────────────────────────────────────────
    out.append("\n" + "=" * 60)
    out.append("FEEDBACK TABLE")
    out.append("=" * 60)
    fb = Feedback.query.all()
    out.append(f"Total feedback: {len(fb)}")
    for f in fb:
        out.append(f"  id={f.id} | user_id={f.user_id} | name={f.name} | subject={f.subject}")

    # ── JOB LOGS ──────────────────────────────────────────────
    out.append("\n" + "=" * 60)
    out.append("JOB LOGS TABLE")
    out.append("=" * 60)
    logs = JobLog.query.all()
    out.append(f"Total logs: {len(logs)}")
    for l in logs:
        out.append(f"  id={l.id} | user_id={l.user_id} | job_title={l.job_title} | result={l.result} | confidence={l.confidence}")

    # ── INTEGRITY CHECKS ──────────────────────────────────────
    out.append("\n" + "=" * 60)
    out.append("INTEGRITY CHECKS")
    out.append("=" * 60)

    # Check orphan logs (logs with no matching user)
    orphan_logs = db.session.execute(
        text("SELECT jl.id, jl.user_id FROM job_logs jl LEFT JOIN users u ON jl.user_id = u.id WHERE u.id IS NULL")
    ).fetchall()
    out.append(f"Orphan job_logs (no matching user): {len(orphan_logs)}")
    for r in orphan_logs:
        out.append(f"  log_id={r[0]} user_id={r[1]}")

    # Check orphan feedback
    orphan_fb = db.session.execute(
        text("SELECT f.id, f.user_id FROM feedback f LEFT JOIN users u ON f.user_id = u.id WHERE f.user_id IS NOT NULL AND u.id IS NULL")
    ).fetchall()
    out.append(f"Orphan feedback (no matching user): {len(orphan_fb)}")

    # Check duplicate emails
    dup_emails = db.session.execute(
        text("SELECT email, COUNT(*) as cnt FROM users GROUP BY email HAVING cnt > 1")
    ).fetchall()
    out.append(f"Duplicate emails: {len(dup_emails)}")
    for r in dup_emails:
        out.append(f"  email={r[0]} count={r[1]}")

    # Check duplicate usernames
    dup_usernames = db.session.execute(
        text("SELECT username, COUNT(*) as cnt FROM users GROUP BY username HAVING cnt > 1")
    ).fetchall()
    out.append(f"Duplicate usernames: {len(dup_usernames)}")
    for r in dup_usernames:
        out.append(f"  username={r[0]} count={r[1]}")

    # Check users where is_admin and role are out of sync
    out.append("\nAdmin/role sync check:")
    for u in users:
        is_admin_bool = bool(u.is_admin)
        role_says_admin = (u.role == "admin")
        if is_admin_bool != role_says_admin:
            out.append(f"  [MISMATCH] id={u.id} email={u.email} is_admin={u.is_admin} role={u.role}")
        else:
            out.append(f"  [OK] id={u.id} email={u.email} is_admin={u.is_admin} role={u.role}")

    result = "\n".join(out)
    print(result)
    with open("db_audit.txt", "w", encoding="utf-8") as f:
        f.write(result)
    print("\n\nWritten to db_audit.txt")
