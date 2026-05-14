import pickle
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Sample dataset
texts = [
    "Work from home earn 50000 per week no experience",
    "Urgent hiring data entry no skills required",
    "Software engineer needed with 2 years experience",
    "Looking for experienced Python developer",
]

labels = [1, 1, 0, 0]  
# 1 = Fake Job
# 0 = Real Job

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(texts)

model = LogisticRegression()
model.fit(X, labels)

# Save model
joblib.dump(model, "job_model.pkl")
joblib.dump(vectorizer, "tfidf.pkl")

print("Model and Vectorizer saved successfully!")
