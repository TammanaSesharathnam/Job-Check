# Job-Check: Fake Job Detection Using NLP

## 📌 Overview
Job-Check is an NLP-based web application that helps users identify fraudulent job postings using Machine Learning and Natural Language Processing (NLP) techniques.

The system analyzes job descriptions, company details, salary information, and other textual features to predict whether a job posting is **Real** or **Fake**.

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
├── static/                # CSS and JavaScript files
├── templates/             # HTML templates
├── dataset/               # Fake job posting dataset
├── model/                 # Trained machine learning model
├── app.py                 # Main Flask application
├── train_model.py         # Model training script
├── requirements.txt       # Required Python libraries
└── README.md
```

---

## ⚙️ How It Works

1. User enters job posting details.
2. The system preprocesses the text using NLP techniques:
   - Tokenization
   - Stopword removal
   - Stemming/Lemmatization
3. TF-IDF converts text into numerical vectors.
4. The trained Machine Learning model predicts whether the job posting is fake or genuine.
5. The result is displayed to the user.

---

## 🧠 Machine Learning Workflow

### Data Preprocessing
- Remove special characters
- Convert text to lowercase
- Remove stopwords
- Tokenization

### Feature Extraction
- TF-IDF Vectorization

### Model Training
Algorithms used:
- Logistic Regression
- Naive Bayes
- Random Forest (optional)

---

## 📊 Dataset

The dataset contains:
- Job title
- Company profile
- Job description
- Requirements
- Salary range
- Employment type
- Fraudulent label

---

## ▶️ Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/your-username/job-check.git
cd job-check
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run the Application

```bash
python app.py
```

---

## 📈 Future Enhancements
- Deep Learning integration
- Resume-job matching
- Fake company profile detection
- Real-time job scraping
- Email scam detection

---

## 🎯 Project Outcome
This project helps users identify suspicious job postings and reduces the risk of online job fraud using AI-powered text analysis.

