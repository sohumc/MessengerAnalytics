
import click
from flask import current_app, g
from flask.cli import with_appcontext
import os
import os
import glob
import fnmatch
import json
import random
from dataclasses import dataclass, field
from MessengerAnalyticsApp.models.conversation import Conversation
from MessengerAnalyticsApp.models.message import Message
from datetime import datetime
import json
from flask import current_app, g
from MessengerAnalyticsApp.db import get_db


# Data configuration
DATA_DIR = "MessengerAnalyticsApp/data/"
JSON_PATTERN = '*.json'


def decode_str(str):
    if not str:
        return str
    return str.encode('latin1').decode('utf8')


#parses input folder for conversations, stores by foldername with values as file names
#this accounts for large conversations with many message files
def find_json_messages():
    jsonFileDict = {}
    print(os.getcwd())
    print("hello")
    for parentDir, subdirs, filenames in os.walk(DATA_DIR):
        for filename in fnmatch.filter(filenames, JSON_PATTERN):
            combined_path = parentDir + "/" + filename
            if(parentDir not in jsonFileDict):
                jsonFileDict[parentDir] = [combined_path]
            else:
                jsonFileDict[parentDir].append(combined_path)
    return jsonFileDict        

def remove_nonjson_objects(jsonFileList):
    for parentDir, subdirs, filenames in os.walk(DATA_DIR):
        for filename in filenames:
            combined_path = parentDir + "/" + filename
            if (combined_path) not in jsonFileList:
                os.remove(combined_path)
def parse_reactions(input_reactions):
    parsed_reactions = {}
    for reactionObject in input_reactions:
        if decode_str(reactionObject["reaction"]) in parsed_reactions:
            if reactionObject["actor"] not in parsed_reactions[decode_str(reactionObject["reaction"])]:
                parsed_reactions[decode_str(reactionObject["reaction"])].append(reactionObject["actor"])
        else:
            parsed_reactions[decode_str(reactionObject["reaction"])] = [reactionObject["actor"]]
    return parsed_reactions

def parse_messages(messageFile):
    messages = []
    for message in messageFile["messages"]:
        newMessage = Message(
            sender = message['sender_name'],
            content = decode_str(message.get("content", None)),
            timestamp = datetime.fromtimestamp(message["timestamp_ms"] / 1000.0).isoformat(),
            gifs = str(', '.join([x["uri"] for x in message["gifs"]])) if "gifs" in message else None,
            photos = str(', '.join([x["uri"] for x in message["photos"]])) if "photos" in message else None,
            share = message["share"].get("link", None) if "share" in message else None,
            audio = message["audio_files"][0].get("uri", None) if "audio_files" in message else None,
            video = ', '.join([x["uri"] for x in message["videos"]]) if "videos" in message else None,
            reactions = json.dumps(parse_reactions(message["reactions"])) if "reactions" in message else None
        )
        messages.append(newMessage)
    return messages

def create_conversations(jsonFileDict):
    conversations = []
    for conversationName, messageFilePaths in jsonFileDict.items():
        fixedConversationName = conversationName.replace("MessengerAnalyticsApp/data/", "")
        newConversation = Conversation(id=fixedConversationName)
        for messageFilePath in messageFilePaths:

            messageFile = json.load(open(messageFilePath))
            participants = [list(e.values())[0] for e in messageFile['participants']]
            if len(newConversation.participants) == 0: newConversation.participants = participants
            if newConversation.title == "": newConversation.title = decode_str(messageFile['title'])
            newConversation.messages.extend(parse_messages(messageFile))
        conversations.append(newConversation)
    return conversations

def load_conversations_to_db(conversationsList):
    db = get_db()
    conversations = [(e.id, e.title, str(e.participants)) for e in conversationsList]
    try:
        db.executemany(
            "INSERT INTO conversations (id, title, participants) VALUES (?, ?, ?)",
            conversations
        )
        db.commit()
    except db.IntegrityError:
        error = "Conversation is already registered."

    for conversation in conversationsList:
        dbmessageList = [(conversation.id, e.sender, e.timestamp, e.content, e.gifs, e.photos, e.share, e.audio, e.video, e.reactions) for e in conversation.messages]
        try:
            db.executemany(
                    "INSERT INTO messages (conversation_id, sender, timestamp, content, gifs, photos, share, audio, video, reactions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    dbmessageList
                )
            db.commit()
        except Exception as e:
            print(e)    


@click.command('load-db')
@with_appcontext
def load_db_command():
    jsonFileDict = find_json_messages()
    conversations = create_conversations(jsonFileDict)
    load_conversations_to_db(conversations)
    click.echo('Loaded the database.')


def init_app(app):
    app.cli.add_command(load_db_command)