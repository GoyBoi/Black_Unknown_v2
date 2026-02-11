// app/admin/bundle-optimization/page.tsx
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BundleOptimizationAdvisor from '@/components/BundleOptimizationAdvisor';

const BundleOptimizationPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Bundle Optimization</h1>
          <p className="text-foreground/80">Analyze and optimize your application bundle size</p>
        </div>

        <BundleOptimizationAdvisor />
      </main>

      <Footer />
    </div>
  );
};

export default BundleOptimizationPage;