import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Testimonials from '@/components/Testimonials';

const TestimonialsPage = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'Cape Town, SA',
      rating: 5,
      date: 'January 15, 2026',
      content: 'The quality of the crochet work is absolutely incredible. My daughter loves her doll and the attention to detail is amazing. Will definitely order again!',
      verified: true
    },
    {
      id: 2,
      name: 'Michael Thompson',
      location: 'Johannesburg, SA',
      rating: 5,
      date: 'January 10, 2026',
      content: 'I purchased the crocheted shawl for my wife and she absolutely loves it. The craftsmanship is exceptional and the material feels luxurious.',
      verified: true
    },
    {
      id: 3,
      name: 'Emma Williams',
      location: 'Durban, SA',
      rating: 4,
      date: 'January 5, 2026',
      content: 'Beautiful handmade items with great attention to detail. The shipping was fast and the packaging was lovely. Highly recommend!',
      verified: true
    },
    {
      id: 4,
      name: 'David Brown',
      location: 'Pretoria, SA',
      rating: 5,
      date: 'December 28, 2025',
      content: 'These crochet flowers are so realistic I initially thought they were real! The quality and craftsmanship are top-notch.',
      verified: true
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      location: 'Port Elizabeth, SA',
      rating: 5,
      date: 'December 20, 2025',
      content: 'I ordered the baby crochet set and it was perfect. The colors were vibrant and the quality was excellent. My granddaughter adores it.',
      verified: true
    },
    {
      id: 6,
      name: 'James Miller',
      location: 'East London, SA',
      rating: 4,
      date: 'December 15, 2025',
      content: 'The customer service was fantastic and the product exceeded my expectations. Will be a returning customer for sure.',
      verified: true
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Customer Testimonials</h1>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Hear what our valued customers have to say about their MMWAFRIKA PRIDE experience
            </p>
          </div>

          <Testimonials testimonials={testimonials} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TestimonialsPage;