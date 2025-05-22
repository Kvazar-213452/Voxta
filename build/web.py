import shutil
import os

# web.py

src_dir = "../src/web"
dest_dir = "../dist/web"

if os.path.exists(dest_dir):
    shutil.rmtree(dest_dir)

shutil.copytree(src_dir, dest_dir)

print("end")
