import dynamic from 'next/dynamic';
import React from 'react';

const Chatbot = dynamic(() => import('@/components/ui/Chatbot'), { ssr: false });

export default function ChatbotEntry() {
  return <Chatbot />;
}
