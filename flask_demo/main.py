from web import create_app
import os

app = create_app('dev')
if __name__ == '__main__':
    app.run(debug=True)
    