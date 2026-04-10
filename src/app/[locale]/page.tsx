import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { MenuSection } from '@/components/sections/MenuSection';
import { LocationSection } from '@/components/sections/LocationSection';
import { CateringSection } from '@/components/sections/CateringSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { GallerySection } from '@/components/sections/GallerySection';

async function getContent() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/content`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function Home() {
  const content = await getContent();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection content={content?.content} />
        <MenuSection />
        <LocationSection schedule={content?.schedule} />
        <CateringSection />
        <AboutSection content={content?.content} />
        <GallerySection />
      </main>
      <Footer
        socialLinks={content?.social}
        contact={{
          address: content?.content?.footer_address,
          phone: content?.content?.footer_phone,
          email: content?.content?.footer_email,
        }}
      />
    </div>
  );
}
