from docx import Document
import sys

def convert_docx_to_txt(docx_path, txt_path):
    doc = Document(docx_path)
    with open(txt_path, 'w', encoding='utf-8') as f:
        for paragraph in doc.paragraphs:
            f.write(paragraph.text + '\n')

if __name__ == "__main__":
    input_file = "Copy of Next.js SEO best practices research.docx"
    output_file = "seo_best_practices.txt"
    convert_docx_to_txt(input_file, output_file)
    print(f"Converted {input_file} to {output_file}") 