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
import { mainListItems, secondaryListItems } from './listItems';
import Title from './Title';




export default function DashboardContent() {
  const location = useLocation();

    return (
      <React.Fragment>
        <Typography variant="body2" sx={{ pb: 2 }} color="text.secondary">
          Current route: {location.pathname}
        </Typography>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* ConversationInfo */}
              
              <Grid item wrap = "nowrap" xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >

                  <ConversationInfo />
                </Paper>
              </Grid>
              
              {/* Chart */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <Chart />
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
            </Grid>
          </Container>
    </React.Fragment>

      );
  }