import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
// import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { mainListItems, secondaryListItems } from './listItems';
import Chart from './Chart';
import Deposits from './Deposits';
import Orders from './Orders';
import Sidebar from './Sidebar';
import { BrowserRouter, Routes, Route, MemoryRouter, useLocation } from 'react-router-dom';
import DashboardContent from './DashboardContent';
import { useState, useEffect } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { StaticRouter } from 'react-router-dom/server.js';
import ListRouter from './Sidebar'

import Content from './Content'

import PropTypes from 'prop-types';

const drawerWidth = 480;

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


const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  () => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      
      boxSizing: 'border-box',
     },
  }),
);

const mdTheme = createTheme();



function Dashboard() {
  const [count, setCount] = useState(0);
  const [conversationList, setConversationList] = useState([]);
  const [selectedID, setSelectedID] = useState("");

   useEffect(() => {
  
      fetch('/api/conversationList').then(res => res.json()).then(
        data => {
            setConversationList(data.result)
            console.log("successfully called")
      });
    }, []);

  return (

    <ThemeProvider theme={mdTheme}>
      <Router>

      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute">
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              sx={{ flexGrow: 1 }}
            >
              FB Messenger Conversation Analytics
            </Typography>
            
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" postion= "relative">
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            
          </Toolbar>
          <Divider />
          <Sidebar/>
          <Divider />
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />

          <Routes>
          <Route path = "/*" element = {<DashboardContent/>}> </Route>

          </Routes>
          
        </Box>
      </Box>
      </Router>

    </ThemeProvider>

  );
}

export default function DashboardApp() {
  return <Dashboard />;
}
