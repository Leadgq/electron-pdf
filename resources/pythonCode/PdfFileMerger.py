from PyPDF2 import  PdfMerger
import sys
import os
from pathlib import Path
#  pdf的合并和剪切 合并时会自动排序
def inject_site_packages():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    python_lib = os.path.abspath(os.path.join(base_dir, '..', 'python', 'python-3.13.5-embed-amd64', 'Lib', 'site-packages'))
    if python_lib not in sys.path:
        sys.path.insert(0, python_lib)
inject_site_packages()

def  pdfMerge(in_pdfList,out_pdf_path):
    try:
        merger = PdfMerger()
        for pdf in in_pdfList:
            merger.append(Path(pdf))
        merger.write(Path(out_pdf_path))
        merger.close()
        return str(Path(out_pdf_path))
    except Exception as e:
        print(f"合并过程中出错: {e}")
        raise Exception(f"合并过程中出错: {e}") 


if __name__ == "__main__":
    in_pdfList = sys.argv[1:-1]
    out_pdf_path = sys.argv[-1]
    pdfMerge(in_pdfList,out_pdf_path)
    print("合并完成")