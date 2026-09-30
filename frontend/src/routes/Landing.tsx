import React from 'react';
import { LandingLayout } from '../components/layouts/LandingLayout';
import { Hero } from '../components/sections/Hero';
import { Features } from '../components/sections/Features';
import { userStore } from '../lib/stores/userStore';

export const Landing: React.FC = () => {
  const current = userStore((state) => state.current);

  return (
    <LandingLayout>
      <Hero
        lines={['Where', 'Communities', 'Connect']}
        subtitle={
          'Nexon is a real-time home for communities — chat, guilds, friends, and voice in one place, ' +
          'from a small group to a global network.'
        }
        primaryText={current ? 'Open App' : 'Get Started'}
        primaryLink={current ? '/channels/me' : '/register'}
        secondaryText={current ? 'See features' : 'Sign in'}
        secondaryLink={current ? '#features' : '/login'}
      />
      <Features />
    </LandingLayout>
  );
};
