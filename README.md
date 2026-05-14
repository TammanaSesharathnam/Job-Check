# Job-Check: Fake Job Detection Using NLP

## 📌 Overview
Job-Check is an NLP-based web application that helps users identify fraudulent job postings using Machine Learning and Natural Language Processing techniques.

The system analyzes job descriptions, company details, salary information, and other textual features to predict whether a job post is **Real** or **Fake**.

The main goal of this project is to protect job seekers from online recruitment scams by providing an intelligent fake job detection platform.

---

## 🚀 Features
- Detects fake job postings using NLP and Machine Learning
- Text preprocessing and feature extraction
- Predicts job authenticity in real-time
- User-friendly web interface
- Trained on real-world fake job datasets
- Displays prediction results with accuracy

---

## 🛠️ Technologies Used

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Python
- Flask

### Machine Learning & NLP
- Scikit-learn
- Pandas
- NumPy
- NLTK
- TF-IDF Vectorizer

---

## 📂 Project Structure

```bash
job-check/
│
├── static/
├── templates/
├── dataset/
├── model/
├── app.py
├── train_model.py
├── requirements.txt
└── README.md
How It Works
User enters job posting details.
The system preprocesses the text using NLP techniques:
Tokenization
Stopword removal
Stemming/Lemmatization
TF-IDF converts text into numerical vectors.
The ML model predicts whether the job post is fake or genuine.
The result is displayed to the user.

🧠 Machine Learning Workflow
Data Preprocessing
Remove special characters
Convert text to lowercase
Remove stopwords
Tokenization
Feature Extraction
TF-IDF Vectorization
Model Training

Algorithms used:

Logistic Regression
Naive Bayes
Random Forest (optional)
📊 Dataset

The dataset contains:

Job title
Company profile
Description
Requirements
Salary range
Employment type
Fraudulent label
▶️ Installation & Setup
Clone Repository
git clone https://github.com/your-username/job-check.git
cd job-check
Install Dependencies
pip install -r requirements.txt
Run Application
python app.py
📈 Future Enhancements
Deep Learning integration
Resume-job matching
Fake company profile detection
Real-time job scraping
Email scam detection
🎯 Project Outcome

This project helps users identify suspicious job postings and reduces the risk of online job fraud using AI-powered text analysis.
