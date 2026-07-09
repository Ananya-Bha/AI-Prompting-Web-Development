# XGBoost Regression Pipeline

This project trains an XGBoost regression model from a CSV dataset using a preprocessing and training pipeline.

## Setup

1. Create a virtual environment and install dependencies:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   ```

## Usage

1. Place your dataset CSV in this folder (defaults to `data.csv`).
2. Run the training script:
   ```bash
   python xgboost_regression.py --csv data.csv --target target_column --model-out models/xgb_pipeline.joblib
   ```

### Arguments

- `--csv`: Path to the CSV dataset (default: `data.csv`).
- `--target`: Target column name (defaults to the last column if omitted).
- `--test-size`: Fraction of data held out for evaluation (default: `0.2`).
- `--random-state`: Random seed for reproducible splits (default: `42`).
- `--model-out`: File path to store the trained pipeline (default: `xgboost_regressor.joblib`).

The script prints mean squared error, root mean squared error, and R^2 on the test split and saves the trained pipeline for later inference.
