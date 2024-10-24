import json
import os
from flask import Blueprint, render_template, redirect, url_for, request, jsonify, current_app
from .models import Users, db
from flask_login import login_user, login_required, current_user
import random

views = Blueprint('views', __name__)

eggs_to_coin_price = 1500
coins_to_usd_price = 27.5

def load_upgrade_config():
    config_path = os.path.join(current_app.root_path, 'static', 'upgrade_config.json')
    with open(config_path, 'r') as f:
        return json.load(f)


@views.context_processor
def inject_globals():
    # Load the upgrade configuration
    upgrade_config = load_upgrade_config()

    if current_user.is_authenticated:
        tap_lvl = current_user.tap_lvl
        energy_lvl = current_user.energy_lvl

        # Fetch the current cost based on the user's level
        tap_cost = upgrade_config['upgrades']['tap_lvl'].get(str(tap_lvl), {}).get('cost')
        energy_cost = upgrade_config['upgrades']['energy_lvl'].get(str(energy_lvl), {}).get('cost')

        # Handle max level scenario
        tap_cost_display = tap_cost if tap_cost else "Max Level"
        energy_cost_display = energy_cost if energy_cost else "Max Level"

        # Get next 3 upgrades for tap and energy
        next_tap_upgrades = get_next_upgrades(tap_lvl, 'tap_lvl', upgrade_config)
        next_energy_upgrades = get_next_upgrades(energy_lvl, 'energy_lvl', upgrade_config)

        # Compute 'earn_per_tap' based on current 'tap_lvl'
        earn_per_tap = upgrade_config['upgrades']['tap_lvl'].get(str(tap_lvl), {}).get('value', 1)

        return {
            'eggs_to_coin_price': eggs_to_coin_price,
            'coins_to_usd_price': coins_to_usd_price,
            'tap_cost': tap_cost_display,
            'energy_cost': energy_cost_display,
            'tap_lvl': tap_lvl,
            'energy_lvl': energy_lvl,
            'next_tap_upgrades': next_tap_upgrades,
            'next_energy_upgrades': next_energy_upgrades,
            'earn_per_tap': earn_per_tap
        }
    return {'eggs_to_coin_price': eggs_to_coin_price}

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

    # Determine eggs earned based on tap_lvl
    eggs_to_add = load_upgrade_config()['upgrades']['tap_lvl'].get(str(user.tap_lvl), {}).get('value', 1)

    # Ensure storage can accommodate more eggs
    if user.egg_balance + eggs_to_add > user.storage_max_volume:
        return jsonify({"message": "Storage is full. Upgrade your storage to tap more."}), 400

    # Deduct food balance and add egg balance
    user.food_balance -= eggs_to_add
    user.egg_balance += eggs_to_add

    db.session.commit()

    return jsonify({
        "egg_balance": user.egg_balance,
        "food_balance": user.food_balance,
        "earn_per_tap": eggs_to_add  # Reflect the new tap value
    }), 200

@views.route('/upgrade/tap', methods=['POST'])
@login_required
def upgrade_tap():
    user = current_user
    upgrade_config = load_upgrade_config()
    current_level = user.tap_lvl
    upgrade_type = 'tap_lvl'
    upgrades = upgrade_config['upgrades'][upgrade_type]
    max_upgrade_levels = 3  # Maximum levels to upgrade at once

    # Get the number of levels to upgrade from the request
    data = request.get_json()
    levels_to_upgrade = data.get('levels', 1)  # Default to 1 if not provided

    if not isinstance(levels_to_upgrade, int) or levels_to_upgrade < 1 or levels_to_upgrade > max_upgrade_levels:
        return jsonify({"message": f"Invalid upgrade level. Choose between 1 and {max_upgrade_levels}."}), 400

    total_cost = 0
    next_level = current_level
    discounts = [0.0, 0.05, 0.10]  # 0%, 5%, 10% discounts for levels 1, 2, 3 respectively

    for i in range(1, levels_to_upgrade + 1):
        target_level = next_level + 1
        target_level_str = str(target_level)
        if target_level_str not in upgrades:
            return jsonify({"message": "Maximum tap level reached."}), 400

        cost = upgrades[target_level_str]['cost']
        discount = discounts[i - 1]
        discounted_cost = cost * (1 - discount)
        total_cost += discounted_cost
        next_level = target_level

    if user.coin_balance < total_cost:
        return jsonify({"message": "Insufficient coins for the upgrade."}), 400

    # Deduct the total cost and upgrade the level
    user.coin_balance -= total_cost
    user.tap_lvl = next_level

    db.session.commit()

    # Prepare the response data
    tap_cost_display = upgrades.get(str(user.tap_lvl), "Max Level")
    earn_per_tap = upgrades.get(str(user.tap_lvl), {}).get('value', 1)

    # Get next upgrades
    next_tap_upgrades = get_next_upgrades(user.tap_lvl, 'tap_lvl', upgrade_config)

    return jsonify({
        "tap_lvl": user.tap_lvl,
        "coin_balance": user.coin_balance,
        "tap_cost": tap_cost_display,
        "earn_per_tap": earn_per_tap,
        "next_tap_upgrades": next_tap_upgrades
    }), 200

@views.route('/upgrade/energy', methods=['POST'])
@login_required
def upgrade_energy():
    user = current_user
    upgrade_config = load_upgrade_config()
    current_level = user.energy_lvl
    upgrade_type = 'energy_lvl'
    upgrades = upgrade_config['upgrades'][upgrade_type]
    max_upgrade_levels = 3  # Maximum levels to upgrade at once

    # Get the number of levels to upgrade from the request
    data = request.get_json()
    levels_to_upgrade = data.get('levels', 1)  # Default to 1 if not provided

    if not isinstance(levels_to_upgrade, int) or levels_to_upgrade < 1 or levels_to_upgrade > max_upgrade_levels:
        return jsonify({"message": f"Invalid upgrade level. Choose between 1 and {max_upgrade_levels}."}), 400

    total_cost = 0
    next_level = current_level
    discounts = [0.0, 0.05, 0.10]  # 0%, 5%, 10% discounts for levels 1, 2, 3 respectively

    for i in range(1, levels_to_upgrade + 1):
        target_level = next_level + 1
        target_level_str = str(target_level)
        if target_level_str not in upgrades:
            return jsonify({"message": "Maximum energy level reached."}), 400

        cost = upgrades[target_level_str]['cost']
        discount = discounts[i - 1]
        discounted_cost = cost * (1 - discount)
        total_cost += discounted_cost
        next_level = target_level

    if user.coin_balance < total_cost:
        return jsonify({"message": "Insufficient coins for the upgrade."}), 400

    # Deduct the total cost and upgrade the level
    user.coin_balance -= total_cost
    user.energy_lvl = next_level

    db.session.commit()

    # Prepare the response data
    energy_cost_display = upgrades.get(str(user.energy_lvl), "Max Level")

    # Get next upgrades
    next_energy_upgrades = get_next_upgrades(user.energy_lvl, 'energy_lvl', upgrade_config)

    return jsonify({
        "energy_lvl": user.energy_lvl,
        "coin_balance": user.coin_balance,
        "energy_cost": energy_cost_display,
        "next_energy_upgrades": next_energy_upgrades
    }), 200

def get_next_upgrades(current_level, upgrade_type, upgrade_config, max_levels=3):
    """
    Get the next 'max_levels' upgrade information for a given upgrade type.

    Args:
        current_level (int): The current level of the upgrade.
        upgrade_type (str): The type of upgrade ('tap_lvl' or 'energy_lvl').
        upgrade_config (dict): The loaded upgrade configuration.
        max_levels (int): Number of next levels to retrieve.

    Returns:
        list of dict: Each dict contains 'level', 'value_difference', 'cumulative_cost'.
    """
    upgrades = upgrade_config['upgrades'][upgrade_type]
    next_upgrades = []
    cumulative_cost = 0
    discounts = [0.0, 0.05, 0.10]  # 0%, 5%, 10% for next 3 levels

    # Ensure the current level exists in the config
    current_level_str = str(current_level)
    if current_level_str not in upgrades:
        raise ValueError(f"Current level {current_level} not found in upgrade config.")

    current_value = upgrades[current_level_str]['value']

    for i in range(1, max_levels + 1):
        upgrade_from_level = current_level + i - 1
        target_level = current_level + i
        upgrade_from_level_str = str(upgrade_from_level)
        target_level_str = str(target_level)

        # Check if the upgrade_from_level exists
        if upgrade_from_level_str not in upgrades:
            raise ValueError(f"Upgrade from level {upgrade_from_level} not found in upgrade config.")

        # Check if the target_level exists
        if target_level_str not in upgrades:
            break  # No more levels defined

        # Get the cost from the current level to the target level
        level_info = upgrades[target_level_str]
        cost = upgrades[upgrade_from_level_str]['cost']
        cumulative_cost += cost

        # Apply discount based on the level being upgraded to
        discount = discounts[i - 1]  # 0%, 5%, 10%
        discounted_cost = cumulative_cost * (1 - discount)

        # Calculate the difference in value
        target_value = level_info['value']
        value_difference = target_value - current_value

        # Append the upgrade information
        next_upgrades.append({
            'level': target_level,
            'value': value_difference,
            'cumulative_cost': discounted_cost
        })

    return next_upgrades

