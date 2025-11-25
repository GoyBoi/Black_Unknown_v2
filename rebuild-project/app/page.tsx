'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const HomePage = () => {
  // Sample product data
  const featuredProducts = [
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
  ];

  const newArrivals = [
    {
      id: 4,
      name: 'Eclipse Timepiece',
      price: 1200,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0pMfcFMnPdPg5NxERgov8kxRYJKfmcTjElmK0Skkqag3Gmc-f4-fdGBkwPgaAX0kF9vGrhtftAz5vsLrscyAAK8Gdijzfmrwsq_aCwkK-OYBvycjoAnGoPQJ9D-qiviZ2zeSKrMiW7Di2KSSE4GUS_mwv9m-QZQHtA4RckoKkn-AOnjL_hEb_vevOCaCbcoN1VxAzvlkJD6iXGfgPkqZzbE3p7Ry_0E63_yyjQhVd2nN1T-srmHpW7ZxVicwooeBu6vja0rsDtie9',
      brand: 'Amogela Innovations',
    },
    {
      id: 5,
      name: 'Shadow Ankle Boots',
      price: 780,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBu5fW1pFPLpRz1gLyy3iFzVbmeNyfrJO6WJoT7qqi1rinjwXiMAEdNJREbKam-I74fnndoDFmcqhBjsPmp-kZDWyH3aTjyQ2OifffjZCZEfK2BIiBzCGyW79l88gtzOT3qBgyzAUWHsOkE49ABiZneW8Gu82Q232dCehjLOGZ5orBJuIbrFy3gA6JKoKjcyLhcCCxsbtM4vTkZ0UzI8CRF2a3WsDg1-ADK0qLEqXW6QukmftsBSfRolGIfJc7CU7dHda0GxxJFnkX3',
      brand: 'mmwAfrika Pride',
    },
    {
      id: 6,
      name: 'Void Structured Blazer',
      price: 950,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBu5njUBjt-n7zcLAMb8tGU3VXiGVk8tf_uwgOkSDB0ckHA3W38thwEzOul7D5nIgnWrWM3bD0FPY9qItYXsDWfGlFq82KYgNeK3YhoMxI3HEBNobNQaONOxTImVMSTJN2RtYSLSnAxpWcihQqgzBrHFZWr-88X5TbFzTe-IjQ44H-2WGpoiu8FOVIPtGT-oeKOxDxThZPca6Vw-tnKcMXgRBBMQPdBiwHFReyFPDQ55-YKB2QyseMB8VmxYuY37YQ34Gmp9dmd1XT9',
      brand: 'Amogela Innovations',
    },
    {
      id: 7,
      name: 'Phantom Sunglasses',
      price: 450,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-1BcczQUxqs86uYG52p8d46KPnKTA6NRRJildhMczcpBWFUop1T8UK9r7H9F0_j9AKlsA1t1tcRKRzuXUYAje9UwqdbYbSlMdiH0d74atYMFD_fXt92NWCPEXYNdjprSToP2LIPoLF4z3061U18atHnO8hmFRaCojMcq3wu_WyPMun1hQ8YSPEvVOk7l_GSz0fIdBa24w3cxWxKxh7DSmhAuCP6vWD7lmpEO1_0-niICMnTYsYU6VhLKcFDm1VElstPykWi8UFaOB',
      brand: 'mmwAfrika Pride',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="w-full relative min-h-[75vh] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center flex flex-col items-center justify-center p-4 text-center"
            style={{
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCPT2peyP1bs4kKbBDrui4jNP9V8jSYMsuVifWmPfrchv4XYBOw9Ty0gAVVBEnHXmMLCkpoZsT26l2Yu9ZcaAmuWmQHJ7WgVKPDdvnl8ttSceOzMKMHA7alRvjjahbw0oC-VTp2JMWolHrcnTWr4KF8XwFl9BbwT29wAdu2iesyM7nADkp6wdyJ7n6eIGoX7aZedgZ9ZOQwnEFnjL0-sazBtDBUl9-7so-7jIXM-8SfWr9aDISFI3irMYOuDlESy7mn_7qsOQuVjDQn")',
            }}
          >
            <div className="flex flex-col gap-4 max-w-3xl z-10">
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
                The Art of Anonymity
              </h1>
              <p className="text-white/90 text-base md:text-lg max-w-xl mx-auto">
                Discover a new era of minimalistic luxury and timeless style, crafted for the discerning individual who values subtlety over spectacle.
              </p>
              <Link 
                href="/shop" 
                className="mt-6 mx-auto flex items-center gap-2 bg-primary text-black hover:bg-saffron-gold/90 font-bold py-3 px-6 rounded-lg transition-colors w-fit"
              >
                <span>Explore The Collection</span>
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Brand Ethos Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24 bg-[#1a150e]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div 
              className="w-full h-96 bg-cover bg-center rounded-lg"
              style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAZzIgq3G-HmScw4GUaFKAOfixQ5mDuGHt8SOU1XQZ7DJQR9VWLcorxgHc4_-I0jk3iPVcRbtfZd4LitjaUyr9slKGG1MjTW4Khkp-l83OLTiIHDLOzwQY6OYbWV34uN5_cIWDbNuYudy0Ji7YxsnlEsdEAqqPpeanuPQhd6S-64nFNKeGHwQxFj5BIh_01E8n-bddnt6UxGTF9XGxrGJR98wPXTAreeRj7WRMtqNDtbyM3zqvxi1DRY7HHbYEJEsTqf8gr5vMDtj38")',
              }}
            ></div>
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl md:text-4xl font-bold text-white">Our Ethos</h1>
              <p className="text-white/80 text-base">
                Black Unknown is built on a foundation of craftsmanship, minimalism, and timeless style. We create pieces that are both bold and understated, designed for the discerning individual.
              </p>
              <p className="text-white/80 text-base mt-2">
                Every piece is meticulously crafted from the finest materials, ensuring longevity and an impeccable finish that speaks to our commitment to excellence and the art of subtlety.
              </p>
            </div>
          </div>
        </section>

        {/* New Arrivals Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white">New Arrivals</h2>
              <div className="flex gap-2">
                <button className="p-2 rounded-full border border-white/20 text-white/80 hover:bg-white/10 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="p-2 rounded-full border border-white/20 text-white/80 hover:bg-white/10 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;