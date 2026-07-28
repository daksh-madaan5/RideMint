import React from 'react';
import HeroSection from '@/features/home/HeroSection';
import Statistics from '@/features/home/Statistics';
import FeaturedCars from '@/features/home/FeaturedCars';
import PopularBrands from '@/features/home/PopularBrands';
import WhyChooseUs from '@/features/home/WhyChooseUs';
import HowItWorks from '@/features/home/HowItWorks';
import Testimonials from '@/features/home/Testimonials';
import FAQSection from '@/features/home/FAQSection';
import Newsletter from '@/features/home/Newsletter';
import CTASection from '@/features/home/CTASection';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <Statistics />
      <FeaturedCars />
      <PopularBrands />
      <WhyChooseUs />
      <HowItWorks />
      <Testimonials />
      <FAQSection />
      <Newsletter />
      <CTASection />
    </div>
  );
}
