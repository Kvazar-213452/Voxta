import os
import shutil

folder = 'dist'

if os.path.exists(folder):
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print(f'error del {file_path}: {e}')
else:
    print(f'error "{folder}" not found')
