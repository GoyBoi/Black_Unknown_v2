// app/admin/sessions/page.tsx
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SessionReplayInterface from '@/components/SessionReplayInterface';

const SessionAdminPage = () => {
  // In a real implementation, this would come from URL params or a session list
  const sessionId = 'session_12345'; // Placeholder session ID

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Session Administration</h1>
          <p className="text-foreground/80">Replay and analyze user sessions</p>
        </div>

        <SessionReplayInterface sessionId={sessionId} />
      </main>

      <Footer />
    </div>
  );
};

export default SessionAdminPage;