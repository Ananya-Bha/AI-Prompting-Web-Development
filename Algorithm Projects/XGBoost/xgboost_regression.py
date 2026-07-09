import argparse
import logging
from pathlib import Path

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
import xgboost as xgb


def parse_args() -> argparse.Namespace:
	parser = argparse.ArgumentParser(description="Train and evaluate an XGBoost regression model.")
	parser.add_argument("--csv", type=Path, default=Path("data.csv"), help="Path to the training CSV data.")
	parser.add_argument("--target", type=str, default=None, help="Name of the target column. Defaults to the last column.")
	parser.add_argument("--test-size", type=float, default=0.2, help="Proportion of samples to include in the test split.")
	parser.add_argument("--random-state", type=int, default=42, help="Random seed used for train/test split and model training.")
	parser.add_argument("--model-out", type=Path, default=Path("xgboost_regressor.joblib"), help="Output path for the trained model pipeline.")
	return parser.parse_args()


def load_dataset(csv_path: Path) -> pd.DataFrame:
	if not csv_path.exists():
		raise FileNotFoundError(f"CSV file not found at {csv_path.resolve()}")
	return pd.read_csv(csv_path)


def split_features_target(df: pd.DataFrame, target_column: str | None) -> tuple[pd.DataFrame, pd.Series]:
	if df.empty:
		raise ValueError("Input dataset is empty.")
	if target_column is None:
		target_column = df.columns[-1]
	if target_column not in df.columns:
		raise ValueError(f"Target column '{target_column}' not found in dataset columns: {list(df.columns)}")
	X = df.drop(columns=[target_column])
	y = df[target_column]
	if X.empty:
		raise ValueError("Feature set is empty after removing the target column.")
	return X, y


def build_preprocessor(features: pd.DataFrame) -> ColumnTransformer:
	numeric_features = features.select_dtypes(include=["number"]).columns.tolist()
	categorical_features = [col for col in features.columns if col not in numeric_features]

	transformers = []
	if numeric_features:
		numeric_transformer = Pipeline(
			steps=[
				("imputer", SimpleImputer(strategy="median")),
				("scaler", StandardScaler()),
			]
		)
		transformers.append(("numeric", numeric_transformer, numeric_features))

	if categorical_features:
		categorical_transformer = Pipeline(
			steps=[
				("imputer", SimpleImputer(strategy="most_frequent")),
				("encoder", OneHotEncoder(handle_unknown="ignore")),
			]
		)
		transformers.append(("categorical", categorical_transformer, categorical_features))

	if not transformers:
		raise ValueError("No numeric or categorical features detected for preprocessing.")

	return ColumnTransformer(transformers=transformers)


def train_pipeline(
	X: pd.DataFrame,
	y: pd.Series,
	test_size: float,
	random_state: int,
) -> tuple[Pipeline, pd.Series, pd.Series]:
	X_train, X_test, y_train, y_test = train_test_split(
		X,
		y,
		test_size=test_size,
		random_state=random_state,
	)

	preprocessor = build_preprocessor(X_train)
	regressor = xgb.XGBRegressor(
		objective="reg:squarederror",
		n_estimators=300,
		learning_rate=0.05,
		max_depth=6,
		subsample=0.8,
		colsample_bytree=0.8,
		reg_lambda=1.0,
		random_state=random_state,
		n_jobs=-1,
	)

	pipeline = Pipeline(
		steps=[
			("preprocessor", preprocessor),
			("regressor", regressor),
		]
	)

	pipeline.fit(X_train, y_train)
	return pipeline, y_test, pipeline.predict(X_test)


def evaluate(y_true: pd.Series, y_pred: pd.Series) -> dict[str, float]:
	mse = mean_squared_error(y_true, y_pred)
	rmse = mse**0.5
	r2 = r2_score(y_true, y_pred)
	return {"mse": mse, "rmse": rmse, "r2": r2}


def main() -> None:
	logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
	args = parse_args()

	logging.info("Loading dataset from %s", args.csv)
	data = load_dataset(args.csv)

	X, y = split_features_target(data, args.target)
	logging.info("Dataset loaded: %s samples, %s features", X.shape[0], X.shape[1])

	pipeline, y_true, y_pred = train_pipeline(
		X=X,
		y=y,
		test_size=args.test_size,
		random_state=args.random_state,
	)

	metrics = evaluate(y_true, y_pred)
	logging.info("Evaluation metrics -> MSE: %.4f, RMSE: %.4f, R2: %.4f", metrics["mse"], metrics["rmse"], metrics["r2"])

	if args.model_out:
		args.model_out.parent.mkdir(parents=True, exist_ok=True)
		joblib.dump(pipeline, args.model_out)
		logging.info("Model pipeline saved to %s", args.model_out)


if __name__ == "__main__":
	main()
