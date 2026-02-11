// components/SessionRecorder.tsx
'use client';

import { useEffect, useState } from 'react';
import { startSessionRecording, initSessionRecording } from '@/lib/session-recording';

interface SessionRecorderProps {
  userId?: string;
  enabled?: boolean;
}

const SessionRecorder = ({ userId, enabled = true }: SessionRecorderProps) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [recordingEnabled, setRecordingEnabled] = useState(enabled);

  useEffect(() => {
    if (!enabled) return;

    // Start a new session recording
    const newSessionId = startSessionRecording(userId);
    setSessionId(newSessionId);

    // Initialize session recording listeners
    initSessionRecording(newSessionId, userId);

    // Cleanup function to stop recording when component unmounts
    return () => {
      // In a real implementation, we would stop the session here
      console.log(`Session ${newSessionId} ended`);
    };
  }, [enabled, userId]);

  // Function to toggle recording
  const toggleRecording = () => {
    setRecordingEnabled(!recordingEnabled);
  };

  // Don't render anything - this component is for side effects only
  return null;
};

export default SessionRecorder;