from flask import Blueprint, render_template, request, redirect, url_for
# from flask_restful import Api


contact = Blueprint('contact', __name__)

# index_api = Api(index)

@contact.route('/contact')
def index_page():
    return render_template('contact.html')

