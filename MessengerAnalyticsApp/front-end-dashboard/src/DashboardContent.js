import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import React, { useState, useEffect } from 'react';
import List from '@material-ui/core/List';
import { BrowserRouter, Route, Switch, Link, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from './Chart';
import Deposits from './Deposits';
import Orders from './Orders';
import Sidebar from './Sidebar';
import ConversationInfo from './Components/ConversationInfo'
import ContentType from './Components/ContentType'
import ConversationSentiment from './Components/ConversationSentiment';
import MessageWordsData from './Components/MessageWordsData';
import MonthlyMessageChart from './Components/MonthlyMessageChart';
import HourlyMessageChart from './Components/HourlyMessageChart'
import DailyMessageChart from './Components/DailyMessageChart';
import ReactionCounts from './Components/ReactionCounts';
import TopReactedMessages from './Components/TopReactedMessages'
import AvgReactionsByParticipant from './Components/AvgReactionsByParticipant';
import MostMentioned from './Components/MostMentioned';
import ConversationStarters from './Components/ConversationStarters';
import { mainListItems, secondaryListItems } from './listItems';
import Title from './Title';




export default function DashboardContent() {
  const location = useLocation();
  const [count, setCount] = useState(0);
  const [conversationInfo, setConversationInfo] = useState([]);
  

  useEffect(() => {
    fetch('/api/conversationList').then(res => res.json()).then(
      data => {
        setConversationInfo(data["result"])
        
    });
  }, []);
  let conversation_id = useLocation()['pathname'].replace("/conversation/","");
  var result = conversationInfo.filter(obj => {
    return obj.id === conversation_id
  })
  var titleStr = "Select Conversation to Begin"
  if(result.length){
    titleStr = result[0]["title"]
  }

  return (
    <React.Fragment>
     
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography component="h2" variant="h4" color="primary" >
                   {titleStr}
                </Typography>
              </Paper>
            </Grid>
            {/* Monthly Message Chart */}
            <Grid item xs={12} md={8} lg={6}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 360,
                }}
              >    
              < MonthlyMessageChart/>                
              </Paper>
            </Grid>
            {/* Hourly Message Chart */}
            <Grid item xs={12} md={8} lg={6}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 360,
                }}
              >    
              < HourlyMessageChart/>                
              </Paper>
            </Grid>
            {/* Daily Message Chart */}
            <Grid item xs={12} md={8} lg={12}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 360,
                }}
              >    
              < DailyMessageChart/>                
              </Paper>
            </Grid>
            {/* Top Reacted Messages */}
            <Grid item xs={12} md={8} lg={6}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <TopReactedMessages />
              </Paper>
            </Grid>
            
            {/* Reaction Counts */}
            <Grid item xs={12} md={4} lg={2.5}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <ReactionCounts />
              </Paper>
            </Grid>
            {/* Average Reactions Per Message */}
            <Grid item xs={12} md={8} lg={3.5}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <AvgReactionsByParticipant />
              </Paper>
            </Grid>
            {/* Mentioned Stats */}
            <Grid item xs={12} md={8} lg={4}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <MostMentioned />
              </Paper>
            </Grid>
            {/* Conversation Starter Stats */}
            <Grid item xs={12} md={8} lg={4}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <ConversationStarters />
              </Paper>
            </Grid>
            {/* Conversation Sentiment */}
            <Grid item xs={12} md={8} lg={4}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <ConversationSentiment />
              </Paper>
            </Grid>
            {/* Content Shared Type */}
            <Grid item xs={12} md={4} lg={4}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <ContentType />
              </Paper>
            </Grid>
            
            {/* Message Word Data */}
            <Grid item xs={12} md={8} lg={4}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <MessageWordsData />
              </Paper>
            </Grid>
            
          </Grid>
        </Container>
  </React.Fragment>

    );
  }