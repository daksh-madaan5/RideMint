import HeroSection from '@/features/home/HeroSection';
import FeaturedCars from '@/features/home/FeaturedCars';
import HowItWorks from '@/features/home/HowItWorks';
import CTASection from '@/features/home/CTASection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedCars />
      <HowItWorks />
      <CTASection />
    </>
  );
}
