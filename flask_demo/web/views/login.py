from flask import Blueprint, render_template, request, redirect, url_for
# from flask_restful import Api


login = Blueprint('login', __name__)

# index_api = Api(index)

@login.route('/login')
def index_page():
    return render_template('login.html')

