from dataclasses import dataclass, field

import json
import logging
import os
import time
import sys
from datetime import datetime

@dataclass
class Message:
    sender: str = ""
    content: str = ""
    timestamp: datetime = ""
    gifs: list[str] = field(default_factory=list)
    photos: list[str] = field(default_factory=list)
    share: str = ""
    audio: str = ""
    video: str = ""
    reactions: dict = field(default_factory=dict)

