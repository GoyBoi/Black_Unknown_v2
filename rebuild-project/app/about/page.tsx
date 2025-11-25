import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-white mb-8">About Black Unknown</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-white/80 mb-6">
            Black Unknown is built on a foundation of craftsmanship, minimalism, and timeless style. We create pieces that are both bold and understated, designed for the discerning individual.
          </p>
          
          <p className="text-lg text-white/80 mb-6">
            Every piece is meticulously crafted from the finest materials, ensuring longevity and an impeccable finish that speaks to our commitment to excellence and the art of subtlety.
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">Our Ethos</h2>
          <p className="text-lg text-white/80 mb-6">
            At Black Unknown, we believe in the power of anonymity and the strength that comes from letting your character, rather than your clothing, speak volumes. Our designs embrace the shadows, celebrating those who prefer the quiet confidence of well-crafted, minimalistic luxury.
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">Sustainability</h2>
          <p className="text-lg text-white/80 mb-6">
            Sustainability is at the core of our brand. We source our materials ethically and ensure our production processes have minimal environmental impact. Our pieces are designed to last, reducing the need for frequent replacements and contributing to a more sustainable fashion industry.
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">Our Team</h2>
          <p className="text-lg text-white/80 mb-6">
            Our team consists of passionate designers, craftspeople, and sustainability experts who share a vision of creating timeless pieces that honor both the individual and the environment. We work closely with local artisans and suppliers to ensure the highest quality while supporting communities and traditions.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;