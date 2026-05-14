import joblib
try:
    # Now testing the actual model.pkl and vectorizer.pkl (restored from job_model.pkl and tfidf.pkl)
    model = joblib.load("d:/JobCheck/backend/model.pkl")
    vectorizer = joblib.load("d:/JobCheck/backend/vectorizer.pkl")
    print("Success: model.pkl and vectorizer.pkl (Original Model) loaded successfully with joblib.")
    print(f"Model type: {type(model)}")
    print(f"Vectorizer type: {type(vectorizer)}")
    
    # Test a prediction
    test_text = "Software Engineer with 5 years of experience in Java and Spring Boot."
    X = vectorizer.transform([test_text])
    pred = model.predict(X)[0]
    print(f"Prediction for '{test_text}': {pred} (Expected 0 for Real)")
    
    # Test a fake-looking one
    fake_text = "Urgent hiring! Earn $500 per day working from home. No experience needed. Click now!"
    X_fake = vectorizer.transform([fake_text])
    pred_fake = model.predict(X_fake)[0]
    print(f"Prediction for '{fake_text}': {pred_fake} (Expected 1 for Fake)")

except Exception as e:
    print(f"Error: {e}")
