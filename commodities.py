import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_price_data():
    # Generate dates for last 5 years of monthly data
    end_date = datetime.now()
    start_date = end_date - timedelta(days=5*365)
    dates = pd.date_range(start=start_date, end=end_date, freq='M')

    # Base prices for each commodity
    base_prices = {
        'Potato': 20,
        'Onion': 25,
        'Gram': 60,
        'Tur': 90,
        'Wheat': 30
    }

    # Generate synthetic data with seasonal patterns and trends
    data = {}
    for commodity, base_price in base_prices.items():
        # Add seasonal variation (higher in winter for vegetables)
        seasonal = np.sin(np.linspace(0, 10*np.pi, len(dates)))
        
        # Add trend (general increase over time)
        trend = np.linspace(0, 15, len(dates))
        
        # Add random variations
        noise = np.random.normal(0, 2, len(dates))
        
        # Combine components with different weights for each commodity
        if commodity in ['Potato', 'Onion']:
            # More seasonal variation for vegetables
            prices = base_price + 10*seasonal + trend + 2*noise
        elif commodity in ['Gram', 'Tur']:
            # More stable prices for pulses with occasional spikes
            prices = base_price + 5*seasonal + 1.5*trend + 3*noise
        else:  # Wheat
            # Moderate variations
            prices = base_price + 7*seasonal + trend + 2*noise
        
        # Ensure no negative prices
        prices = np.maximum(prices, base_price * 0.5)
        data[commodity] = prices

    # Create DataFrame
    df = pd.DataFrame(data, index=dates)
    return df

if __name__ == "__main__":
    df = generate_price_data()
    df.to_excel("commodities.xlsx", index=True)
    print("Generated price data for all commodities") 