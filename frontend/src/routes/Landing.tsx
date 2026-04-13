import React from 'react';
import { LandingLayout } from '../components/layouts/LandingLayout';
import { Hero } from '../components/sections/Hero';
import { Features } from '../components/sections/Features';

export const Landing: React.FC = () => (
  <LandingLayout>
    <Hero
      title="Nexon"
      headline="Where Communities Connect and Conversations Flow."
      subtitle={
        'Nexon is a modern communication platform built for communities of all kinds — from small friend ' +
        "groups to large global networks. Whether you're chatting, collaborating, or sharing ideas, Nexon " +
        'brings everything together in one place with fast, reliable, and real-time interaction. Stay ' +
        'connected, build meaningful conversations, and experience seamless communication without friction.'
      }
      image={`${process.env.PUBLIC_URL}/logo.png`}
      ctaText="Get Started"
      ctaLink="/register"
    />
    <Features />
  </LandingLayout>
);
