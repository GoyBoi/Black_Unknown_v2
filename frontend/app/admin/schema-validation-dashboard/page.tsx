// app/admin/schema-validation-dashboard/page.tsx
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SchemaValidationDashboard from '@/components/SchemaValidationDashboard';

const SchemaValidationDashboardPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Schema Validation Dashboard</h1>
          <p className="text-foreground/80">Monitor and validate structured data compliance across your site</p>
        </div>

        <SchemaValidationDashboard />
      </main>

      <Footer />
    </div>
  );
};

export default SchemaValidationDashboardPage;