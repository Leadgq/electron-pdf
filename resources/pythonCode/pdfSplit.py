from PyPDF2 import PdfWriter, PdfReader
import sys
import os
#  pdf的合并和剪切 合并时会自动排序
def inject_site_packages():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    python_lib = os.path.abspath(os.path.join(base_dir, '..', 'python', 'python-3.13.5-embed-amd64', 'Lib', 'site-packages'))
    if python_lib not in sys.path:
        sys.path.insert(0, python_lib)
inject_site_packages()

def pdf_split(pdf_in_path, pdf_out_path, start, end):
    try:
        out = PdfWriter()
        with open(pdf_in_path, 'rb') as f:
            pdf = PdfReader(f)
            for i in range(start, end):
                out.add_page(pdf.pages[i])
            with open(pdf_out_path, 'wb') as fout:
                out.write(fout)
        print(f"文件 {pdf_in_path} 已成功转换为 {pdf_out_path}")
        return pdf_out_path
    except Exception as e:
        print(f"转换过程中出错: {e}")
        raise e

if __name__ == "__main__":
    pdf_in_path = sys.argv[1]
    pdf_out_path = sys.argv[2]
    # 默认值 如果没有传入 则默认从 0 开始
    start = int(sys.argv[3]) if len(sys.argv) > 3 else 0
    # 默认值 如果没有传入 则默认到最后一页
    with open(pdf_in_path, 'rb') as f:
        pdf = PdfReader(f)
        end = int(sys.argv[4]) if len(sys.argv) > 4 else pdf.getNumPages()
    pdf_split(pdf_in_path, pdf_out_path, start, end)