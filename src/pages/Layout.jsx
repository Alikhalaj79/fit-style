import { Box, Container } from '@mui/material';
import React from 'react';
import Header from '../components/templates/layout/Header';
import Footer from '../components/templates/layout/Footer';

const Layout = ({children}) => {
    return (
      <Box
        display="flex"
        flexDirection="column"
        minHeight="100vh"
        sx={{ margin: 0, padding: 0 }}
      >
        {/* Header */}
        <Header />
        {/* Main Content */}
        <Box component="main" flexGrow={1} sx={{ margin: 0, padding: 0 }}>
          <Container>{children}</Container>
        </Box>
        {/* Footer */}
        <Footer />
      </Box>
    );
};

export default Layout;