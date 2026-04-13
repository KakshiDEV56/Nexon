import { Box, Image, Text } from '@chakra-ui/react';
import React from 'react';

export const Logo: React.FC = () => (
  <Box w="80px" color={['brandGray.darkest', 'brandGray.darkest', 'brandGray.darkest', 'brandGray.darkest']}>
    <Text fontSize="lg" fontWeight="bold">
      <Image src={`${process.env.PUBLIC_URL}/logo.png`} />
    </Text>
  </Box>
);
