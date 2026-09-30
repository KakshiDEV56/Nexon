import React from 'react';
import { Box, Flex, Link, Stack, Text } from '@chakra-ui/react';
import { AiOutlineGithub } from 'react-icons/ai';
import { IconType } from 'react-icons';
import { StyledTooltip } from './StyledTooltip';

type FooterLinkProps = {
  icon?: IconType;
  href?: string;
  label?: string;
};

const FooterLink: React.FC<FooterLinkProps> = ({ icon, href, label }) => (
  <StyledTooltip label={label!} position="top">
    <Link display="inline-block" href={href} aria-label={label} isExternal mx={2}>
      <Box as={icon} width="24px" height="24px" color="gray.400" _hover={{ color: 'gray.100' }} />
    </Link>
  </StyledTooltip>
);

const links = [
  {
    icon: AiOutlineGithub,
    label: 'GitHub',
    href: 'https://github.com/KakshiDEV56/Nexon',
  },  
];

export const Footer: React.FC = () => (
  <Flex bottom={0} as="footer" align="center" justify="center" w="100%" p={8} bg="#000">
    <Box textAlign="center">
      <Text fontSize="xl">
        <span>Nexon | 2026</span>
      </Text>
      <Text>Built for Real-Time Connection</Text>
      <Stack mt={2} isInline justify="center" spacing="6">
        {links.map((link) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <FooterLink key={link.href} {...link} />
        ))}
      </Stack>
    </Box>
  </Flex>
);
