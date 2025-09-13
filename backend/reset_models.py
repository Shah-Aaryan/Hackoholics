# reset_models.py
import os
import sys

def reset_models():
    """Reset model files to force retraining"""
    
    print("🔄 Resetting ML Models")
    print("=" * 30)
    
    # Remove existing model files
    model_files = [
        'models/trained_models.joblib',
        'models/trained_models.pkl',
        'app/models/trained_models.joblib',
        'app/models/trained_models.pkl'
    ]
    
    removed_count = 0
    for model_file in model_files:
        if os.path.exists(model_file):
            try:
                os.remove(model_file)
                print(f"✅ Removed: {model_file}")
                removed_count += 1
            except Exception as e:
                print(f"❌ Error removing {model_file}: {e}")
    
    if removed_count == 0:
        print("ℹ️  No model files found to remove")
    
    # Create models directory if it doesn't exist
    models_dir = 'models'
    if not os.path.exists(models_dir):
        os.makedirs(models_dir)
        print(f"✅ Created directory: {models_dir}")
    
    print(f"\n🎯 {removed_count} model files removed")
    print("📝 Next steps:")
    print("   1. Run: python populate_db.py")
    print("   2. Run: python run_server.py")
    print("   3. The models will be trained automatically on first request")

if __name__ == "__main__":
    reset_models()
