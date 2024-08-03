import os
import glob

def get_all_files(directory, extension=None):
    files_list = []
    for file in glob.glob(directory + '/**/*', recursive=True):
        if extension is not None:
            if os.path.isfile(file) and file.endswith(extension):
                files_list.append(file)         
        else:
            if os.path.isfile(file):
                files_list.append(file)  
    return files_list
# 示例用法

def get_immediate_subdirectories(directory):
    return [name for name in os.listdir(directory) if os.path.isdir(os.path.join(directory, name))]

# 示例用法
directory_path = 'web/static/live2d_model'
extension = '.model3.json'
cubism4Model = get_all_files(directory_path, extension)

# 获取 web/static/live2d_model 下的一级目录
model_list = get_immediate_subdirectories(directory_path)

print(cubism4Model)
print(model_list)
