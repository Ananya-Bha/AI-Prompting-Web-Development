"""Train a LightGBM regressor on a CSV dataset."""

from __future__ import annotations

import argparse
import pathlib
from dataclasses import dataclass

import lightgbm as lgb
import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split


@dataclass
class TrainingConfig:
    dataset_path: pathlib.Path
    target_column: str
    test_size: float
    random_state: int
    learning_rate: float
    num_leaves: int
    n_estimators: int
    min_data_in_leaf: int
    model_output: pathlib.Path | None


def parse_args() -> TrainingConfig:
    parser = argparse.ArgumentParser(description="LightGBM regression trainer")
    parser.add_argument(
        "--dataset",
        type=pathlib.Path,
        default=pathlib.Path("data/random_regression_data.csv"),
        help="Path to the CSV dataset.",
    )
    parser.add_argument(
        "--target",
        default="target",
        help="Name of the target column in the dataset.",
    )
    parser.add_argument(
        "--test-size",
        type=float,
        default=0.2,
        help="Fraction of samples reserved for validation (0.0, 1.0).",
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=2025,
        help="Random seed for reproducibility.",
    )
    parser.add_argument(
        "--learning-rate",
        type=float,
        default=0.1,
        help="LightGBM learning rate.",
    )
    parser.add_argument(
        "--num-leaves",
        type=int,
        default=31,
        help="Maximum leaves for base learners.",
    )
    parser.add_argument(
        "--n-estimators",
        type=int,
        default=300,
        help="Number of boosting iterations.",
    )
    parser.add_argument(
        "--min-data-in-leaf",
        type=int,
        default=15,
        help="Minimum number of samples per leaf.",
    )
    parser.add_argument(
        "--model-output",
        type=pathlib.Path,
        default=None,
        help="Optional path to serialize the fitted LightGBM model (joblib format).",
    )

    args = parser.parse_args()

    return TrainingConfig(
        dataset_path=args.dataset,
        target_column=args.target,
        test_size=args.test_size,
        random_state=args.seed,
        learning_rate=args.learning_rate,
        num_leaves=args.num_leaves,
        n_estimators=args.n_estimators,
        min_data_in_leaf=args.min_data_in_leaf,
        model_output=args.model_output,
    )


def validate_dataset(dataset_path: pathlib.Path, target_column: str) -> pd.DataFrame:
    if not dataset_path.exists():
        raise FileNotFoundError(f"Dataset not found: {dataset_path}")

    df = pd.read_csv(dataset_path)
    if target_column not in df.columns:
        raise ValueError(
            f"Target column '{target_column}' not found. Available columns: {df.columns.tolist()}"
        )

    if df.isnull().any().any():
        raise ValueError("Dataset contains missing values; please clean or impute before training.")

    return df


def train_model(config: TrainingConfig) -> None:
    df = validate_dataset(config.dataset_path, config.target_column)

    X = df.drop(columns=[config.target_column])
    y = df[config.target_column]

    X_train, X_valid, y_train, y_valid = train_test_split(
        X,
        y,
        test_size=config.test_size,
        random_state=config.random_state,
    )

    model = lgb.LGBMRegressor(
        learning_rate=config.learning_rate,
        num_leaves=config.num_leaves,
        n_estimators=config.n_estimators,
        min_data_in_leaf=config.min_data_in_leaf,
        objective="regression",
        random_state=config.random_state,
    )

    model.fit(
        X_train,
        y_train,
        eval_set=[(X_valid, y_valid)],
        eval_metric="l2",
        callbacks=[
            lgb.early_stopping(stopping_rounds=25, verbose=False),
            lgb.log_evaluation(period=50),
        ],
    )

    y_pred = model.predict(X_valid)
    rmse = float(np.sqrt(mean_squared_error(y_valid, y_pred)))
    mae = mean_absolute_error(y_valid, y_pred)
    r2 = r2_score(y_valid, y_pred)

    print("Validation metrics")
    best_iteration = getattr(model, "best_iteration_", None) or model.n_estimators
    print(f"  Best iteration: {best_iteration}")
    print(f"  RMSE: {rmse:.4f}")
    print(f"  MAE : {mae:.4f}")
    print(f"  R^2 : {r2:.4f}")

    if config.model_output is not None:
        config.model_output.parent.mkdir(parents=True, exist_ok=True)
        output_path = (
            config.model_output
            if config.model_output.suffix
            else config.model_output.with_suffix(".pkl")
        )
        try:
            import joblib  # lazy import to keep dependency optional until needed
        except ImportError as exc:  # pragma: no cover - defensive
            raise RuntimeError("joblib is required to serialize the model.") from exc

        joblib.dump(model, output_path)
        print(f"Saved trained model to {output_path}")


def main() -> None:
    config = parse_args()
    train_model(config)


if __name__ == "__main__":
    main()
