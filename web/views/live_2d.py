from flask import Blueprint, render_template, request, redirect, url_for,send_from_directory
import json


live_2d = Blueprint('live_2d', __name__)


@live_2d.route('/live2d/<path:path>')
def serve_static(path):
    return send_from_directory('../static/Live2D_model', path)


@live_2d.route('/api/get_mouth_y')
def api_get_one_account():
    with open("web/utils/tmp.txt", "r") as f:
        return json.dumps({
            "y": f.read()
        })
