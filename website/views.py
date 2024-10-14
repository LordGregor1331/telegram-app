from flask import Blueprint, render_template, redirect, url_for, request, jsonify
from .models import Users, db
from flask_login import login_user, login_required, current_user
import random

views = Blueprint('views', __name__)

eggs_to_coin_price = 1500

@views.context_processor
def inject_globals():
    return dict(eggs_to_coin_price=eggs_to_coin_price)

@views.route('/')
def index():
    if not current_user.is_authenticated:
        # Example user creation (modify as per your authentication logic)
        new_user = Users(
            tg_id=random.randint(1000000, 9999999),  # Simulate a unique Telegram ID
            tg_username='hello',
            tg_first_name='sdsd',
            tg_last_name='sadsadsf',
            tg_is_premium=False
        )

        # Add the new user to the database
        db.session.add(new_user)
        db.session.commit()

        login_user(new_user)

    return render_template('index.html')

@views.route('/tap', methods=['POST'])
@login_required
def tap():
    user = current_user

    # Ensure user has sufficient food balance
    if user.food_balance <= 0:
        return jsonify({"message": "Insufficient food balance."}), 400

    # Ensure storage can accommodate more eggs
    if user.egg_balance + user.earn_per_tap > user.storage_max_volume:
        return jsonify({"message": "Storage is full. Upgrade your storage to tap more."}), 400

    # Deduct food balance and add egg balance
    user.food_balance -= user.earn_per_tap
    user.egg_balance += user.earn_per_tap

    db.session.commit()

    return jsonify({
        "egg_balance": user.egg_balance,
        "food_balance": user.food_balance,
        "earn_per_tap": user.earn_per_tap
    }), 200
