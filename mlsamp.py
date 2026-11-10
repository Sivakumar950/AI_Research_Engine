import os
import sys

try:
    import fitz  # PyMuPDF
except ImportError:
    print("❌ PyMuPDF is not installed. Please install it using: pip install pymupdf")
    sys.exit(1)

def get_default_pdf_folder():
    # Check command line arg first
    if len(sys.argv) > 1 and os.path.isdir(sys.argv[1]):
        return sys.argv[1]
    
    # Check parent directory (ResearchEngine workspace root)
    parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    if any(f.lower().endswith(".pdf") for f in os.listdir(parent_dir)):
        return parent_dir
    
    # Check current directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    if any(f.lower().endswith(".pdf") for f in os.listdir(current_dir)):
        return current_dir

    return parent_dir

pdf_folder = get_default_pdf_folder()
output_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "compiled_laws.txt")

def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        doc = fitz.open(pdf_path)
        for page in doc:
            text += page.get_text()
        doc.close()
    except Exception as e:
        print(f"❌ Error reading {pdf_path}: {e}")
    return text

def main():
    print(f"📂 Scanning PDF folder: {pdf_folder}")
    if not os.path.exists(pdf_folder):
        print(f"❌ Folder not found: {pdf_folder}")
        return

    pdf_files = [f for f in os.listdir(pdf_folder) if f.lower().endswith(".pdf")]
    if not pdf_files:
        print(f"⚠️ No PDF files found in {pdf_folder}")
        return

    print(f"📄 Found {len(pdf_files)} PDF file(s). Compiling...")
    with open(output_file, "w", encoding="utf-8") as out:
        for filename in sorted(pdf_files):
            full_path = os.path.join(pdf_folder, filename)
            print(f"  • Processing: {filename}")
            text = extract_text_from_pdf(full_path)
            out.write(f"\n\n===== {filename} =====\n\n")
            out.write(text)

    print(f"\n✅ All PDF texts combined into: {output_file}")

if __name__ == "__main__":
    main()
