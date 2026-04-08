import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { MenuSection } from '@/components/sections/MenuSection';
import { LocationSection } from '@/components/sections/LocationSection';
import { CateringSection } from '@/components/sections/CateringSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { GallerySection } from '@/components/sections/GallerySection';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <MenuSection />
        <LocationSection />
        <CateringSection />
        <AboutSection />
        <GallerySection />
      </main>
      <Footer />
    </div>
  );
}
