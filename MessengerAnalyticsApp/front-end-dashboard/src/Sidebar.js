import * as React from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import {
  Link as RouterLink,
  MemoryRouter,
} from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server.js';
import { useState, useEffect } from 'react';
import { prettifyNumber } from './Utils';
import Toolbar from '@mui/material/Toolbar';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';


function Router(props) {
  const { children } = props;
  if (typeof window === 'undefined') {
    return <StaticRouter location="/drafts">{children}</StaticRouter>;
  }

  return (
    <MemoryRouter initialEntries={['/drafts']} initialIndex={0}>
      {children}
    </MemoryRouter>
  );
}

Router.propTypes = {
  children: PropTypes.node,
};

function ListItemLink(props) {
  const {primary, to, selected, onClick, secondary} = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef(function Link(itemProps, ref) {
        return <RouterLink to={to} ref={ref} {...itemProps} role={undefined} />;
      }),
    [to],
  );

  return (
    <li>
      <ListItem button component={renderLink} selected = {selected} onClick = {onClick} key = {primary}>
        <ListItemText primary={primary} secondary = {secondary} />
      </ListItem>
    </li>
  );
}

export default function Sidebar() {
    const [originalConversationList, setOriginalConversationList] = useState([]);
    const [filteredConversationList, setFilteredConversationList] = useState([]);
    const [selectedID, setSelectedID] = useState("");
    const handleListItemClick = (event, id) => {
      setSelectedID(id);
    };

    const handleSearchChange = (event, newValue) => {
      if(newValue){
        let newList = originalConversationList.filter(function(conversation){
          return conversation.title === newValue
        })
        setFilteredConversationList(newList)
      }
      else{
        setFilteredConversationList(originalConversationList)
      }

    }
    useEffect(() => {

        fetch('/api/conversationList').then(res => res.json()).then(
        data => {
            setOriginalConversationList(data.result)
            setFilteredConversationList(data.result)
            });
        }, []);
    return (
        <React.Fragment>
          <Toolbar
            sx={{paddingTop:"10px", paddingBottom:"10px"
            }}
          >
          <Autocomplete
            id="search-field"
            options={originalConversationList.map((conversation) => conversation.title)}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.id}>
                  {option}
                </li>
              );
            }}
            renderInput={(params) => <TextField {...params} label="Search" />}
            onChange={(event, newValue) => {
              handleSearchChange(event, newValue)
          }}
            sx={{
              width: '400px',
              margin: "auto"
            }} 
          />
          </Toolbar>
          <Divider />
          <List sx={{
            height: '100vh',
            overflow: 'auto',
            paddingTop: 0
          }}>
            {filteredConversationList.map(conversation => (
                  <ListItemLink
                  selected={selectedID === conversation.id}
                  onClick={(event) => handleListItemClick(event, conversation.id)} 
                  to={"conversation/" + conversation.id}
                  primary={conversation.title} 
                  secondary = {prettifyNumber(conversation.num_messages) + " messages"}
                  key = {conversation.id}
                  />

            ))}
          </List>
    </ React.Fragment>
  );
}