import os
import glob
import fnmatch
import json
import random
from dataclasses import dataclass, field
import MessengerAnalyticsApp.models.conversation as conversation
import MessengerAnalyticsApp.models.message as message
from datetime import datetime
import codecs
import re
import json
import mysql.connector
import click
from flask import current_app, g
from flask.cli import with_appcontext


# Data configuration
DATA_DIR = "./data/"
JSON_PATTERN = '*.json'


def decode_str(str):
    if not str:
        return str
    return str.encode('latin1').decode('utf8')

#parses input folder for conversations, stores by foldername with values as file names
#this accounts for large conversations with many files
def find_json_messages():
    jsonFileDict = {}
    print(os.getcwd())
    print("hello")
    for parentDir, subdirs, filenames in os.walk(DATA_DIR):
        print(parentDir, subdirs, filename)
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

def parse_messages(messageFile):
    messages = []
    for message in messageFile["messages"]:
        newMessage = messages.Message(
            sender = message['sender_name'],
            content = decode_str(message.get("content", None)),
            timestamp = datetime.fromtimestamp(message["timestamp_ms"] / 1000.0).isoformat(),
            gifs = ', '.join([x["uri"] for x in message["gifs"]]) if "gifs" in message else None,
            photos = ', '.join([x["uri"] for x in message["photos"]]) if "photos" in message else None,
            share = message["share"].get("link", None) if "share" in message else None,
            audio = message["audio_files"][0].get("uri", None) if "audio_files" in message else None,
            video = ', '.join([x["uri"] for x in message["videos"]]) if "videos" in message else None,
        )
        messages.append(newMessage)
    return messages

def create_conversations(jsonFileDict):
    conversations = []
    for conversation, messageFilePaths in jsonFileDict.items():
        newConversation = conversations.Conversation(id=conversation)
        for messageFilePath in messageFilePaths:

            messageFile = json.load(open(messageFilePath))
            participants = [list(e.values())[0] for e in messageFile['participants']]
            if len(newConversation.participants) == 0: newConversation.participants = participants
            if newConversation.title == "": newConversation.title = messageFile['title']
            newConversation.messages.extend(parse_messages(messageFile))
    return conversations
        # print(newConversation)
    # print(conversations)


@click.command('load-db')
@with_appcontext
def load_db_command():
    """Clear the existing data and create new tables."""
    click.echo('Im here')

def main():
    jsonFileDict = find_json_messages()

    # remove_nonjson_objects(jsonFileDict.values())
    # random_entry = random.choice(list(jsonFileDict.items()))
    # jsonFileDict = {random_entry[0]: random_entry[1]}
    print(jsonFileDict)
    jsonFileDict = {'./data/theforgereturns_7kjmx7d_da': jsonFileDict['./data/theforgereturns_7kjmx7d_da']}

    conversations = create_conversations(jsonFileDict)

def start_processing_data():
    print("starting to process data")
    main()

#main()
