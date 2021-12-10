import * as React from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import Typography from '@mui/material/Typography';
import {
  Link as RouterLink,
  Route,
  Routes,
  MemoryRouter,
  useLocation,
} from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server.js';
import { useState, useEffect } from 'react';


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
  const {primary, to, selected, onClick} = props;

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
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

export default function Sidebar() {
    const [count, setCount] = useState(0);
    const [conversationList, setConversationList] = useState([]);
    const [selectedID, setSelectedID] = useState("");

    const handleListItemClick = (event, id) => {
    setSelectedID(id);
    console.log("selected", id);
    };

    useEffect(() => {

        fetch('/api/conversationList').then(res => res.json()).then(
        data => {
            setConversationList(data.result)
            console.log(data.result);
            });
        }, []);
    return (
        <React.Fragment>
          <List>
          {conversationList.map(conversation => (
                <ListItemLink
                selected={selectedID === conversation.id}
                onClick={(event) => handleListItemClick(event, conversation.id)} 
                to={"conversation/" + conversation.id}
                primary={conversation.title} 
                key = {conversation.id}
                />

            ))}
            </List>
    </ React.Fragment>
  );
}