import React from 'react';
import Hero from './Hero';
import Features from './Features';
import HowItWorks from './HowItWorks';
import Pricing from './Pricing';
import CTASection from './CTASection';
import Footer from './Footer';

export default function LandingPage({ onNavigateToDashboard }) {
  return (
    <div className="landing-page-wrapper">
      <Hero onGetStarted={onNavigateToDashboard} />
      <Features />
      <HowItWorks />
      <Pricing onSelectPlan={onNavigateToDashboard} />
      <CTASection onGetStarted={onNavigateToDashboard} />
      <Footer />
    </div>
  );
}
