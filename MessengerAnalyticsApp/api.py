import functools
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
import langid
from nltk.tokenize import word_tokenize
import pandas as pd
import json
from MessengerAnalyticsApp.db_populate import decode_str
from collections import Counter
from dateutil import parser
from MessengerAnalyticsApp.testing_helper import test_function
from MessengerAnalyticsApp.db import get_db
import datetime
import re
import time

bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route('/conversationList', methods=('GET',))
def get_conversation_list():
    db = get_db()
    df = pd.read_sql_query("""SELECT conversations.id, conversations.title, count(messages.id) as num_messages, max(messages.timestamp) as last_message_date FROM conversations JOIN messages on messages.conversation_id = conversations.id GROUP BY conversation_id""", db)
    conversation_list = []
    for index, row in df.iterrows():
        conversation_object = {
            "id" : row["id"],
            "title" : row["title"],
            "num_messages" : row["num_messages"],
            "last_message_date" : row["last_message_date"]
        }
        conversation_list.append(conversation_object)

    return {"result" : conversation_list}


def get_conversation_starters(conversation_id):
    WAIT_HOURS_INTERVAL_BETWEEN_MESSAGES = 4
    SECONDS_IN_HOUR = 3600
    db = get_db()
    df = pd.read_sql_query("""SELECT datetime(messages.timestamp) as d, messages.sender FROM messages WHERE conversation_id='{}' ORDER BY d ASC""".format(conversation_id), db)
    conversation_starters = {}
    date_format = "%Y-%m-%d %H:%M:%S"
    for i in range(1,len(df)):
        hour_duration_between_messages = (datetime.datetime.strptime(df['d'][i], date_format) - datetime.datetime.strptime(df['d'][i-1], date_format)).total_seconds()/SECONDS_IN_HOUR

        if hour_duration_between_messages > WAIT_HOURS_INTERVAL_BETWEEN_MESSAGES:
            if (df['sender'][i] in conversation_starters):
                conversation_starters[df['sender'][i]] +=1
            else:
                conversation_starters[df['sender'][i]] =1
    return(conversation_starters)


def get_mentioned_stats(conversation_id):
    MENTIONED_REGEX_PATTERN = "\B@\w+"
    mentioned_counts = {}
    db = get_db()
    participants = pd.read_sql_query("""SELECT participants as p FROM conversations WHERE id='{}'""".format(conversation_id), db)['p'][0].strip('[]').replace("'","").split(', ')
    participants_first_names = [x.split(" ")[0] for x in participants]
    messages = pd.read_sql_query("""SELECT content FROM messages WHERE conversation_id='{}' AND content IS NOT NULL""".format(conversation_id), db)['content']
    for message in messages:
        matches = re.findall(MENTIONED_REGEX_PATTERN, message)
        for match in matches:
            cleaned_match = match.replace("@","")
            if cleaned_match in participants_first_names:
                if cleaned_match in mentioned_counts:
                    mentioned_counts[cleaned_match] +=1
                else:
                    mentioned_counts[cleaned_match] = 1
    return(mentioned_counts)

@bp.route('/conversationStats/<conversation_id>', methods=('GET',))
def get_conversation_stats(conversation_id):
    # get_conversation_starters(conversation_id)
    get_mentioned_stats(conversation_id)
    return "inside conversation stats"

def get_average_reactions_per_message_per_participant(conversation_id, message_data):
    db = get_db()
    message_counts = {}
    reaction_counts = {}
    reactions_per_message = {}

    counts = db.execute("SELECT sender, COUNT(*) FROM messages WHERE conversation_id=? GROUP BY sender", (conversation_id,)).fetchall()
    for row in counts:
        message_counts[row[0]] = row[1]
    for message_reaction_object in message_data:
        reactions = json.loads(message_reaction_object[2])
        reaction_count = len([item for sublist in reactions.values() for item in sublist])
        sender = message_reaction_object[0]
        if sender in reaction_counts:
            reaction_counts[sender] += reaction_count
        else:
            reaction_counts[sender] = reaction_count
    for participant in message_counts.keys():
        reactions_per_message[participant] = reaction_counts[participant] / message_counts[participant]
    
    return reactions_per_message
    



#returns top 10 reactions used
def get_most_reacted_messages_per_participant(message_data):
    reaction_counts = {}
    top_reacted_messages = {}
    for message_reaction_object in message_data:
        reactions = json.loads(message_reaction_object[2])
        sender = message_reaction_object[0]
        content = message_reaction_object[1]
        reaction_count = len([item for sublist in reactions.values() for item in sublist])
        summed_reactions = {}
        for reaction in reactions.keys():
            summed_reactions[reaction] = len(reactions[reaction])          
        newReactionCount = {
            "reaction_count" : reaction_count,
            "message" : content,
            "reactions" : summed_reactions
            }
        if sender in reaction_counts:
            if reaction_count > reaction_counts[sender]:
                reaction_counts[sender] = reaction_count
                top_reacted_messages[sender] = [newReactionCount]
            elif reaction_count == reaction_counts[sender]:
                top_reacted_messages[sender].append(newReactionCount)
        else:
            reaction_counts[sender] = reaction_count
            top_reacted_messages[sender] = [newReactionCount]
    print(json.dumps(top_reacted_messages))
    return top_reacted_messages



#returns top 10 reactions used
def get_total_reaction_counts(reaction_data):
    reaction_counts = {}
    for message_reaction_object in reaction_data:
        for reaction, actors in json.loads(message_reaction_object).items():
            if reaction in reaction_counts:
                reaction_counts[reaction] += len(actors)
            else:
                reaction_counts[reaction] = len(actors)
    counted_reactions = sorted(reaction_counts.items(), key=lambda x:-x[1])[:10]

    print (counted_reactions)
    
@bp.route('/reactions/<conversation_id>', methods=('GET',))
def get_reaction_data(conversation_id):
    db = get_db()
    messages = db.execute("SELECT sender, content, reactions FROM messages WHERE conversation_id=? AND messages.reactions IS NOT NULL", (conversation_id,)).fetchall()
    reactions = [x[2] for x in messages]
    # get_total_reaction_counts(reactions)
    get_most_reacted_messages_per_participant(messages)
    # print(get_average_reactions_per_message_per_participant(conversation_id, messages))
    return "done"
    

def get_messages_per_month(conversation_id):
    db = get_db()
    try:
        df = pd.read_sql_query("""SELECT strftime('%m-%Y',messages.timestamp) AS m, COUNT(*) FROM messages WHERE conversation_id='{}' GROUP BY m ORDER BY messages.timestamp ASC;""".format(conversation_id), db)
        return df

    except Exception as e:
        return e

def get_daily_messages_by_sender(conversation_id):
    db = get_db()
    try:
        df = pd.read_sql_query("""SELECT strftime('%w',messages.timestamp) AS d, messages.sender, COUNT(*) FROM messages WHERE conversation_id='{}' GROUP BY d, messages.sender;""".format(conversation_id), db)
        return df

    except Exception as e:
        return e        
    
def get_messages_per_hour(conversation_id):
    db = get_db()
    try:
        df = pd.read_sql_query("""SELECT strftime('%H',messages.timestamp) AS h, COUNT(*) FROM messages WHERE conversation_id='{}' GROUP BY h;""".format(conversation_id), db)
        return df

    except Exception as e:
        return e 

@bp.route('/messagesTimeSeries/<conversation_id>', methods=('GET',))
def get_message_time_data(conversation_id):
    return_obj = {
        "messages_per_month": get_messages_per_month(conversation_id).to_dict(),
        "daily_messages_by_sender" : get_daily_messages_by_sender(conversation_id).to_dict(),
        "messages_per_hour" : get_messages_per_hour(conversation_id).to_dict()
    }
    return return_obj


@bp.route('/messageWordData/<conversation_id>', methods=('GET',))
def get_message_word_data(conversation_id):
    db = get_db()
    tokenizer = nltk.RegexpTokenizer(r"\w+")
    messages = db.execute("SELECT content FROM messages WHERE messages.conversation_id = ? AND messages.content IS NOT NULL AND messages.share IS NULL", (conversation_id,)).fetchall()
    messages = [x[0] for x in messages]
    word_count = 0
    longest_word_length = 0
    longest_words = []
    for message in messages:
        words = tokenizer.tokenize(message)
        word_count += len(words)
        for word in words:
            if(len(word) > longest_word_length):
                longest_word_length = len(word)
                longest_words = [word]
            elif (len(word) == longest_word_length):
                longest_words.append(word)
            else:
                continue
    
    return {
        "non-media messages": len(messages),
        "total words" : word_count,
        "words per message" : word_count/len(messages),
        "longest words" : longest_words
    }



@bp.route('/languageSentimentData/<conversation_id>', methods=('GET',))
def get_language_sentiment_data(conversation_id):
    db = get_db()
    sentiment_dict = {}
    sia = SentimentIntensityAnalyzer()

    messages = db.execute("SELECT content, sender FROM messages WHERE messages.conversation_id = ? AND messages.content IS NOT NULL AND messages.share IS NULL AND length(messages.content) > 20", (conversation_id,)).fetchall()
    for row in messages:
        if row[1] in sentiment_dict:
            sentiment_dict[row[1]].append(sia.polarity_scores(row[0])['compound'])
        else:
            sentiment_dict[row[1]] = [sia.polarity_scores(row[0])['compound']]
    
    for key,value in sentiment_dict.items():
        sentiment_dict[key] = sum(sentiment_dict[key])/len(sentiment_dict[key])
    return sentiment_dict



@bp.route('/contentType/<conversation_id>', methods=('GET', 'POST'))
def get_content_types(conversation_id):
    db = get_db()
    try:
        content_type_counts = db.execute("SELECT COUNT(gifs), COUNT(photos), COUNT(share), COUNT(audio), COUNT(video) FROM messages WHERE messages.conversation_id = ?", (conversation_id,)).fetchall()
        content_type_dict = {
            'gifs': content_type_counts[0][0],
            'photos': content_type_counts[0][1],
            'share': content_type_counts[0][2],
            'audio': content_type_counts[0][3],
            'video': content_type_counts[0][4],
        }
        return content_type_dict

    except Exception as e:
        print(e)    
        return "exception here:"



    