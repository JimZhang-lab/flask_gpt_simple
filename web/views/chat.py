from flask import Blueprint, render_template, request, redirect, url_for, jsonify
import flask
from json import load
import json
from openai import OpenAI
import requests
from web.utils.get_models import get_model_lists,chat_response
# from web.utils.live2d_control import tts_and_play_audio
# from flask_restful import Api

chat = Blueprint('chat', __name__)

# index_api = Api(index)

@chat.route('/chat')
def index_page():
    return render_template('chat.html')

@chat.route('/test')
def test_page():
    return render_template('live2d_llm.html')

# 获取模型列表
@chat.route('/chat_get_model_list', methods=['GET'])
def get_model_list():
    models_name = list(get_model_lists().keys())
    
    return jsonify(models_name=models_name)


@chat.route('/chat_query', methods=['POST'])
def send_message():
    data = request.get_json()
    
    message = str(data.get('question')).strip()
    model_name = str(data.get('model_name')).strip()
    model_id = int(data.get('model_id'))
    if model_id == 0:
        return "Plese select a model"
    # print(message)
    models = get_model_lists()
    if model_name not in models.keys():
        return  "model not found"
    # print(message)
    try:
        if message:
            def stream():
                result = chat_response(message,models[model_name])
                for line in result:
                    if line.choices[0].finish_reason is not None:
                        data = ""
                    else:
                        data = line.choices[0].delta.content
                    yield '%s\n\n'  % data.replace('\n', '<br/>')
            return flask.Response(stream(), mimetype="text/plain")
        
    except Exception as e:
        print(e)
        
    return {"error": "Invalid input"}


@chat.route('/chat_audio', methods=['POST'])
def send_audio():
    url = "http://127.0.0.1:9862/tts"
    data = request.get_json()
    message = str(data.get('text')).strip()
    if message:
        try:
            data['text'] = message
            response = requests.post(url,json=data)
            if response.status_code == 200:
                print("[done]")
                with open('web/utils/output.wav', 'wb') as file:
                    file.write(response.content)
                print("文件已下载到本地")
                # tts_and_play_audio()
                return response.content
            else:
                print(f"请求失败，错误代码：{response.status_code}")
        except Exception as e:
            print(e)
            return {"error": "Invalid input"}
    else:
        return {"error": "Invalid input"}



