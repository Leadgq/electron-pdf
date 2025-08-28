import sys
import os

# pdf和world相互转换

# 自动注入嵌入式 python site-packages 路径
def inject_site_packages():
  base_dir = os.path.dirname(os.path.abspath(__file__))
  # 适配你的嵌入式目录结构（根据实际路径调整）
  python_lib = os.path.abspath(os.path.join(base_dir, '..', 'python', 'python-3.13.5-embed-amd64', 'Lib', 'site-packages'))
  if python_lib not in sys.path:
    sys.path.insert(0, python_lib)
inject_site_packages()

from pdf2docx import Converter
import docx2pdf
from pathlib import Path

def pdf_to_docx(pdf: Path, docx: Path):
  try:
    cv = Converter(str(pdf))
    cv.convert(str(docx), start=0, end=None)
    cv.close()
    print(f"文件 {pdf} 已成功转换为 {docx}")
    return True
  except Exception as e:
    print(f"转换过程中出错: {e}")
    raise

def docx_to_pdf(docx: Path, pdf: Path):
    try:
        # 确保目标目录存在
        out_dir = pdf.parent
        out_dir.mkdir(parents=True, exist_ok=True)
        docx2pdf.convert(str(docx), str(pdf))
        print(f"文件 {docx} 已成功转换为 {pdf}")
        return True
    except Exception as e:
        print(f"docx 转 pdf 过程中出错: {e}")
        return False

if __name__ == '__main__':
  pdf_path = sys.argv[1]
  docx_path = sys.argv[2]
  action = sys.argv[3]
  if action == 'convert-pdf-to-docx':
    pdf = Path(pdf_path)
    docx = Path(docx_path)
    pdf_to_docx(pdf, docx)
  elif action == 'convert-docx-to-pdf':
    docx = Path(docx_path)
    pdf = Path(pdf_path)
    docx_to_pdf(docx, pdf)
