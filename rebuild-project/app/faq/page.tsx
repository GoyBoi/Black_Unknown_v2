import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const FAQPage = () => {
  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "Standard shipping within South Africa takes 3-5 business days. International shipping takes 7-14 business days depending on the destination."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return period for unused items in original condition. Items must be returned in their original packaging with tags attached."
    },
    {
      question: "How do I care for my crochet items?",
      answer: "Hand wash in cold water with mild detergent. Lay flat to dry. Avoid wringing or twisting. Store in a cool, dry place away from direct sunlight."
    },
    {
      question: "Are your products ethically made?",
      answer: "Yes, all our crochet items are handcrafted by skilled artisans who are fairly compensated. We prioritize sustainable materials and ethical production practices."
    },
    {
      question: "Can I customize a product?",
      answer: "We offer limited customization options on select items. Please contact our customer service team with your specific requirements."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit cards, Ozow, and bank transfers. All payments are securely processed through our encrypted payment gateway."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you'll receive an email with tracking information. You can also log into your account to view your order status."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship worldwide. International shipping costs vary by destination and will be calculated at checkout."
    }
  ];

  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Find answers to common questions about your orders, products, and more.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-foreground/20 rounded-lg overflow-hidden"
            >
              <button
                className="w-full flex justify-between items-center p-6 text-left hover:bg-foreground/5 transition-colors"
                onClick={() => toggleFaq(index)}
              >
                <h3 className="text-lg font-medium text-foreground">{faq.question}</h3>
                <ChevronDownIcon 
                  className={`w-5 h-5 text-foreground/60 transition-transform duration-300 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`} 
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 pt-2 border-t border-foreground/10">
                  <p className="text-foreground/80">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Still have questions?</h2>
          <p className="text-foreground/80 mb-6 max-w-xl mx-auto">
            Our customer support team is here to help you with any inquiries you may have.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-gold hover:bg-gold-light text-black font-bold px-6 py-3 rounded-lg transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;