import React from "react";
import HeroSection from "../components/HeroSection";
import StatsSection from "../components/StatsSection";
import FeaturesGrid from "../components/FeaturesGrid";
import TechStack from "../components/TechStack";
import CitiGPTShowcase from "../components/CitiGPTShowcase";
import TestimonialsSection from "../components/TestimonialsSection";
import FAQSection from "../components/FAQSection";
import CTASection from "../components/CTASection";

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      {/* <StatsSection /> */}
      <FeaturesGrid />
      <TechStack />
      <CitiGPTShowcase />
      {/* <TestimonialsSection /> */}
      <FAQSection />
      <CTASection />
    </div>
  );
};

export default Home;
