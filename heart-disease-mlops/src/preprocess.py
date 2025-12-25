import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

def preprocess_data(df):
    # Handle missing values
    df = df.fillna(df.mean())
    
    # Scale features
    scaler = StandardScaler()
    features = ['age', 'trestbps', 'chol', 'thalach', 'oldpeak']
    df[features] = scaler.fit_transform(df[features])
    
    return df

if __name__ == "__main__":
    if not os.path.exists('data/heart.csv'):
        print("Data file not found!")
    else:
        df = pd.read_csv('data/heart.csv')
        df_clean = preprocess_data(df)
        df_clean.to_csv('data/heart_processed.csv', index=False)
        print("Data processed and saved to data/heart_processed.csv")
