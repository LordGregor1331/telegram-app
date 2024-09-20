from flask import Blueprint, render_template

views = Blueprint('views', __name__)

@views.route('/')
def index():
    print("Rendering index page")
    return render_template('index.html')
