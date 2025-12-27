"""
Exploratory Data Analysis (EDA) for Heart Disease Dataset
This script performs comprehensive EDA with professional visualizations:
- Histograms of features
- Correlation heatmap
- Class balance analysis
- Feature distributions by target
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os

# Set style for professional visualizations
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (14, 10)

def load_raw_data(path='data/heart.csv'):
    """Load the raw dataset for EDA"""
    if not os.path.exists(path):
        raise FileNotFoundError(f"Dataset not found at {path}")
    return pd.read_csv(path)

def eda_basic_info(df):
    """Display basic information about the dataset"""
    print("="*70)
    print("DATASET OVERVIEW")
    print("="*70)
    print(f"\nShape: {df.shape}")
    print(f"\nData Types:\n{df.dtypes}")
    print(f"\nMissing Values:\n{df.isnull().sum()}")
    print(f"\nBasic Statistics:\n{df.describe()}")
    print(f"\nTarget Distribution:")
    print(df['target'].value_counts())

def plot_class_balance(df):
    """Visualize class balance (heart disease presence/absence)"""
    print("\n" + "="*70)
    print("CLASS BALANCE ANALYSIS")
    print("="*70)
    
    fig, axes = plt.subplots(1, 2, figsize=(12, 4))
    
    # Count plot
    counts = df['target'].value_counts()
    colors = ['#2ecc71', '#e74c3c']  # Green for no disease, red for disease
    axes[0].bar(['No Disease', 'Disease Present'], counts.values, color=colors)
    axes[0].set_ylabel('Count')
    axes[0].set_title('Class Distribution (Absolute)')
    axes[0].grid(axis='y', alpha=0.3)
    
    # Pie chart
    labels = ['No Disease', 'Disease Present']
    axes[1].pie(counts.values, labels=labels, autopct='%1.1f%%', colors=colors, startangle=90)
    axes[1].set_title('Class Balance (Percentage)')
    
    plt.tight_layout()
    os.makedirs('plots', exist_ok=True)
    plt.savefig('plots/class_balance.png', dpi=300, bbox_inches='tight')
    print("✓ Class balance plot saved to plots/class_balance.png")
    plt.close()

def plot_feature_distributions(df):
    """Plot histograms of all features"""
    print("\n" + "="*70)
    print("FEATURE DISTRIBUTIONS")
    print("="*70)
    
    # Exclude target column
    feature_cols = [col for col in df.columns if col != 'target']
    
    fig, axes = plt.subplots(4, 4, figsize=(16, 12))
    axes = axes.flatten()
    
    for idx, col in enumerate(feature_cols):
        ax = axes[idx]
        
        # Plot histogram
        ax.hist(df[col].dropna(), bins=20, color='#3498db', alpha=0.7, edgecolor='black')
        ax.set_title(f'{col}', fontsize=10, fontweight='bold')
        ax.set_xlabel('Value')
        ax.set_ylabel('Frequency')
        ax.grid(axis='y', alpha=0.3)
    
    # Remove extra subplots
    for idx in range(len(feature_cols), len(axes)):
        fig.delaxes(axes[idx])
    
    plt.tight_layout()
    plt.savefig('plots/feature_distributions.png', dpi=300, bbox_inches='tight')
    print("✓ Feature distribution histograms saved to plots/feature_distributions.png")
    plt.close()

def plot_correlation_heatmap(df):
    """Plot correlation heatmap"""
    print("\n" + "="*70)
    print("CORRELATION ANALYSIS")
    print("="*70)
    
    # Calculate correlation matrix
    corr_matrix = df.corr(numeric_only=True)
    
    fig, ax = plt.subplots(figsize=(12, 10))
    
    # Create heatmap
    sns.heatmap(corr_matrix, annot=True, fmt='.2f', cmap='coolwarm', 
                center=0, square=True, linewidths=1, cbar_kws={"shrink": 0.8},
                ax=ax, vmin=-1, vmax=1)
    
    ax.set_title('Feature Correlation Heatmap', fontsize=14, fontweight='bold', pad=20)
    
    plt.tight_layout()
    plt.savefig('plots/correlation_heatmap.png', dpi=300, bbox_inches='tight')
    print("✓ Correlation heatmap saved to plots/correlation_heatmap.png")
    plt.close()
    
    # Print strongest correlations with target
    print("\nTop features correlated with Heart Disease (target):")
    target_corr = corr_matrix['target'].sort_values(ascending=False)
    print(target_corr.head(10))

def plot_feature_by_target(df):
    """Plot feature distributions stratified by target"""
    print("\n" + "="*70)
    print("FEATURE ANALYSIS BY TARGET")
    print("="*70)
    
    feature_cols = [col for col in df.columns if col != 'target'][:8]  # Top 8 features
    
    fig, axes = plt.subplots(2, 4, figsize=(16, 8))
    axes = axes.flatten()
    
    for idx, col in enumerate(feature_cols):
        ax = axes[idx]
        
        # Box plot
        data_no_disease = df[df['target'] == 0][col].dropna()
        data_disease = df[df['target'] == 1][col].dropna()
        
        bp = ax.boxplot([data_no_disease, data_disease], labels=['No Disease', 'Disease'],
                        patch_artist=True, widths=0.6)
        
        # Color the boxes
        colors = ['#2ecc71', '#e74c3c']
        for patch, color in zip(bp['boxes'], colors):
            patch.set_facecolor(color)
            patch.set_alpha(0.7)
        
        ax.set_title(f'{col}', fontsize=10, fontweight='bold')
        ax.set_ylabel('Value')
        ax.grid(axis='y', alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('plots/features_by_target.png', dpi=300, bbox_inches='tight')
    print("✓ Feature distributions by target saved to plots/features_by_target.png")
    plt.close()

def run_eda():
    """Run complete EDA pipeline"""
    print("\n" + "="*70)
    print("EXPLORATORY DATA ANALYSIS (EDA)")
    print("="*70)
    
    # Load data
    df = load_raw_data()
    
    # Basic info
    eda_basic_info(df)
    
    # Visualizations
    plot_class_balance(df)
    plot_feature_distributions(df)
    plot_correlation_heatmap(df)
    plot_feature_by_target(df)
    
    print("\n" + "="*70)
    print("EDA COMPLETE - All plots saved to plots/ directory")
    print("="*70)

if __name__ == "__main__":
    run_eda()
