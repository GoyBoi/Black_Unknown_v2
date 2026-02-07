import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <h1 className="text-4xl font-bold text-white mb-8">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
            <p className="text-white/80 mb-8">
              Have questions about our products, shipping, or anything else? Our team is here to help.
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Customer Care</h3>
                <p className="text-white/80">support@blackunknown.co.za</p>
                <p className="text-white/80">+27 11 123 4567</p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Johannesburg Studio</h3>
                <p className="text-white/80">123 Design District</p>
                <p className="text-white/80">Johannesburg, 2000</p>
                <p className="text-white/80">South Africa</p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Business Hours</h3>
                <p className="text-white/80">Monday - Friday: 9:00 AM - 6:00 PM SAST</p>
                <p className="text-white/80">Saturday: 10:00 AM - 4:00 PM SAST</p>
                <p className="text-white/80">Sunday: Closed</p>
              </div>
            </div>
          </div>
          
          <div>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-white font-medium mb-2">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full bg-background border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-white font-medium mb-2">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full bg-background border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-white font-medium mb-2">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  className="w-full bg-background border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="What is this regarding?"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-white font-medium mb-2">Message</label>
                <textarea 
                  id="message" 
                  rows={5}
                  className="w-full bg-background border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="How can we assist you today?"
                ></textarea>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-primary hover:bg-saffron-gold/90 text-black font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;