import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  date: string;
  content: string;
  verified: boolean;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-gold fill-current' : 'text-foreground/30'}`}
      />
    ));
  };

  return (
    <div className="py-16 bg-foreground/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What Our Customers Say</h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-background p-6 rounded-lg border border-foreground/10 hover:border-gold/30 transition-colors"
            >
              <div className="flex items-center mb-4">
                <div className="flex">
                  {renderStars(testimonial.rating)}
                </div>
                {testimonial.verified && (
                  <span className="ml-2 text-xs bg-gold/20 text-gold px-2 py-1 rounded">
                    Verified Purchase
                  </span>
                )}
              </div>
              
              <p className="text-foreground/90 italic mb-6">"{testimonial.content}"</p>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center mr-3">
                  <span className="font-bold text-foreground">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-foreground/60">{testimonial.location}</p>
                  <p className="text-xs text-foreground/50">{testimonial.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="bg-foreground text-background font-medium px-6 py-3 rounded-lg hover:bg-foreground/90 transition-colors">
            Read More Testimonials
          </button>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;