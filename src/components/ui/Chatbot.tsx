import React, { useState, useRef } from 'react';

const FAQ = [
  { q: 'What is your return policy?', a: 'You can return any item within 30 days of purchase.' },
  { q: 'How long does shipping take?', a: 'Shipping usually takes 3-7 business days.' },
  { q: 'Do you ship internationally?', a: 'Yes, we ship to most countries worldwide.' },
  { q: 'How can I track my order?', a: 'Once shipped, you will receive a tracking link via email.' },
  { q: 'Can I change my order?', a: 'Yes, contact support within 24 hours to change your order.' },
];

function getAnswer(question: string) {
  const q = question.toLowerCase();
  const match = FAQ.find(f => q.includes(f.q.toLowerCase().split(' ')[0]));
  if (match) return match.a;
  return "Sorry, I don't know the answer to that. Please contact support.";
}

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{from: 'user'|'bot', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Voice input setup
  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    if (!recognitionRef.current) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setListening(false);
      };
      recognition.onerror = () => setListening(false);
      recognitionRef.current = recognition;
    }
    setListening(true);
    recognitionRef.current.start();
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, {from: 'user', text: input}]);
    setTimeout(() => {
      setMessages(msgs => [...msgs, {from: 'bot', text: getAnswer(input)}]);
    }, 500);
    setInput('');
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 72, // raised for upward dropdown
      right: 24,
      width: 340,
      background: '#fff',
      border: '1px solid var(--accent)',
      borderRadius: 'var(--border-radius)',
      boxShadow: '0 8px 24px #ff690033',
      zIndex: 1000,
      transition: 'all var(--transition)',
      display: 'flex',
      flexDirection: 'column',
      maxHeight: 500,
      overflow: 'hidden'
    }}
    className="chatbot"
    >
      <div style={{
        padding: 16,
        borderBottom: '1px solid #ffe2cc',
        fontWeight: 'bold',
        background: 'var(--accent)',
        color: '#fff',
        borderTopLeftRadius: 'var(--border-radius)',
        borderTopRightRadius: 'var(--border-radius)',
        letterSpacing: 1.2,
        fontSize: 18,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>The Raw Era</span>
        <button
          onClick={() => {
            const chatbotElement = document.querySelector('.chatbot') as HTMLElement;
            if (chatbotElement) chatbotElement.style.display = 'none';
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            fontSize: 24,
            padding: 0,
            width: 30,
            height: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Close chatbot"
        >
          ×
        </button>
      </div>
      <div style={{
        padding: 16,
        height: 240,
        overflowY: 'auto',
        background: '#fff8f3',
        transition: 'background var(--transition)'
      }}>
        {messages.length === 0 && <div style={{color: '#888'}}>Ask me something!</div>}
        {messages.map((msg, i) => (
          <div key={i} style={{
            margin: '8px 0',
            textAlign: msg.from === 'user' ? 'right' : 'left'
          }}>
            <span style={{
              display: 'inline-block',
              padding: '8px 14px',
              borderRadius: 20,
              background: msg.from === 'user' ? 'var(--accent)' : '#fff',
              color: msg.from === 'user' ? '#fff' : 'var(--foreground)',
              boxShadow: msg.from === 'user' ? '0 2px 8px #ff690033' : '0 1px 2px #0001',
              transition: 'all var(--transition)'
            }}>{msg.text}</span>
          </div>
        ))}
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        borderTop: '1px solid #ffe2cc',
        background: '#fff',
        padding: 12
      }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type your question..."
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 20,
            border: '1px solid #ffd1a6',
            outline: 'none',
            marginRight: 8,
            transition: 'all var(--transition)'
          }}
        />
        <button
          onClick={handleSend}
          style={{
            background: 'var(--accent)',
            color: '#fff',
            border: 'none',
            borderRadius: 20,
            padding: '8px 16px',
            fontWeight: 600,
            marginRight: 8,
            cursor: 'pointer',
            transition: 'all var(--transition)'
          }}
        >
          Send
        </button>
        <button
          onClick={handleMicClick}
          style={{
            background: listening ? '#ff8800' : '#fff',
            color: listening ? '#fff' : 'var(--accent)',
            border: '1.5px solid var(--accent)',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all var(--transition)'
          }}
          aria-label="Voice input"
        >
          <span role="img" aria-label="mic">🎤</span>
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
