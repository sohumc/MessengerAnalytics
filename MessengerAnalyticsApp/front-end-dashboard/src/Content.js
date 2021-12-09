import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, MemoryRouter, useLocation } from 'react-router-dom';

import Typography from '@mui/material/Typography';

export default function Content(){
    const location = useLocation();
    return (
        <Typography variant="body2" sx={{ pb: 2 }} color="text.secondary">
          Current route: {location.pathname}
        </Typography>
      );
  }