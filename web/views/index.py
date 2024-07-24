from flask import Blueprint, render_template, request, redirect, url_for
# from flask_restful import Api


index = Blueprint('index', __name__)

# index_api = Api(index)

@index.route('/index')
def index_page():
    return render_template('index.html')

@index.route('/')
def index_redirect():
    return redirect('/index')
