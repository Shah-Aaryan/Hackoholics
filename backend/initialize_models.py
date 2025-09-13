# backend/initialize_models.py
import joblib
import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder

def create_initial_model():
    """Create initial empty model structure"""
    model_data = {
        'nmf_model': None,
        'kmeans': None,
        'household_clusters': pd.Series([], dtype='int64'),
        'similarity_df': pd.DataFrame(),
        'predicted_ratings': pd.DataFrame(),
        'scaler': StandardScaler(),
        'label_encoders': {
            'type': LabelEncoder().fit(['house', 'apartment', 'condo']),
            'income_level': LabelEncoder().fit(['low', 'medium', 'high'])
        },
        'model_version': '1.0.0',
        'status': 'empty'
    }
    return model_data

# Create the model file
model_data = create_initial_model()
joblib.dump(model_data, 'models/trained_models.joblib')
print(" Model file created at models/trained_models.joblib")