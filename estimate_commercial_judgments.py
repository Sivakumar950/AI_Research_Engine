import json
import gzip
import sys

try:
    import requests
except ImportError:
    print("❌ requests is not installed. Please install it using: pip install requests")
    sys.exit(1)

BASE_URL = "https://court-cases-judgments.s3.ap-south-1.amazonaws.com/"
METADATA_PREFIX = "metadata/"
METADATA_INDEX_FILE = "index.json.gz"

def fetch_metadata_index():
    url = BASE_URL + METADATA_PREFIX + METADATA_INDEX_FILE
    print(f"📥 Downloading metadata index from {url}")
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    return gzip.decompress(response.content).decode("utf-8")

def estimate_commercial_cases():
    print("🔍 Scanning metadata for commercial suits...")
    try:
        raw_json = fetch_metadata_index()
        all_entries = json.loads(raw_json)
    except Exception as e:
        print(f"❌ Failed to fetch or decode metadata: {e}")
        return
    
    commercial_entries = []
    for entry in all_entries:
        case_title = entry.get("case_title", "").lower()
        case_type = entry.get("case_type", "").lower()
        if "commercial" in case_title or "commercial" in case_type:
            commercial_entries.append(entry)

    count = len(commercial_entries)
    avg_size_mb = 0.25  # Assume average size is 250 KB
    total_est_size_mb = count * avg_size_mb

    print(f"\n📊 Estimated Results:")
    print(f"• Total Commercial Suit PDFs: {count}")
    print(f"• Approximate Total Size: {total_est_size_mb:.2f} MB")
    print(f"• Estimated in GB: {total_est_size_mb / 1024:.2f} GB")

if __name__ == "__main__":
    estimate_commercial_cases()
