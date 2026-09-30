import React, { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { NavBar } from '../sections/NavBar';
import { Footer } from '../sections/Footer';

interface IProps {
  children: React.ReactNode;
}

export const LandingLayout: React.FC<IProps> = ({ children }) => {
  useEffect(() => {
    const { body } = document;
    const html = document.documentElement;
    const prevBody = body.style.background;
    const prevHtml = html.style.background;
    body.style.background = '#000';
    html.style.background = '#000';
    return () => {
      body.style.background = prevBody;
      html.style.background = prevHtml;
    };
  }, []);

  return (
    <Box position="relative" w="100%" minH="100vh" bg="#000" color="#fafafa">
      <NavBar />
      {children}
      <Footer />
    </Box>
  );
};
