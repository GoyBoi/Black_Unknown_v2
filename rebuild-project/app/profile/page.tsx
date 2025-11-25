import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-white mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-[#1a150e] p-6 rounded-lg">
              <h2 className="text-xl font-bold text-white mb-4">Account Navigation</h2>
              
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-primary py-2 block font-medium">Account Dashboard</a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white py-2 block">Personal Details</a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white py-2 block">Addresses</a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white py-2 block">Order History</a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white py-2 block">Wishlist</a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white py-2 block">Notifications</a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white py-2 block">Loyalty Program</a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="bg-[#1a150e] p-6 rounded-lg">
              <h2 className="text-xl font-bold text-white mb-6">Personal Details</h2>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-white/80 text-sm font-medium mb-2">First Name</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      defaultValue="John"
                      className="w-full bg-background border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-white/80 text-sm font-medium mb-2">Last Name</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      defaultValue="Smith"
                      className="w-full bg-background border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-white/80 text-sm font-medium mb-2">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    defaultValue="john.smith@example.com"
                    className="w-full bg-background border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-white/80 text-sm font-medium mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    defaultValue="+27 11 123 4567"
                    className="w-full bg-background border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="id-number" className="block text-white/80 text-sm font-medium mb-2">South African ID Number</label>
                  <input 
                    type="text" 
                    id="id-number" 
                    defaultValue="0000000000000"
                    className="w-full bg-background border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="dateOfBirth" className="block text-white/80 text-sm font-medium mb-2">Date of Birth</label>
                  <input 
                    type="date" 
                    id="dateOfBirth" 
                    defaultValue="1990-01-01"
                    className="w-full bg-background border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div className="pt-4">
                  <button 
                    type="submit"
                    className="bg-primary hover:bg-saffron-gold/90 text-black font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    Update Information
                  </button>
                </div>
              </form>
            </div>
            
            <div className="bg-[#1a150e] p-6 rounded-lg mt-6">
              <h2 className="text-xl font-bold text-white mb-6">Change Password</h2>
              
              <form className="space-y-6">
                <div>
                  <label htmlFor="currentPassword" className="block text-white/80 text-sm font-medium mb-2">Current Password</label>
                  <input 
                    type="password" 
                    id="currentPassword" 
                    className="w-full bg-background border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-white/80 text-sm font-medium mb-2">New Password</label>
                  <input 
                    type="password" 
                    id="newPassword" 
                    className="w-full bg-background border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-white/80 text-sm font-medium mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    id="confirmPassword" 
                    className="w-full bg-background border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div className="pt-4">
                  <button 
                    type="submit"
                    className="bg-primary hover:bg-saffron-gold/90 text-black font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;