from flask import Blueprint, render_template, request, redirect, url_for, jsonify
import flask
from json import load
from openai import OpenAI
from web.utils.get_models import get_model_lists,chat_response
# from flask_restful import Api

chat = Blueprint('chat', __name__)

# index_api = Api(index)

@chat.route('/chat')
def index_page():
    return render_template('chat.html')

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
        return {"msg": "Plese select a model"}
    # print(message)
    models = get_model_lists()
    if model_name not in models.keys():
        return {"msg": "model not found"}
    
    try:
        if message:
            result = chat_response(message,models[model_name])
            response_data = []
            for line in result:
                if line.choices[0].finish_reason is not None:
                    response_data.append("[DONE]")
                else:
                    response_data.append(line.choices[0].delta.content)
            merged_response = ''.join(response_data)
            print(merged_response)
            return {"msg": merged_response}
        
    except Exception as e:
        print(e)
        
    return {"error": "Invalid input"}




# def send_message():
#     data = request.get_json()
    
#     message = str(data.get('question')).strip()
#     id = int(data.get('id'))
#     # print(message)
#     try:
#         if message:
#             def stream():
#                 result = chat_response(message)
#                 for line in result:
#                     if line.choices[0].finish_reason is not None:
#                         data = "[DONE]"
#                     else:
#                         data = line.choices[0].delta.content
#                     yield "data: %s\n\n" % data.replace('\n', '<br/>')
#             return flask.Response(stream(), mimetype="text/event-stream")
        
#     except Exception as e:
#         print(e)
        
#     return {"error": "Invalid input"}
    


