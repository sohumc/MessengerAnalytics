import * as React from 'react';
import Title from '../Title';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { prettifyNumber } from '../Utils';


export default function ConversationInfo() {

    // const { search } = useLocation();
    // let params = useParams();
    const [conversationInfo, setConversationInfo] = useState({});
    let conversation_id = useLocation()['pathname'].replace("/conversation/","");
    useEffect(() => {

        fetch('/api/conversationBasicInfo/' + conversation_id).then(res => res.json()).then(
        data => {
            data["num_messages"] = prettifyNumber(data["num_messages"])
            setConversationInfo(data)
            });
        }, [conversation_id]);
    
  return (
    <React.Fragment>
      <Title>Conversation Info</Title>
      <List >
        <ListItem sx={{paddingTop: 0,paddingBottom: 0}}>
            <ListItemText
              primary="Participants"
              secondary={conversationInfo.participants} 
            />
        </ListItem>
        <ListItem sx={{paddingTop: 0,paddingBottom: 0}}>
            <ListItemText
              primary="Number of Messages"
              secondary={conversationInfo.num_messages}
            />
        </ListItem>
        <ListItem sx={{paddingTop: 0,paddingBottom: 0}}>
            <ListItemText
              primary="First Message Date"
              secondary={conversationInfo.first_message_date} 
            />
        </ListItem>
        <ListItem sx={{paddingTop: 0,paddingBottom: 0}}>
            <ListItemText
              primary="Last Message Date"
              secondary={conversationInfo.last_message_date}
            />
        </ListItem>
      </List>
      
    </React.Fragment>
  );
}
