import requests
import time

# 设置请求的URL和参数
url = "http://127.0.0.1:9862/tts"
params = {
    'text': '我是一个粉刷匠，粉刷本领强，擅长各种材料的粉刷，有一定的粉刷技巧。',
    'character': '派蒙',
    'save_temp': False
}

# 记录开始时间
start_time = time.time()

# 发送GET请求
response = requests.get(url, params=params)

# 检查请求是否成功
if response.status_code == 200:
    # 打开一个文件用于写入
    with open('./output.wav', 'wb') as file:
        file.write(response.content)
    print("文件已下载到本地")
else:
    print(f"请求失败，错误代码：{response.status_code}")

# 记录结束时间并计算运行时长
end_time = time.time()
elapsed_time = end_time - start_time
print(f"运行时间：{elapsed_time:.2f}秒")


# {
#     "method": "POST",
#     "body": {
#         "character": "胡桃",
#         "emotion": "default",
#         "text": "%E8%BF%99%E6%98%AF%E4%B8%80%E6%AE%B5%E5%AE%9E%E4%BE%8B%E9%9F%B3%E9%A2%91",
#         "text_language": "多语种混合"
#     }
# }
