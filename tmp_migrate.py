import sqlite3
import os

# Paths
active_db = 'JobCheck/backend/users.db'
legacy_db = 'backend/users.db'

def migrate():
    if not os.path.exists(active_db) or not os.path.exists(legacy_db):
        print("One or more databases missing.")
        return

    conn_act = sqlite3.connect(active_db)
    conn_leg = sqlite3.connect(legacy_db)
    
    c_act = conn_act.cursor()
    c_leg = conn_leg.cursor()

    # 1. Migrate Users
    c_leg.execute("SELECT fullname, username, email, password, is_admin FROM users WHERE email IS NOT NULL")
    users = c_leg.fetchall()
    
    merged_u = 0
    for u in users:
        try:
            # The active DB might have 'role' instead of 'is_admin' or both. Checking columns.
            c_act.execute("INSERT INTO users (fullname, username, email, password, is_admin) VALUES (?, ?, ?, ?, ?)", u)
            merged_u += 1
        except sqlite3.IntegrityError:
            # User already exists, skip
            pass
        except Exception as e:
            print(f"User merge error for {u[2]}: {e}")

    # 2. Migrate Logs (job_logs -> predictions)
    # job_logs (leg): user_id, job_title, company, description, result, confidence, is_flagged, timestamp
    # predictions (act): user_id, job_title, company, result, confidence, timestamp
    try:
        c_leg.execute("SELECT user_id, job_title, company, result, confidence, timestamp FROM job_logs")
        logs = c_leg.fetchall()
        
        merged_l = 0
        for l in logs:
            c_act.execute("INSERT INTO predictions (user_id, job_title, company, result, confidence, timestamp) VALUES (?, ?, ?, ?, ?, ?)", l)
            merged_l += 1
        print(f"Successfully migrated {merged_l} job scan records.")
    except Exception as e:
        print(f"Scan migration issue (tables might differ): {e}")

    conn_act.commit()
    conn_act.close()
    conn_leg.close()
    print(f"Restoration Complete. Migrated {merged_u} accounts.")

if __name__ == '__main__':
    migrate()
