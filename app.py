from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from statsmodels.tsa.statespace.sarimax import SARIMAX
from datetime import datetime, timedelta
import json

app = Flask(__name__)
CORS(app)

# Load the data
try:
    df = pd.read_excel('commodities.xlsx', index_col=0, parse_dates=True)
except FileNotFoundError:
    from commodities import generate_price_data
    df = generate_price_data()
    df.to_excel('commodities.xlsx', index=True)

@app.route('/api/commodities', methods=['GET'])
def get_commodities():
    return jsonify(list(df.columns))

@app.route('/api/data', methods=['GET'])
def get_data():
    commodity = request.args.get('commodity', 'Wheat')  # Default to Wheat if not specified
    data = df[commodity].reset_index()
    data.columns = ['date', 'price']
    return jsonify({
        'dates': data['date'].dt.strftime('%Y-%m-%d').tolist(),
        'prices': data['price'].round(2).tolist()
    })

@app.route('/api/stats', methods=['GET'])
def get_stats():
    commodity = request.args.get('commodity', 'Wheat')
    current_price = df[commodity].iloc[-1]
    avg_price = df[commodity].mean()
    max_price = df[commodity].max()
    min_price = df[commodity].min()
    
    return jsonify({
        'current': round(current_price, 2),
        'average': round(avg_price, 2),
        'highest': round(max_price, 2),
        'lowest': round(min_price, 2)
    })

@app.route('/api/predict', methods=['POST'])
def predict_price():
    data = request.json
    months = int(data.get('months', 1))
    commodity = data.get('commodity', 'Wheat')
    
    # Fit SARIMA model
    model = SARIMAX(df[commodity], order=(1, 1, 1), seasonal_order=(1, 1, 1, 12))
    results = model.fit()
    
    # Make prediction
    forecast = results.forecast(steps=months)
    
    # Generate future dates
    last_date = df.index[-1]
    future_dates = pd.date_range(start=last_date + timedelta(days=1), periods=months, freq='M')
    
    return jsonify({
        'dates': future_dates.strftime('%Y-%m-%d').tolist(),
        'predictions': forecast.round(2).tolist()
    })

if __name__ == '__main__':
    app.run(debug=True) 