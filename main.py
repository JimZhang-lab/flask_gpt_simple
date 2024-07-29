# 在开头加入路径
import os, sys
import importlib

now_dir = os.getcwd()
sys.path.append(now_dir)
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.common_config_manager import __version__, api_config
import soundfile as sf
from flask import Flask, request, jsonify, send_file, stream_with_context, Response
import tempfile
import json

# 将当前文件所在的目录添加到 sys.path
from Synthesizers.base import Base_TTS_Task, Base_TTS_Synthesizer

# 创建合成器实例
tts_synthesizer: Base_TTS_Synthesizer = None

def set_tts_synthesizer(synthesizer: Base_TTS_Synthesizer):
    global tts_synthesizer
    tts_synthesizer = synthesizer

# 存储临时文件的字典
temp_files = {}

def character_list():
    res = jsonify(tts_synthesizer.get_characters())
    return res

def tts():
    from time import time as tt
    t1 = tt()
    print(f"Request Time: {t1}")
    
    # 尝试从JSON中获取数据，如果不是JSON，则从查询参数中获取
    if request.method == "GET":
        data = request.args
    else:
        data = request.get_json()
    
    task: Base_TTS_Task = tts_synthesizer.params_parser(data)

    if task.task_type == "text" and task.text.strip() == "":
        return jsonify({"detail": "Text is empty"}), 400
    elif task.task_type == "ssml" and task.ssml.strip() == "":
        return jsonify({"detail": "SSML is empty"}), 400
    md5_value = task.md5
    if task.stream == False:
        # TODO: use SQL instead of dict
        if task.save_temp and md5_value in temp_files:
            return send_file(temp_files[md5_value], mimetype=f'audio/{task.format}')
        else:
            # 假设 gen 是你的音频生成器
            try:
                save_path = tts_synthesizer.generate(task, return_type="filepath")
            except Exception as e:
                return jsonify({"detail": str(e)}), 500
            if task.save_temp:
                temp_files[md5_value] = save_path

            t2 = tt()
            print(f"total time: {t2-t1}")
            # 返回文件响应，send_file 会负责将文件发送给客户端
            return send_file(save_path, mimetype=f"audio/{task.format}", download_name=os.path.basename(save_path))
    else:
        gen = tts_synthesizer.generate(task, return_type="numpy")
        return Response(stream_with_context(gen), mimetype='audio/wav')


from gevent import monkey
monkey.patch_all()
from threading import Thread
from web import create_app
from gevent.pywsgi import WSGIServer
    
if __name__ == '__main__':
    # 动态导入合成器模块, 此处可写成 from Synthesizers.xxx import TTS_Synthesizer, TTS_Task
    from importlib import import_module
    from src.api_utils import get_localhost_ipv4_address
    synthesizer_name = api_config.synthesizer
    synthesizer_module = import_module(f"Synthesizers.{synthesizer_name}")
    TTS_Synthesizer = synthesizer_module.TTS_Synthesizer
    TTS_Task = synthesizer_module.TTS_Task
    # 初始化合成器的类
    tts_synthesizer = TTS_Synthesizer(debug_mode=True)
    
    # 生成一句话充当测试，减少第一次请求的等待时间
    gen = tts_synthesizer.generate(tts_synthesizer.params_parser({"text": "你好，世界"}))
    next(gen)
    
    tts_host = api_config.tts_host
    tts_port = api_config.tts_port
    ipv4_address = get_localhost_ipv4_address(tts_host)
    ipv4_link = f"http://{ipv4_address}:{tts_port}"
    # print(f"INFO:     Local Network URL: {ipv4_link}")
    
    
    app_tts = Flask(__name__)

    # 设置CORS
    @app_tts.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response

    app_tts.add_url_rule('/tts', 'tts', tts, methods=["GET", "POST"])
    app_tts.add_url_rule('/character_list', 'character_list', character_list, methods=["GET"])
    # app.run(host=tts_host, port=tts_port)
    app_main = create_app('dev')
    main_app_port = 5000
    local_host = '127.0.0.1'
    
    
    def run_main_app():
        try:
            print("Starting main app...")
            http_server = WSGIServer(('127.0.0.1', 5000), app_main)
            http_server.serve_forever()
        except Exception as e:
            print(f"Error starting main app: {e}")
        finally:
            print("Main app stopped.")

    def run_tts_app():
        try:
            print(f"Starting TTS app on {local_host}:{tts_port}...")
            http_server = WSGIServer((tts_host, tts_port), app_tts)
            http_server.serve_forever()
        except Exception as e:
            print(f"Error starting TTS app: {e}")
        finally:
            print("TTS app stopped.")

    thread_main = Thread(target=run_main_app)
    thread_main.start()
    thread_tts = Thread(target=run_tts_app)
    thread_tts.start()
    
    if os.name == 'nt':
        os.system('cls')
    else:
        os.system('clear')
    
    print('=========== start success ===========',end='\n\n')
    
    print(f"INFO:     TTS api: http://{local_host}:{tts_port}")
    print(f"INFO:     TTS api: http://{local_host}:{tts_port}/tts")
    print(f"INFO:     TTS api: http://{local_host}:{tts_port}/character_list",end='\n\n')
    
    print(f"=====>    Main App URL: http://{local_host}:{main_app_port}")
    

    thread_main.join()
    thread_tts.join()

