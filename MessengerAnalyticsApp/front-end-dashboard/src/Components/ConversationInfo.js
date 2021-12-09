import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from '../Title';
import { useLocation, BrowserRouter, useParams } from 'react-router-dom';

function preventDefault(event) {
  event.preventDefault();
}

export default function ConversationInfo() {

    // const { search } = useLocation();
    // let params = useParams();
    let location = useLocation()['pathname'].replace("/conversation/","");

  return (
    <React.Fragment>
      <Title>Conversation Stats</Title>
      <Typography component="p" variant="h4">
        {location}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        on 15 March, 2019
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View balance
        </Link>
      </div>
    </React.Fragment>
  );
}
