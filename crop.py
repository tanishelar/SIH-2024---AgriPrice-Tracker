
import numpy as np
import matplotlib.pyplot as plt
import statsmodels.api as sms
import pandas as pd
from statsmodels.tsa.stattools import adfuller
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf


def adfuller_test(sales):
    """
    Perform Augmented Dickey-Fuller test for stationarity
    Ho: It is non stationary
    H1: It is stationary
    """
    result = adfuller(sales)
    labels = ['ADF Test Statistic', 'p-value', '#Lags Used', 'Number of Observations Used']
    for value, label in zip(result, labels):
        print(label + ' : ' + str(value))
    if result[1] <= 0.05:
        print("strong evidence against the null hypothesis(Ho), reject the null hypothesis. Data has no unit root and is stationary")
    else:
        print("weak evidence against null hypothesis, time series has a unit root, indicating it is non-stationary ")

def main():
    
    df = pd.read_excel('wheat.xlsx', index_col='Date', parse_dates=True)
    df.index.freq = 'MS'  # Set frequency to monthly
    print('Shape of data', df.shape)

    
    df = df[['Gujarat']]

    #Display basic info
    print("\nNull values:")
    print(df.isnull().sum())
    print("\nDataset info:")
    df.info()

    # intitial data ghatla
    plt.figure(figsize=(10, 5))
    df.plot(color='blue')
    plt.show()

    # Perform stationarity tests
    print("\nOriginal Data Stationarity Test:")
    adfuller_test(df)

    # comparison analysis
    differences = [1, 2, 3, 6, 12]
    for diff in differences:
        print(f"\n{diff} month(s) difference test:")
        df[f'Gujarat Price {diff} Difference'] = df['Gujarat'] - df['Gujarat'].shift(diff)
        adfuller_test(df[f'Gujarat Price {diff} Difference'].dropna())

    # Plot ACF and PACF
    plt.figure(figsize=(10, 5))
    plot_pacf(df["Gujarat Price 1 Difference"].dropna())
    plt.title("PACF Plot")
    plt.show()

    plt.figure(figsize=(10, 5))
    plot_acf(df["Gujarat Price 1 Difference"].dropna())
    plt.title("ACF Plot")
    plt.show()

    # Split data into train and test
    train = df.loc[:'2022-07-01', 'Gujarat']
    test = df.loc['2022-07-01':, 'Gujarat']

    
    
    """
    # Forecasting (uncomment and complete as needed)
    n_periods = len(test)
    forecast, conf_int = auto_arima_model.predict(n_periods=n_periods, return_conf_int=True)
    
    forecast_index = test.index
    forecast_series = pd.Series(forecast, index=forecast_index)

    plt.figure(figsize=(10, 6))
    plt.plot(train.index, train, label='Training')
    plt.plot(test.index, test, label='Actual')
    plt.plot(forecast_series.index, forecast_series, label='Predicted')
    plt.fill_between(
        forecast_series.index,
        conf_int[:, 0],
        conf_int[:, 1],
        alpha=0.2,
        label='Confidence Interval'
    )
    plt.title('Forecast vs Actual')
    plt.legend()
    plt.show()

    mae = np.mean(np.abs(test - forecast_series))
    print(f'MAE: {mae}')
    """

if __name__ == "__main__":
    main()