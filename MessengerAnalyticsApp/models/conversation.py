from dataclasses import dataclass, field
from .message import Message


@dataclass
class Conversation:
    id: str = ""
    title: str = ""
    participants: list[str] = field(default_factory=list)
    messages: list[Message]= field(default_factory=list)
