import { Button, Flex, Link as CLink, Text } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';
import { userStore } from '../../lib/stores/userStore';
import { Logo } from '../common/Logo';

const NAV_LINKS = [
  { label: 'Messages', href: '#messages' },
  { label: 'Spaces', href: '#spaces' },
  { label: 'Sync', href: '#sync' },
  { label: 'Scale', href: '#scale' },
];

export const NavBar: React.FC = () => {
  const current = userStore((state) => state.current);

  return (
    <Flex
      as="nav"
      position="absolute"
      top={0}
      left={0}
      right={0}
      zIndex={5}
      align="center"
      justify="space-between"
      w="100%"
      px={{ base: 5, md: 10, xl: 16 }}
      py={{ base: 5, md: 6 }}
    >
      <Link to="/" aria-label="Nexon home">
        <Flex align="center" gap={2}>
          <Logo />
          <Text fontSize="18px" fontWeight="600" letterSpacing="-0.4px" color="#fafafa">
            Nexon
          </Text>
        </Flex>
      </Link>

      <Flex align="center" gap={{ md: 8, xl: 10 }} display={{ base: 'none', lg: 'flex' }}>
        {NAV_LINKS.map((item) => (
          <CLink
            key={item.href}
            href={item.href}
            color="#9a9a9a"
            fontSize="14px"
            fontWeight="500"
            _hover={{ color: '#fafafa', textDecoration: 'none' }}
          >
            {item.label}
          </CLink>
        ))}
      </Flex>

      <Link to={current ? '/channels/me' : '/register'}>
        <Button
          bg="#146ef5"
          color="white"
          size="sm"
          h="36px"
          px="4"
          rounded="6px"
          fontSize="14px"
          fontWeight="500"
          _hover={{ bg: '#3b89ff' }}
          _active={{ bg: '#0055d4' }}
          _focus={{ boxShadow: 'none' }}
        >
          Launch App
        </Button>
      </Link>
    </Flex>
  );
};
