import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

const WishlistPage = () => {
  // Sample wishlist items
  const wishlistItems = [
    {
      id: 1,
      name: 'The Noir Trench',
      price: 890,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmGJJpfHdWbDOC6SDjYPSwo8UuxScLHQhudwqTf-siHKogDcifsCtX1lJfIBpFyIkPp0x7CL9CMY-amwusJ42RczaPukuHNB7t_QLtwOUSr6lYlMuSsORx3_V-SNR_oDFwTFjFx3UFmmgAPnjCf7szYi6Ii2EkZIKRONr81q64ISSC5bOuguJTX74GBAhf63Ohgf64MfGA14NjNQdf5T51x7CZzLVTNCBnAtNS2LLD0-jXsB9Bc_zBxqyYd6_RGhwAwsnlP8kD0EWh',
      brand: 'mmwAfrika Pride',
    },
    {
      id: 2,
      name: 'Onyx Leather Tote',
      price: 650,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFQ87S5MnyfCmCU2p35xl59LfFJEPXbeZZ97Q5k8leXrpf3W48gDw5xeCXP6W9KBzPe2-GU7tQkVIiRJ68tfkATuEsBFDARyEUP464Wea5GnYhVVEW7RRD20bpxTy2qYlz_I-ue7uSX8wY-dZgP2rZCpzSQkiE9DivZr2jOpKI0-zIHi9OoONNYCxYLFP9pK80hJx4YPsbUxRWg_ABHNaqdzfpXy_k9aC6OCwu82VvpVXPnR9jK0t2r1YNOkzEBFG73RazH8oiUh_a',
      brand: 'Amogela Innovations',
    },
    {
      id: 3,
      name: 'Midnight Silk Scarf',
      price: 220,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmfKkJ2Upa5XThXxyPAmV1PO_j1fyx4Ay5sGty0S27uDHPEcP5hx3a8nE_tc9D1Bj35GQAlzRzSu7XZNsOsIXWWRgVa4U_3KZGc9cxnX8xqRtpYAEsgK5qUEE2KeSNL_lCJpNpFKyfd1eFMUAxWcK3gnWIhHtlKladaVrh8BDxe-88bjEBnhQE1hHO0uOKknTvXL8ntRW6iaYzZZoexl39E5GQFVEDLRmkCpSu5Pz8cQ_ZClLYEOBxIq5SCipSL6f9xRMGqJgSeRXL',
      brand: 'mmwAfrika Pride',
    },
    {
      id: 4,
      name: 'Eclipse Timepiece',
      price: 1200,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0pMfcFMnPdPg5NxERgov8kxRYJKfmcTjElmK0Skkqag3Gmc-f4-fdGBkwPgaAX0kF9vGrhtftAz5vsLrscyAAK8Gdijzfmrwsq_aCwkK-OYBvycjoAnGoPQJ9D-qiviZ2zeSKrMiW7Di2KSSE4GUS_mwv9m-QZQHtA4RckoKkn-AOnjL_hEb_vevOCaCbcoN1VxAzvlkJD6iXGfgPkqZzbE3p7Ry_0E63_yyjQhVd2nN1T-srmHpW7ZxVicwooeBu6vja0rsDtie9',
      brand: 'Amogela Innovations',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">My Wishlist</h1>
          <p className="text-white/80">{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}</p>
        </div>
        
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-white mb-4">Your wishlist is empty</h2>
            <p className="text-white/80 mb-6">Saved items will appear here. Start browsing our collection!</p>
            <a 
              href="/shop" 
              className="inline-block bg-primary hover:bg-saffron-gold/90 text-black font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Browse Collection
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {wishlistItems.map((product) => (
              <div key={product.id} className="relative group">
                <ProductCard product={product} />
                <button className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-primary text-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Recently Viewed</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="aspect-[3/4] bg-stone-800 rounded-lg overflow-hidden">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBu5fW1pFPLpRz1gLyy3iFzVbmeNyfrJO6WJoT7qqi1rinjwXiMAEdNJREbKam-I74fnndoDFmcqhBjsPmp-kZDWyH3aTjyQ2OifffjZCZEfK2BIiBzCGyW79l88gtzOT3qBgyzAUWHsOkE49ABiZneW8Gu82Q232dCehjLOGZ5orBJuIbrFy3gA6JKoKjcyLhcCCxsbtM4vTkZ0UzI8CRF2a3WsDg1-ADK0qLEqXW6QukmftsBSfRolGIfJc7CU7dHda0GxxJFnkX3" 
                alt="Recent item" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-[3/4] bg-stone-800 rounded-lg overflow-hidden">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBu5njUBjt-n7zcLAMb8tGU3VXiGVk8tf_uwgOkSDB0ckHA3W38thwEzOul7D5nIgnWrWM3bD0FPY9qItYXsDWfGlFq82KYgNeK3YhoMxI3HEBNobNQaONOxTImVMSTJN2RtYSLSnAxpWcihQqgzBrHFZWr-88X5TbFzTe-IjQ44H-2WGpoiu8FOVIPtGT-oeKOxDxThZPca6Vw-tnKcMXgRBBMQPdBiwHFReyFPDQ55-YKB2QyseMB8VmxYuY37YQ34Gmp9dmd1XT9" 
                alt="Recent item" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-[3/4] bg-stone-800 rounded-lg overflow-hidden">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-1BcczQUxqs86uYG52p8d46KPnKTA6NRRJildhMczcpBWFUop1T8UK9r7H9F0_j9AKlsA1t1tcRKRzuXUYAje9UwqdbYbSlMdiH0d74atYMFD_fXt92NWCPEXYNdjprSToP2LIPoLF4z3061U18atHnO8hmFRaCojMcq3wu_WyPMun1hQ8YSPEvVOk7l_GSz0fIdBa24w3cxWxKxh7DSmhAuCP6vWD7lmpEO1_0-niICMnTYsYU6VhLKcFDm1VElstPykWi8UFaOB" 
                alt="Recent item" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-[3/4] bg-stone-800 rounded-lg overflow-hidden">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmGJJpfHdWbDOC6SDjYPSwo8UuxScLHQhudwqTf-siHKogDcifsCtX1lJfIBpFyIkPp0x7CL9CMY-amwusJ42RczaPukuHNB7t_QLtwOUSr6lYlMuSsORx3_V-SNR_oDFwTFjFx3UFmmgAPnjCf7szYi6Ii2EkZIKRONr81q64ISSC5bOuguJTX74GBAhf63Ohgf64MfGA14NjNQdf5T51x7CZzLVTNCBnAtNS2LLD0-jXsB9Bc_zBxqyYd6_RGhwAwsnlP8kD0EWh" 
                alt="Recent item" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WishlistPage;