/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Flex, Heading, Image, Link as CLink, Stack, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionStack = motion(Stack);

interface HeroProps {
  title: string;
  headline?: string;
  subtitle: string;
  image: string;
  ctaLink: string;
  ctaText: string;
}

export const Hero: React.FC<HeroProps> = ({ title, headline, subtitle, image, ctaLink, ctaText, ...rest }) => (
  <Flex
    align="center"
    justify="space-between"
    direction={{ base: 'column-reverse', md: 'row' }}
    wrap="nowrap"
    minH="80vh"
    w="full"
    px={{ base: 4, md: 8 }}
    mb={16}
    {...rest}
  >
    <MotionStack
      spacing={6}
      w={{ base: '100%', md: '50%' }}
      align={['center', 'center', 'flex-start', 'flex-start']}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <MotionHeading
        as="h1"
        fontSize={{ base: '48px', md: '64px', lg: '80px' }}
        fontWeight="600"
        letterSpacing="-0.8px"
        lineHeight="1.04"
        color="#fafafa"
        textAlign={['center', 'center', 'left', 'left']}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {title}
      </MotionHeading>

      {headline && (
        <MotionHeading
          as="h2"
          fontSize={{ base: '24px', md: '36px', lg: '40px' }}
          fontWeight="600"
          lineHeight={1.2}
          color="#fafafa"
          textAlign={['center', 'center', 'left', 'left']}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {headline}
        </MotionHeading>
      )}
      
      <MotionHeading
        as="h3"
        fontSize={{ base: '18px', md: '20px', lg: '22px' }}
        opacity="0.8"
        fontWeight="500"
        lineHeight={1.40}
        color="brandGray.accent"
        textAlign={['center', 'center', 'left', 'left']}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        maxW="90%"
      >
        {subtitle}
      </MotionHeading>

      <MotionBox
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        pt={4}
      >
        <Link to={ctaLink}>
          <Button 
            background="highlight.standard" 
            color="white" 
            borderRadius="4px" 
            py="6" 
            px="8" 
            fontSize="16px"
            fontWeight="500"
            _hover={{ 
              bg: 'highlight.hover', 
              transform: 'translateY(-6px)',
              boxShadow: '0 20px 40px -10px rgba(20,110,245,0.4)',
            }}
            transition="all 0.3s ease-in-out"
          >
            {ctaText}
          </Button>
        </Link>
      </MotionBox>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <Text fontSize="16px" mt={4} textAlign="center" color="brandGray.accent">
          Got an account already?{' '}
          <CLink 
            as={Link} 
            to="/login" 
            ml="1" 
            color="highlight.standard" 
            fontWeight="500" 
            _focus={{ outline: 'none' }} 
            _hover={{ textDecoration: 'underline' }}
          >
            Sign in
          </CLink>
        </Text>
      </MotionBox>
    </MotionStack>
    <MotionBox
      w={{ base: '80%', sm: '60%', md: '45%' }}
      mb={{ base: 12, md: 0 }}
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
    >
      <Box 
        position="relative" 
        rounded="8px"
        p={4}
      >
        <Image src={image} w="100%" objectFit="contain" />
      </Box>
    </MotionBox>
  </Flex>
);
