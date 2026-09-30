import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Flex, Heading, Link as CLink, Stack, Text } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { motion } from 'framer-motion';
import { ParticleSphere } from './ParticleSphere';

const MotionStack = motion(Stack);

const float = keyframes`
  0%, 100% { transform: translateY(0); opacity: 0.45; }
  50% { transform: translateY(6px); opacity: 1; }
`;

interface HeroProps {
  lines: string[];
  subtitle: string;
  primaryText: string;
  primaryLink: string;
  secondaryText: string;
  secondaryLink: string;
}

export const Hero: React.FC<HeroProps> = ({
  lines,
  subtitle,
  primaryText,
  primaryLink,
  secondaryText,
  secondaryLink,
}) => (
  <Flex
    as="section"
    position="relative"
    align={{ base: 'flex-end', lg: 'center' }}
    minH="100vh"
    w="full"
    overflow="hidden"
    px={{ base: 6, md: 12, xl: 20 }}
    pb={{ base: 28, lg: 0 }}
    pt={{ base: 32, lg: 0 }}
  >
    <Box position="absolute" top={0} right={0} zIndex={0} h="100%" w={{ base: '100%', lg: '62%' }}>
      <ParticleSphere />
    </Box>
    <Box
      position="absolute"
      inset={0}
      zIndex={1}
      pointerEvents="none"
      bg={{
        base: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.72) 58%, #000 100%)',
        lg: 'linear-gradient(90deg, #000 0%, rgba(0,0,0,0.72) 34%, rgba(0,0,0,0.15) 58%, rgba(0,0,0,0) 72%)',
      }}
    />

    <MotionStack
      spacing={{ base: 6, lg: 7 }}
      position="relative"
      w={{ base: '100%', lg: '46%' }}
      maxW="640px"
      zIndex={2}
      align="flex-start"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <Heading
        as="h1"
        fontSize={{ base: '52px', md: '72px', xl: '92px' }}
        fontWeight="500"
        letterSpacing="-2.4px"
        lineHeight="0.92"
        color="#fafafa"
      >
        {lines.map((line) => (
          <Box as="span" key={line} display="block">
            {line}
          </Box>
        ))}
      </Heading>

      <Text
        fontSize={{ base: '15px', md: '16px' }}
        fontWeight="400"
        lineHeight="1.55"
        color="#a1a1aa"
        maxW="420px"
      >
        {subtitle}
      </Text>

      <Flex gap={3} wrap="wrap" pt={1}>
        {primaryLink.startsWith('#') ? (
          <Button
            as="a"
            href={primaryLink}
            bg="#146ef5"
            color="white"
            borderRadius="6px"
            px="6"
            h="44px"
            fontSize="14px"
            fontWeight="500"
            _hover={{ bg: '#3b89ff' }}
            _active={{ bg: '#0055d4' }}
            _focus={{ boxShadow: 'none' }}
          >
            {primaryText}
          </Button>
        ) : (
          <Button
            as={Link}
            to={primaryLink}
            bg="#146ef5"
            color="white"
            borderRadius="6px"
            px="6"
            h="44px"
            fontSize="14px"
            fontWeight="500"
            _hover={{ bg: '#3b89ff' }}
            _active={{ bg: '#0055d4' }}
            _focus={{ boxShadow: 'none' }}
          >
            {primaryText}
          </Button>
        )}
        {secondaryLink.startsWith('#') ? (
          <Button
            as="a"
            href={secondaryLink}
            bg="#0c0c0c"
            color="#fafafa"
            borderRadius="6px"
            border="1px solid #2a2a2a"
            px="6"
            h="44px"
            fontSize="14px"
            fontWeight="500"
            _hover={{ bg: '#161616', borderColor: '#3a3a3a' }}
            _active={{ bg: '#000' }}
            _focus={{ boxShadow: 'none' }}
          >
            {secondaryText}
          </Button>
        ) : (
          <Button
            as={Link}
            to={secondaryLink}
            bg="#0c0c0c"
            color="#fafafa"
            borderRadius="6px"
            border="1px solid #2a2a2a"
            px="6"
            h="44px"
            fontSize="14px"
            fontWeight="500"
            _hover={{ bg: '#161616', borderColor: '#3a3a3a' }}
            _active={{ bg: '#000' }}
            _focus={{ boxShadow: 'none' }}
          >
            {secondaryText}
          </Button>
        )}
      </Flex>
    </MotionStack>

    <CLink
      href="#features"
      position="absolute"
      bottom={{ base: 6, md: 8 }}
      left={{ base: 6, md: 12, xl: 20 }}
      zIndex={2}
      display="inline-flex"
      alignItems="center"
      gap={3}
      color="#8d8d8d"
      fontSize="13px"
      _hover={{ color: '#fafafa', textDecoration: 'none' }}
    >
      <Box
        as="span"
        aria-hidden
        animation={`${float} 1.6s ease-in-out infinite`}
        fontSize="16px"
        lineHeight="1"
      >
        ↓
      </Box>
      Scroll to explore
    </CLink>
  </Flex>
);
