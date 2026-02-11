// app/admin/bundle-monitoring/page.tsx
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BundleMonitoringDashboard from '@/components/BundleMonitoringDashboard';

const BundleMonitoringPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Bundle Monitoring</h1>
          <p className="text-foreground/80">Monitor and optimize your application bundle size</p>
        </div>

        <BundleMonitoringDashboard />
      </main>

      <Footer />
    </div>
  );
};

export default BundleMonitoringPage;