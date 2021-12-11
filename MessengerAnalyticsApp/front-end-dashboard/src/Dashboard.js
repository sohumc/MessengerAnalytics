import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Sidebar from './Sidebar';
import { Routes, Route, MemoryRouter } from 'react-router-dom';
import DashboardContent from './DashboardContent';
import { StaticRouter } from 'react-router-dom/server.js';

const drawerWidth = 480;

function Router(props) {
  const { children } = props;
  if (typeof window === 'undefined') {
    return <StaticRouter location="">{children}</StaticRouter>;
  }
  
  return (
    <MemoryRouter initialEntries={['']} initialIndex={0}>
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
          <Sidebar />
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
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
