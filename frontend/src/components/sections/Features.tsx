import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const features = [
  {
    question: 'Messages move at the speed of thought',
    answer:
      'Your words arrive the instant you hit send — no refreshes, no delays. ' +
      'Nexon\'s real-time engine keeps every conversation alive and flowing, ' +
      'so nothing gets lost in transit.',
  },
  {
    question: 'Your space, your rules',
    answer:
      'Build dedicated spaces for your team, friend group, or growing community. ' +
      'Channels stay organized, conversations stay relevant, and everyone ' +
      'always knows where to look.',
  },
  {
    question: 'Switch devices. Never miss a beat.',
    answer:
      'Pick up exactly where you left off — whether you\'re on your phone, tablet, ' +
      'or desktop. Nexon syncs your messages, notifications, and activity ' +
      'the moment they happen.',
  },
  {
    question: 'Grows with you, never against you',
    answer:
      'Whether you\'re 10 people or 10,000, Nexon\'s infrastructure holds up. ' +
      'No lag spikes, no downtime, no compromises — just a platform that ' +
      'gets stronger as your community does.',
  },
];

export const Features: React.FC = () => (
  <Box w="full" px={{ base: 4, md: 8 }} py={24} bg="#09090b">
    <Flex direction="column" align="center" mb={16}>
      <Heading
        as="h3"
        fontSize={{ base: '32px', md: '48px' }}
        fontWeight="600"
        color="#fafafa"
        textAlign="center"
        mb={4}
      >
        Platform Features
      </Heading>
      <Text
        fontSize="18px"
        color="brandGray.accent"
        maxW="600px"
        textAlign="center"
      >
        Discover the powerful features that make Nexon the perfect place for
        your communities to thrive.
      </Text>
    </Flex>

    <MotionBox
      w="full"
      maxW="800px"
      mx="auto"
      bg="#09090b"
      borderRadius="12px"
      border="1px solid #27272a"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      p={4}
    >
      <Accordion allowMultiple>
        {features.map((feature, i) => (
          <AccordionItem
            key={feature.question}
            border="none"
            borderBottom={i === features.length - 1 ? 'none' : '1px solid #27272a'}
          >
            <AccordionButton py={4} _hover={{ bg: 'transparent' }} color="#fafafa">
              <Box flex="1" textAlign="left" fontWeight="500">
                {feature.question}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} color="brandGray.accent">
              {feature.answer}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </MotionBox>
  </Box>
);
