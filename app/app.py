import os
from flask import Flask, render_template
from api import api_bp
from models import init_db

FRONTEND_DIR = '../front'
APP_URL = '127.0.0.1'
APP_PORT = 5000

app = Flask(__name__,
            static_folder=os.path.join(FRONTEND_DIR, 'dist', 'static'),
            template_folder=os.path.join(FRONTEND_DIR, 'dist'))
app.config.from_pyfile('config.cfg')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.register_blueprint(api_bp)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
  return render_template('index.html')

if __name__ == "__main__":
  with app.app_context():
    init_db(app)

  app.run(host=APP_URL, port=APP_PORT)
