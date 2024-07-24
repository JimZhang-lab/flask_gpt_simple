from flask import Blueprint, render_template, request, redirect, url_for
# from flask_restful import Api


about = Blueprint('about', __name__)

# index_api = Api(index)

@about.route('/about')
def index_page():
    return render_template('about.html')

