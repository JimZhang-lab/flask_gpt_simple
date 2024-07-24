from flask import Flask
from .views.index import index
from .views.chat import chat
from .views.about import about
from .views.contact import contact
from .views.login import login


def create_app(config_name):
    # name of the app, you can change it to anything you like
    app = Flask('flask_demo', template_folder='web/templates', static_folder='web/static')

    # register blueprints
    app.register_blueprint(index)
    app.register_blueprint(chat)
    app.register_blueprint(about)
    app.register_blueprint(contact)
    app.register_blueprint(login)
    
    return app

# if __name__ == '__main__':
#     app = create_app('development')
#     app.run(debug=True)