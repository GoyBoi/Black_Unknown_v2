// app/admin/performance-alerts/page.tsx
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PerformanceAlertingDashboard from '@/components/PerformanceAlertingDashboard';

const PerformanceAlertsPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Performance Alerts</h1>
          <p className="text-foreground/80">Monitor and manage performance metric alerts</p>
        </div>

        <PerformanceAlertingDashboard />
      </main>

      <Footer />
    </div>
  );
};

export default PerformanceAlertsPage;