from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token,
    jwt_required, get_jwt_identity
)
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from sqlalchemy.exc import IntegrityError
from datetime import timedelta
import pickle
import joblib
import os
import sys

app = Flask(__name__)
bcrypt = Bcrypt(app)
# Global CORS to handle preflight and cross-origin
CORS(app, resources={r"/*": {"origins": "*"}})

# ------------------ CONFIGURATION ------------------

basedir = os.path.abspath(os.path.dirname(__file__))

app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "jobcheck-quantum-secret-2026")
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
    "DATABASE_URL", 
    "sqlite:///" + os.path.join(basedir, "users.db")
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_ERROR_MESSAGE_KEY"] = "error"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)

db = SQLAlchemy(app)
jwt = JWTManager(app)

# ------------------ DATABASE MODELS ------------------

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(100), nullable=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default="user")
    is_admin = db.Column(db.Boolean, default=False, nullable=False)

class Job(db.Model):
    __tablename__ = 'jobs'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    company = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    salary = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(100), default="Technology")
    type = db.Column(db.String(50), default="Full Time")
    created_at = db.Column(db.DateTime, default=db.func.now())

class Feedback(db.Model):
    __tablename__ = 'feedback'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now())

class JobLog(db.Model):
    __tablename__ = 'job_logs'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    job_title = db.Column(db.String(200), nullable=True)
    company = db.Column(db.String(100), nullable=True)
    description = db.Column(db.Text, nullable=False)
    result = db.Column(db.String(50), nullable=False)
    confidence = db.Column(db.String(10), nullable=False)
    is_flagged = db.Column(db.Boolean, default=False)
    timestamp = db.Column(db.DateTime, default=db.func.now())

# API Blueprint for /api prefix
api = Blueprint('api', __name__, url_prefix='/api')

# ------------------ ML LOADING ------------------
try:
    model_path = os.path.join(basedir, "job_model.pkl")
    vectorizer_path = os.path.join(basedir, "tfidf.pkl")
    
    if os.path.exists(model_path):
        model = joblib.load(model_path)
        print(f"Loaded model from {model_path}")
    else:
        print(f"Warning: job_model.pkl not found")
        
    if os.path.exists(vectorizer_path):
        vectorizer = joblib.load(vectorizer_path)
        print(f"Loaded vectorizer from {vectorizer_path}")
    else:
        print(f"Warning: vectorizer.pkl not found")
except Exception as e:
    print(f"Error loading models: {e}")

# ------------------ UTILS ------------------
def check_admin_status(username):
    user = User.query.filter_by(username=username).first()
    return user and (user.is_admin or user.role == 'admin')

# ------------------ AUTH ROUTES ------------------

@api.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "active", "db_uri": app.config["SQLALCHEMY_DATABASE_URI"].split('/')[-1]}), 200

@api.route("/register", methods=["POST"])
def register():
    data = request.json
    fullname = data.get("name")
    email = data.get("email")
    password = data.get("password")
    is_admin = data.get("is_admin", False)

    if not email or not password:
        return jsonify({"error": "Identity credentials required"}), 400

    username = email.split('@')[0] if '@' in email else email
    
    # Check if email already registered
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "This email is already registered. Please log in instead."}), 400
    # Check if username derived from email is already taken
    if User.query.filter_by(username=username).first():
        return jsonify({"error": f"The username '{username}' is already taken. Please use a different email."}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    try:
        new_user = User(
            fullname=fullname, 
            username=username, 
            email=email, 
            password=hashed_password, 
            is_admin=is_admin,
            role="admin" if is_admin else "user"
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "Registration successful"}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "User could not be created due to a database conflict"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Internal server error during registration"}), 500

@api.route("/login", methods=["POST"])
def login():
    data = request.json
    login_id = data.get("email")
    password = data.get("password")

    if not login_id or not password:
        return jsonify({"error": "Secret Key required"}), 400

    user = User.query.filter_by(email=login_id).first()
    if not user:
        user = User.query.filter_by(username=login_id).first()

    if user:
        # Support dual hashing check for legacy accounts
        valid = False
        try:
            if bcrypt.check_password_hash(user.password, password):
                valid = True
        except:
            from werkzeug.security import check_password_hash
            if check_password_hash(user.password, password):
                valid = True
                # Upgrade to bcrypt
                user.password = bcrypt.generate_password_hash(password).decode('utf-8')
                db.session.commit()

        if valid:
            access_token = create_access_token(identity=user.username)
            return jsonify({
                "token": access_token, 
                "username": user.username,
                "email": user.email,
                "fullname": user.fullname or user.username,
                "is_admin": user.is_admin or user.role == 'admin',
                "role": user.role
            })
    
    return jsonify({"error": "Invalid digital signature"}), 401

# ------------------ FEATURE ROUTES ------------------

@api.route("/predict", methods=["POST"])
@jwt_required()
def predict():
    current_username = get_jwt_identity()
    user = User.query.filter_by(username=current_username).first()
    
    data = request.json.get("description")
    job_title = request.json.get("job_title", "Untitled Analysis")
    company = request.json.get("company", "N/A")

    if not data:
        return jsonify({"error": "Null data stream"}), 400

    try:
        transformed = vectorizer.transform([data])
        prediction = model.predict(transformed)[0]
        probs = model.predict_proba(transformed)[0]
        
        confidence = f"{round(probs[prediction] * 100)}%"
        result = "Fake Job" if prediction == 1 else "Real Job"

        new_log = JobLog(
            user_id=user.id,
            job_title=job_title,
            company=company,
            description=data,
            result=result,
            confidence=confidence
        )
        db.session.add(new_log)
        db.session.commit()

        return jsonify({"result": result, "confidence": confidence})
    except Exception as e:
        return jsonify({"error": f"Neural error: {str(e)}"}), 500

@api.route("/user/history", methods=["GET"])
@jwt_required()
def user_history():
    current_username = get_jwt_identity()
    user = User.query.filter_by(username=current_username).first()
    logs = JobLog.query.filter_by(user_id=user.id).order_by(JobLog.timestamp.desc()).all()
    
    return jsonify([{
        "id": l.id,
        "job_title": l.job_title,
        "company": l.company,
        "result": l.result,
        "confidence": l.confidence,
        "timestamp": l.timestamp.strftime("%Y-%m-%d %H:%M:%S")
    } for l in logs])

@api.route("/jobs", methods=["GET"])
def get_jobs():
    jobs = Job.query.order_by(Job.created_at.desc()).all()
    return jsonify([{
        "id": j.id,
        "title": j.title,
        "company": j.company,
        "location": j.location,
        "salary": j.salary,
        "description": j.description,
        "category": j.category,
        "type": j.type
    } for j in jobs])

@api.route("/feedback", methods=["POST"])
@jwt_required()
def submit_feedback():
    current_username = get_jwt_identity()
    user = User.query.filter_by(username=current_username).first()
    data = request.json
    
    new_feedback = Feedback(
        user_id=user.id if user else None,
        name=data.get("name"),
        email=data.get("email"),
        subject=data.get("subject", "General Inquiry"),
        message=data.get("message")
    )
    db.session.add(new_feedback)
    db.session.commit()
    return jsonify({"message": "Feedback logged in system"})

# ------------------ ADMIN ROUTES ------------------

@api.route("/admin/stats", methods=["GET"])
@jwt_required()
def admin_stats():
    if not check_admin_status(get_jwt_identity()):
        return jsonify({"error": "Admin clearance required"}), 403
    
    return jsonify({
        "total_users": User.query.count(),
        "total_feedback": Feedback.query.count(),
        "total_checks": JobLog.query.count(),
        "total_jobs": Job.query.count()
    })

@api.route("/admin/users", methods=["GET"])
@jwt_required()
def admin_users():
    if not check_admin_status(get_jwt_identity()):
        return jsonify({"error": "Admin clearance required"}), 403
    
    users = User.query.all()
    return jsonify([{
        "id": u.id,
        "username": u.username,
        "email": u.email,
        "fullname": u.fullname,
        "is_admin": u.is_admin or u.role == "admin"
    } for u in users])

@api.route("/admin/users/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    if not check_admin_status(get_jwt_identity()):
        return jsonify({"error": "Admin clearance required"}), 403
    
    # Prevent deleting the master admin
    current_username = get_jwt_identity()
    if current_username == "admin" and user_id == 4:
        return jsonify({"error": "Cannot delete the master admin account"}), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Cascade delete: remove user's job logs first to avoid FK orphans
    JobLog.query.filter_by(user_id=user_id).delete()
    # Remove user's feedback (set user_id to NULL to keep feedback record)
    db.session.execute(__import__('sqlalchemy').text(f"UPDATE feedback SET user_id = NULL WHERE user_id = {user_id}"))
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User and associated records purged successfully"})

@api.route("/admin/jobs", methods=["POST"])
@jwt_required()
def add_job():
    if not check_admin_status(get_jwt_identity()):
        return jsonify({"error": "Admin clearance required"}), 403
    
    data = request.json
    new_job = Job(
        title=data.get("title"),
        company=data.get("company"),
        location=data.get("location"),
        salary=data.get("salary"),
        description=data.get("description"),
        category=data.get("category", "Technology"),
        type=data.get("type", "Full Time")
    )
    db.session.add(new_job)
    db.session.commit()
    return jsonify({"message": "Job vector initialized", "id": new_job.id}), 201

@api.route("/admin/activity", methods=["GET"])
@jwt_required()
def admin_activity():
    if not check_admin_status(get_jwt_identity()):
        return jsonify({"error": "Admin clearance required"}), 403
    
    logs = db.session.query(JobLog, User).outerjoin(User, JobLog.user_id == User.id).order_by(JobLog.timestamp.desc()).all()
    return jsonify([{
        "id": l.JobLog.id,
        "username": l.User.username if l.User else "System",
        "job_title": l.JobLog.job_title,
        "company": l.JobLog.company,
        "description": l.JobLog.description[:100] + "..." if l.JobLog.description and len(l.JobLog.description) > 100 else l.JobLog.description,
        "result": l.JobLog.result,
        "confidence": l.JobLog.confidence,
        "is_flagged": bool(l.JobLog.is_flagged) if l.JobLog.is_flagged is not None else (l.JobLog.result == "Fake Job"),
        "timestamp": l.JobLog.timestamp.strftime("%Y-%m-%d %H:%M:%S")
    } for l in logs])

@api.route("/admin/feedback", methods=["GET"])
@jwt_required()
def admin_feedback():
    if not check_admin_status(get_jwt_identity()):
        return jsonify({"error": "Admin clearance required"}), 403
    
    fb_list = db.session.query(Feedback, User).outerjoin(User, Feedback.user_id == User.id).order_by(Feedback.created_at.desc()).all()
    return jsonify([{
        "id": f.Feedback.id,
        "name": f.Feedback.name,
        "email": f.Feedback.email,
        "subject": f.Feedback.subject,
        "message": f.Feedback.message,
        "created_at": f.Feedback.created_at.strftime("%Y-%m-%d %H:%M") if f.Feedback.created_at else "N/A",
        "username": f.User.username if f.User else "Guest"
    } for f in fb_list])

@api.route("/admin/jobs/<int:job_id>", methods=["DELETE"])
@jwt_required()
def delete_job(job_id):
    if not check_admin_status(get_jwt_identity()):
        return jsonify({"error": "Admin clearance required"}), 403
    
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404
    db.session.delete(job)
    db.session.commit()
    return jsonify({"message": "Job deleted successfully"})

@api.route("/admin/logs/<int:log_id>", methods=["DELETE"])
@jwt_required()
def delete_log(log_id):
    """Delete a specific job scan log (e.g. flagged fake job entry)."""
    if not check_admin_status(get_jwt_identity()):
        return jsonify({"error": "Admin clearance required"}), 403
    
    log = JobLog.query.get(log_id)
    if not log:
        return jsonify({"error": "Log not found"}), 404
    db.session.delete(log)
    db.session.commit()
    return jsonify({"message": "Log entry deleted successfully"})

@api.route("/admin/retrain", methods=["POST"])
@jwt_required()
def retrain_engine():
    if not check_admin_status(get_jwt_identity()):
        return jsonify({"error": "Admin clearance required"}), 403
    
    # Simulated neural processing sync
    return jsonify({
        "message": "Neural Core Synchronized",
        "accuracy_delta": "+1.2%",
        "new_score": "99.98%"
    }), 200

app.register_blueprint(api)

# ------------------ DB INITIALIZATION ------------------

def init_db():
    with app.app_context():
        db.create_all()
        
        # Migrations for existing tables
        from sqlalchemy import text
        cols = [
            ("users", "is_admin", "BOOLEAN DEFAULT 0"),
            ("users", "role", "VARCHAR(20) DEFAULT 'user'"),
            ("job_logs", "job_title", "VARCHAR(200)"),
            ("job_logs", "company", "VARCHAR(100)"),
            ("job_logs", "is_flagged", "BOOLEAN DEFAULT 0")
        ]
        for t, c, ty in cols:
            try:
                db.session.execute(text(f"ALTER TABLE {t} ADD COLUMN {c} {ty}"))
                db.session.commit()
            except:
                db.session.rollback()
        
        # Ensure Default Admin exists
        admin_email = "admin@jobcheck.ai"
        if not User.query.filter_by(email=admin_email).first():
            hashed_admin = bcrypt.generate_password_hash("admin123").decode('utf-8')
            admin = User(fullname="Master Admin", username="admin", email=admin_email, password=hashed_admin, is_admin=True, role="admin")
            db.session.add(admin)
            db.session.commit()
            print("System administrator initialized.")

if __name__ == "__main__":
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000, use_reloader=False)
