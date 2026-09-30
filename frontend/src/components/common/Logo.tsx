import { Box, Image } from '@chakra-ui/react';
import React from 'react';

export const Logo: React.FC = () => (
  <Box w="46px" h="38px" overflow="hidden" flexShrink={0}>
    <Image
      src={`${process.env.PUBLIC_URL}/logo.png`}
      alt=""
      w="92px"
      maxW="none"
      h="61px"
      ml="-22px"
      mt="-11px"
      draggable={false}
    />
  </Box>
);
