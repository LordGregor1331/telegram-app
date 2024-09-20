from flask import Flask, current_app
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_sitemap import Sitemap
from os import path
from datetime import datetime  # Import the datetime module

db = SQLAlchemy()
DB_NAME = "database.db"


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'lolkekcheburek'
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'

    db.init_app(app)

    ext = Sitemap(app=app)

    from .views import views

    app.register_blueprint(views, url_prefix='/')

    from .models import Users

    if not path.exists('website/' + DB_NAME):
        with app.app_context():
            db.create_all()

    login_manager = LoginManager()
    login_manager.login_view = 'views.login'
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(id):
        return Users.query.get(int(id))

    # Add the context processor to inject the current date
    @app.context_processor
    def inject_today_date():
        return {'today_date': datetime.today()}

    return app