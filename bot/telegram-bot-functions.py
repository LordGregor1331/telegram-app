import telebot
import json
import base64
import hmac
import hashlib
from telebot import types
from datetime import datetime
import urllib.parse
import time
import requests

# SECTION 1: BOT INITIALIZATION AND CONFIGURATION

# Initialize the bot with the provided token and HTML parse mode
bot = telebot.TeleBot('7627760759:AAHZ0iUi9LFWHhZYWnpO1OXqEqHdHCtdD6U', parse_mode='HTML')

# Global dictionaries for storing user-specific data
user_language = {}
main_menu_message_id = {}

# Configuration variables
FLASK_API_URL = 'http://127.0.0.1:5000'
SECRET_KEY = 'lolkekcheburek'  # Make sure this matches our Flask app's secret key


# SECTION 2: HELPER FUNCTIONS

def generate_hash(secret_key, data):
    """
    Generate a HMAC-SHA256 hash of the provided data using the secret key.

    :param secret_key: The secret key to use for hashing.
    :param data: The data to be hashed (in JSON format).
    :return: A base64-encoded hash string.
    """
    message = json.dumps(data, separators=(',', ':')).encode('utf-8')
    return base64.urlsafe_b64encode(hmac.new(secret_key.encode(), message, hashlib.sha256).digest()).decode('utf-8')


# SECTION 3: COMMAND HANDLERS

@bot.message_handler(commands=['start'])
def send_welcome(message):
    """
    Handle the /start command. Greets the user, checks if they exist in the Flask server,
    and if not, creates a new user entry. It also handles referral logic.

    :param message: The incoming message containing the /start command.
    """
    user = message.from_user
    user_id = user.id
    username = user.username
    referral_id = message.text.split()[1] if len(message.text.split()) > 1 else None

    # Check if the user exists on the Flask server
    print(f"[BOT] Checking if user {user_id} exists on Flask server...")
    response = requests.get(f"{FLASK_API_URL}/get/tg_user/{user_id}")

    if response.status_code == 200:
        # User exists, send a welcome back message
        user_data = response.json()
        print(f"[BOT] User {user_id} exists. Proceeding with welcome message.")
        print(user_data)
        # Ask user to choose a language
        markup = types.InlineKeyboardMarkup(row_width=2)
        btn_en = types.InlineKeyboardButton('English', callback_data='lang_en')
        btn_ru = types.InlineKeyboardButton('Русский', callback_data='lang_ru')
        markup.add(btn_en, btn_ru)
        bot.send_message(message.chat.id, f'Welcome back, <b>{username.capitalize()}</b>! Please choose your language:',
                         reply_markup=markup)
    else:
        # User does not exist, create a new user
        print(f"[BOT] User {user_id} does not exist. Creating new user.")
        user_data = {
            'tg_id': user_id,
            'username': username,
            'first_name': message.from_user.first_name,
            'last_name': message.from_user.last_name,
            'language_code': message.from_user.language_code,
            'is_premium': user.is_premium,
            'referral_link': f"https://t.me/Build_on_TON_bot?start={user_id}",
            'total_balance': 0,
            'referral_rewards': 0.0,
            'invited_by': referral_id if referral_id and referral_id.isdigit() else None
        }

        # Handle referral logic if referral ID is provided
        if referral_id and referral_id.isdigit():
            print(f"[BOT] Referral ID provided: {referral_id}. Checking referrer...")
            referrer_response = requests.get(f"{FLASK_API_URL}/get/tg_user/{referral_id}")
            if referrer_response.status_code == 200:
                referrer_data = referrer_response.json()
                print(f"[BOT] Referrer {referral_id} found.")
                # Example of how to update referrer balance if needed
                # user_data['total_balance'] += 1000
                # referrer_data = {'total_balance': referrer_data['total_balance'] + 500}
                # requests.put(f"{FLASK_API_URL}/update/tg_user/{referral_id}", json=referrer_data)
                bot.send_message(referral_id, f"User {username} has joined using your referral link! Congratulations!")
            else:
                print(f"[BOT] Referrer {referral_id} not found.")
        else:
            print(f"[BOT] No referral ID provided or invalid referral ID.")

        # Create the user on the Flask server
        print(f"[BOT] Creating user {user_id} on the Flask server.")
        requests.put(f"{FLASK_API_URL}/update/tg_user/{user_id}", json=user_data)

        # Send a welcome message and ask for language selection
        markup = types.InlineKeyboardMarkup(row_width=2)
        btn_en = types.InlineKeyboardButton('English', callback_data='lang_en')
        btn_ru = types.InlineKeyboardButton('Русский', callback_data='lang_ru')
        markup.add(btn_en, btn_ru)
        bot.send_message(message.chat.id, 'Welcome! Please choose your language:', reply_markup=markup)


# SECTION 4: CALLBACK HANDLERS

@bot.callback_query_handler(func=lambda call: call.data.startswith('lang_'))
def set_language(call):
    """
    Handle language selection and store the user's choice.

    :param call: The callback query that contains the language choice.
    """
    language = call.data.split('_')[1]
    user_language[call.message.chat.id] = language
    bot.delete_message(call.message.chat.id, call.message.message_id)
    main_menu(call.message, new_message=True)


def main_menu(message, new_message=False):
    """
    Display the main menu with options like Marketplace, Learn, Contests, and Language settings.

    :param message: The message object to respond to.
    :param new_message: If True, send a new message instead of editing the existing one.
    """
    markup = types.InlineKeyboardMarkup(row_width=2)

    # Define buttons for the main menu
    btn1 = types.InlineKeyboardButton('🛒   Marketplace', url='https://dwarfs.store/marketplace')
    btn2 = types.InlineKeyboardButton('🎮   Learn', callback_data='generate_play_game_url')
    btn3 = types.InlineKeyboardButton('💸   Contests', callback_data='earn')
    btn4 = types.InlineKeyboardButton('️🗺   Language', callback_data='settings')

    markup.add(btn1, btn2, btn3, btn4)

    # Check user language and prepare the corresponding caption
    language = user_language.get(message.chat.id, 'en')
    if language == 'en':
        caption = (
            "Welcome to the <b>«Build on TON»</b> <i>($BOT)</i> 🚀\n\n"
            "- Learn how Web3 🌎 works \n"
            "- Earn rewards 💰\n"
            "- Build your own digital house 🏠 along the way"
        )
    else:
        caption = (
            "Добро пожаловать в <b>«Build on TON»</b> <i>($BOT)</i> 🚀\n\n"
            "- Узнайте, как работает Web3 🌎\n"
            "- Зарабатывайте награды 💰\n"
            "- Стройте свой собственный город 🏠"
        )

    # Determine whether to send a new message or edit an existing one
    if new_message or message.chat.id not in main_menu_message_id:
        sent_message = bot.send_photo(message.chat.id,
                                      photo='https://i.ibb.co/mhPtr8V/photo-2024-08-23-08-19-15.jpg',
                                      caption=caption,
                                      reply_markup=markup)
        main_menu_message_id[message.chat.id] = sent_message.message_id
    else:
        try:
            bot.edit_message_caption(chat_id=message.chat.id,
                                     message_id=main_menu_message_id[message.chat.id],
                                     caption=caption,
                                     reply_markup=markup)
        except telebot.apihelper.ApiTelegramException as e:
            if 'message to edit not found' in str(e):
                sent_message = bot.send_photo(message.chat.id,
                                              photo='https://i.ibb.co/mhPtr8V/photo-2024-08-23-08-19-15.jpg',
                                              caption=caption,
                                              reply_markup=markup)
                main_menu_message_id[message.chat.id] = sent_message.message_id


@bot.callback_query_handler(func=lambda call: call.data == 'generate_play_game_url')
def generate_play_game_url(call):
    """
    Generate a URL for the user to play the game. The URL is secured with a hash.

    :param call: The callback query that requests the game URL.
    """
    user = {
        'id': call.from_user.id,
        'username': call.from_user.username,
        'first_name': call.from_user.first_name,
        'last_name': call.from_user.last_name,
        'language_code': user_language.get(call.from_user.id, 'en'),
        'is_premium': call.from_user.is_premium,
        'allows_write_to_pm': False  # or however you determine this value
    }

    # Create the data for hashing and generate the secure URL
    auth_date = int(datetime.utcnow().timestamp())
    data = {
        'query_id': '1',
        'user': user['id'],
        'auth_date': auth_date
    }

    hash_value = generate_hash(SECRET_KEY, data)

    user_encoded = urllib.parse.quote(json.dumps(user))
    play_game_url = f"https://buildonton.com/login?query_id=1&user={user_encoded}&auth_date={auth_date}&hash={hash_value}&tgWebAppVersion=6.0&tgWebAppPlatform=web"
    print(f"http://127.0.0.1:5000/login?query_id=1&user={user_encoded}&auth_date={auth_date}&hash={hash_value}&tgWebAppVersion=6.0&tgWebAppPlatform=web")
    # Create markup with the new game URL and main menu button
    markup = types.InlineKeyboardMarkup(row_width=2)
    web_app = types.WebAppInfo(url=play_game_url)
    btn_back = types.InlineKeyboardButton('Main Menu', callback_data='main_menu')
    btn_play_game = types.InlineKeyboardButton('🎮 Learn', web_app=web_app)
    markup.add(btn_play_game, btn_back)

    # Update the user's chat menu with the game option
    menu_button = telebot.types.MenuButtonWebApp(type='web_app', text="🎮 Play the Game", web_app=web_app)
    bot.set_chat_menu_button(chat_id=call.message.chat.id, menu_button=menu_button)

    bot.edit_message_reply_markup(call.message.chat.id, call.message.message_id, reply_markup=markup)


@bot.callback_query_handler(func=lambda call: call.data == 'earn')
def earn_menu(call):
    """
    Display the Earn Menu with tasks and referral options for the user.

    :param call: The callback query requesting the Earn Menu.
    """
    try:
        user_id = call.message.chat.id

        print(f"[BOT] Fetching referral information for user {user_id}...")
        response = requests.get(f"{FLASK_API_URL}/get/tg_user/{user_id}")

        if response.status_code == 200:
            # Parse user data for the earn menu
            user_data = response.json()

            referrals = user_data.get('referral_amount', 0)
            balance = user_data.get('total_balance', 0)
            referral_link = user_data.get('referral_link', f"https://t.me/Build_on_TON_bot?start={user_id}")

            # Define buttons for the earn menu
            markup = types.InlineKeyboardMarkup(row_width=1)
            btn_feedback = types.InlineKeyboardButton(
                'Provide the Feedback or Review' if user_language.get(user_id, 'en') == 'en' else 'Связь',
                url='https://t.me/travis_hatt')
            btn_whitepaper = types.InlineKeyboardButton(
                'Check the whitepaper' if user_language.get(user_id, 'en') == 'en' else 'Ознакомиться с Документацией',
                url='https://whitepaper.dwarfs.store')
            btn_create_meme = types.InlineKeyboardButton(
                'Create a meme and send it to the Moderator' if user_language.get(call.message.chat.id,
                                                                                  'en') == 'en' else 'Создайте мем и отправьте на него ссылку',
                url='https://t.me/travis_hatt')
            btn_report_bug = types.InlineKeyboardButton(
                'Report the Bug to the Moderator' if user_language.get(call.message.chat.id,
                                                                       'en') == 'en' else 'Нашли баг? Свяжитесь с нами пожалуйста',
                url='https://t.me/travis_hatt')
            btn_development = types.InlineKeyboardButton(
                'API documentation' if user_language.get(call.message.chat.id, 'en') == 'en' else 'Документация API',
                url='https://whitepaper.dwarfs.store/chrono-dwarfs-official-whitepaper/for-developers-api')
            btn_back = types.InlineKeyboardButton(
                'Back to Main Menu' if user_language.get(call.message.chat.id, 'en') == 'en' else 'Главное Меню',
                callback_data='main_menu')
            markup.add(btn_feedback, btn_whitepaper, btn_create_meme, btn_report_bug, btn_development, btn_back)

            # Prepare the earn menu caption based on the user's language
            language = user_language.get(call.message.chat.id, 'en')
            if language == 'en':
                caption = (
                    '🎉 Welcome to the beta of Build On Ton!*\n\n'
                    'By completing the tasks, you will receive 👻 *Beta Build Points*.\n'
                    'The Beta will be active from the 1st of September but you are able to earn now. The number of rewards is limited.\n\n'
                    '*Tasks:*\n'
                    '🎁 +1 Chrono *"Early Adopter"* gift for first successfully invited friend\n'
                    '👻 +10 *Beta Build Points* for each successfully invited friend\n\n'
                    '📣 *Feedback*: Provide some feedback or review on the Chrono Dwarfs ecosystem to receive +30 *Beta Dwarf Souls*\n'
                    '📄 *Whitepaper Review*: Review the project whitepaper and report any suggestions to get +50 *Beta Dwarf Souls*\n'
                    '🎨 *Create Memes*: Design and share creative memes related to the platform to get +50 *Beta Dwarf Souls*\n'
                    '🛡️ *Report Bugs*: Identify and report the bug on the platform to receive +100 *Beta Dwarf Souls*\n'
                    f'🔗 *Your referral link:* ({referral_link})\n\n'
                    f'*Referrals:* {referrals} users\n'
                    f'*Balance:* {balance} Beta Dwarf Souls\n'
                )
            else:
                caption = (
                    '🎉 <b>Добро пожаловать в бета-версию Chrono Earn Hub!*\n\n'
                    'Выполняя задания, вы получите 👻 *Beta Dwarf Souls* и бесплатный 🎁 *Dwarf NFT*.\n'
                    'Бета-версия будет активна с 1 августа, но вы уже можете зарабатывать. Количество наград ограничено.\n\n'
                    '*Задания:*\n'
                    '🎁 +1 Подарок Chrono *"Предок"* за первого успешно приглашенного друга\n'
                    '👻 +10 *Beta Dwarf Souls* за каждого приглашенного друга\n\n'
                    '📣 *Обратная связь*: Оставьте отзыв о экосистеме - +30 *Beta Dwarf Souls*\n'
                    '📄 *Рецензия на Whitepaper*: Ознакомьтесь с проектным описанием и предложите свои идеи - +50 *Beta Dwarf Souls*\n'
                    '🎨 *Создание мемов*: Создавайте и делитесь креативными мемами, связанными с платформой - +50 *Beta Dwarf Souls*\n'
                    '🛡️ *Баги*: Найдите и сообщите о баге на платформе - +100 *Beta Dwarf Souls*\n'
                    '🛠️ *Разработка*: Используйте наш API для создания мини-проекта - +500 *Beta Dwarf Souls*\n\n'
                    f'🔗 *Ваша реферальная ссылка:* ({referral_link})\n'
                    f'*Приглашенные пользователи:* {referrals} пользователей\n'
                    f'*Баланс:* {balance} Beta Build Points\n'
                )

            # Escape special characters for MarkdownV2 formatting
            caption = caption.replace('.', '\\.').replace('+', '\\+').replace('-', '\\-').replace('!', '\\!') \
                .replace('(', '\\(').replace(')', '\\)').replace('_', '\\_').replace('*', '\\*') \
                .replace('[', '\\[').replace(']', '\\]').replace('`', '\\`').replace('=', '\\=') \
                .replace('>', '\\>')

            # Send or edit the message with the Earn Menu
            if call.message.chat.id in main_menu_message_id:
                try:
                    bot.edit_message_caption(chat_id=call.message.chat.id,
                                             message_id=main_menu_message_id[call.message.chat.id],
                                             caption=caption,
                                             reply_markup=markup,
                                             parse_mode='MarkdownV2')
                except telebot.apihelper.ApiTelegramException as e:
                    print(f"[BOT] Error editing message: {e}")
                    if 'message to edit not found' in str(e):
                        sent_message = bot.send_photo(call.message.chat.id,
                                                      photo='https://i.ibb.co/mhPtr8V/photo-2024-08-23-08-19-15.jpg',
                                                      caption=caption,
                                                      reply_markup=markup,
                                                      parse_mode='MarkdownV2')
                        main_menu_message_id[call.message.chat.id] = sent_message.message_id
            else:
                sent_message = bot.send_photo(call.message.chat.id,
                                              photo='https://i.ibb.co/mhPtr8V/photo-2024-08-23-08-19-15.jpg',
                                              caption=caption,
                                              reply_markup=markup,
                                              parse_mode='MarkdownV2')
                main_menu_message_id[call.message.chat.id] = sent_message.message_id
        else:
            print(f"[BOT] Unable to fetch referral information for user {user_id}. Status Code: {response.status_code}")
            bot.send_message(call.message.chat.id, "Unable to fetch your referral information at the moment.")

    except Exception as e:
        print(f"[BOT] An error occurred in earn_menu: {str(e)}")


@bot.callback_query_handler(func=lambda call: call.data == 'settings')
def settings_menu(call):
    """
    Display the settings menu where the user can change language or go back to the main menu.

    :param call: The callback query requesting the settings menu.
    """
    markup = types.InlineKeyboardMarkup(row_width=1)

    # Buttons for changing language and returning to the main menu
    btn_change_language = types.InlineKeyboardButton('Change Language' if user_language.get(call.message.chat.id, 'en') == 'en' else 'Сменить язык', callback_data='change_language')
    btn_back = types.InlineKeyboardButton('Back to Main Menu' if user_language.get(call.message.chat.id, 'en') == 'en' else 'Главное Меню', callback_data='main_menu')

    markup.add(btn_change_language, btn_back)

    # Prepare settings menu caption
    caption = '*Settings*' if user_language.get(call.message.chat.id, 'en') == 'en' else '*Настройки*'

    if call.message.chat.id in main_menu_message_id:
        try:
            bot.edit_message_caption(chat_id=call.message.chat.id,
                                     message_id=main_menu_message_id[call.message.chat.id],
                                     caption=caption,
                                     reply_markup=markup)
        except telebot.apihelper.ApiTelegramException as e:
            if 'message to edit not found' in str(e):
                main_menu(call.message, new_message=True)
    else:
        main_menu(call.message, new_message=True)


@bot.callback_query_handler(func=lambda call: call.data == 'change_language')
def change_language(call):
    """
    Handle the request to change the user's language by displaying language options.

    :param call: The callback query requesting a language change.
    """
    markup = types.InlineKeyboardMarkup(row_width=2)
    btn_en = types.InlineKeyboardButton('English', callback_data='lang_en')
    btn_ru = types.InlineKeyboardButton('Русский', callback_data='lang_ru')
    markup.add(btn_en, btn_ru)

    if call.message.chat.id in main_menu_message_id:
        bot.edit_message_caption(chat_id=call.message.chat.id,
                                 message_id=main_menu_message_id[call.message.chat.id],
                                 caption='Please select your preferred language / Пожалуйста, выберите предпочитаемый язык',
                                 reply_markup=markup)
    else:
        sent_message = bot.send_message(call.message.chat.id,
                                        'Please select your preferred language / Пожалуйста, выберите предпочитаемый язык',
                                        reply_markup=markup)
        main_menu_message_id[call.message.chat.id] = sent_message.message_id


@bot.callback_query_handler(func=lambda call: call.data == 'main_menu')
def go_back_to_main_menu(call):
    """
    Return the user to the main menu.

    :param call: The callback query requesting the main menu.
    """
    main_menu(call.message)


# SECTION 5: BOT EXECUTION

bot.polling()

# Continuous polling loop to ensure the bot runs indefinitely, with error handling
while True:
    try:
        bot.polling(none_stop=True, interval=0, timeout=20)
    except Exception as e:
        print(f"Bot crashed with error: {e}. Restarting in 5 seconds...")
        time.sleep(5)