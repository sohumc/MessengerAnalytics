import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)

from MessengerAnalyticsApp.db import get_db

bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route('/languageData/', methods=('GET', 'POST'))
def get_language_data():
    print("here")
    # db = get_db()
    # try:
    #     messages = db.execute("SELECT content FROM messages WHERE messages.conversation_id = ?", (conversation_id)).fetchone()
    # except Exception as e:
    #     print(e)    
    # return "hello"



    