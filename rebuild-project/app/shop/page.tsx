import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

const ShopPage = () => {
  // Sample product data
  const products = [
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
    {
      id: 8,
      name: 'Velvet Evening Gown',
      price: 1650,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      brand: 'Amogela Innovations',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Shop Collection</h1>
          <div className="flex items-center gap-4">
            <select className="bg-background border border-white/20 rounded-lg text-white px-4 py-2">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ShopPage;