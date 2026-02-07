import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">About MMWAFRIKA PRIDE</h1>
        
        <div className="prose prose-invert max-w-none text-foreground">
          <p className="text-lg text-foreground/80 mb-6">
            MMWAFRIKA PRIDE is built on a foundation of traditional crochet craftsmanship and artistic expression. We create unique, hand-knitted pieces that celebrate the beauty of handmade artistry.
          </p>
          
          <p className="text-lg text-foreground/80 mb-6">
            Every crochet item is lovingly handcrafted with attention to detail, ensuring quality and uniqueness that speaks to our commitment to preserving traditional crafts and celebrating creativity.
          </p>
          
          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">Our Ethos</h2>
          <p className="text-lg text-foreground/80 mb-6">
            At MMWAFRIKA PRIDE, we believe in the beauty of handmade items and the joy that comes from creating and using items made with love. Our crochet creations embrace tradition, celebrating the artistry of hand-knitted items that bring warmth and beauty to everyday life.
          </p>
          
          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">Sustainability</h2>
          <p className="text-lg text-foreground/80 mb-6">
            We are committed to sustainable practices in every aspect of our crochet business. Using eco-friendly yarns and materials, we ensure that our environmental footprint remains minimal while maintaining the highest quality standards in our hand-knitted creations.
          </p>
          
          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">Our Craftsmanship</h2>
          <p className="text-lg text-foreground/80 mb-6">
            Each crochet item in our collection is meticulously handcrafted by skilled artisans who bring years of expertise to every stitch. Our commitment to quality ensures that each item is not only beautiful but also durable and long-lasting.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;