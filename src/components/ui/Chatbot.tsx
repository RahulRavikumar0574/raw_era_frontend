import React, { useState, useRef, useEffect } from 'react';
import { MicrophoneIcon, CameraIcon, MinusIcon, ChatBubbleBottomCenterIcon } from '@heroicons/react/24/outline';

interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
  timestamp: string;
  imageData?: string;
  imageType?: string;
}

const QUICK_REPLIES = [
  'What sizes are available?',
  'How long does shipping take?',
  'What is your return policy?',
  'Do you offer custom printing?',
  'How can I track my order?',
];

const STORAGE_KEY = 'chatbot_history';
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4001';

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<{ data: string; type: string } | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load chat history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed);
      } catch (e) {
        console.error('Failed to load chat history', e);
      }
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Please upload a JPG, PNG, or WEBP image.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = (event.target?.result as string).split(',')[1];
      setSelectedImage({ data: base64, type: file.type });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = async (quickReply?: string) => {
  const messageText = quickReply || input.trim();
  if (!messageText && !selectedImage) return;

  const newMessage: ChatMessage = {
    from: "user",
    text: messageText,
    timestamp: new Date().toISOString(),
    imageData: selectedImage?.data,
    imageType: selectedImage?.type,
  };

  setMessages((prev) => [...prev, newMessage]);
  setInput("");
  setSelectedImage(null);
  setIsLoading(true);

  try {
    const apiMessages = [...messages.slice(-9), newMessage].map((m) => ({
      role: m.from === "user" ? "user" : "assistant",
      content: m.text,
      imageData: m.imageData,
      imageType: m.imageType,
    }));

    console.log("Sending request:", {
      messages: apiMessages,
      sessionId,
    });

    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: apiMessages,
        sessionId,
      }),
    });

    console.log("Status:", response.status);

    const raw = await response.text();
    console.log("Raw response:", raw);

    let data;

    try {
      data = JSON.parse(raw);
    } catch (err) {
      throw new Error(`Backend did not return JSON.\n${raw}`);
    }

    console.log("Parsed response:", data);

    if (!response.ok) {
      throw new Error(
        data.message ||
          data.error ||
          `Backend returned ${response.status}`
      );
    }

    setSessionId(data.sessionId || "");

    setMessages((prev) => [
      ...prev,
      {
        from: "bot",
        text: data.message || "No message returned",
        timestamp: new Date().toISOString(),
      },
    ]);
  } catch (err: any) {
    console.error("Chat error:", err);

    setMessages((prev) => [
      ...prev,
      {
        from: "bot",
        text: `❌ ${err.message}`,
        timestamp: new Date().toISOString(),
      },
    ]);
  } finally {
    setIsLoading(false);
  }
};

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <>
      {/* Minimized floating button */}
      {isMinimized && (
        <button
          onClick={() => setIsMinimized(false)}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 60,
            height: 60,
            background: 'var(--accent)',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            boxShadow: '0 8px 24px #ff690033',
            cursor: 'pointer',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all var(--transition)'
          }}
          aria-label="Open chatbot"
        >
          <ChatBubbleBottomCenterIcon style={{ width: 28, height: 28 }} />
        </button>
      )}

      {/* Main chatbot */}
      {!isMinimized && (
        <div style={{
          position: 'fixed',
          bottom: 72,
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
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setIsMinimized(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: 20,
                  padding: 0,
                  width: 30,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label="Minimize chatbot"
              >
                <MinusIcon style={{ width: 20, height: 20 }} />
              </button>
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
          </div>
      <div style={{
        padding: 16,
        height: 240,
        overflowY: 'auto',
        background: '#fff8f3',
        transition: 'background var(--transition)'
      }}>
        {messages.length === 0 && (
          <div style={{color: '#888'}}>
            <div style={{marginBottom: 12}}>Ask me something!</div>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 6}}>
              {QUICK_REPLIES.slice(0, 3).map((reply) => (
                <button
                  key={reply}
                  onClick={() => handleSend(reply)}
                  style={{
                    background: '#fff',
                    border: '1px solid #ffd1a6',
                    borderRadius: 16,
                    padding: '6px 12px',
                    fontSize: 12,
                    color: 'var(--foreground)',
                    cursor: 'pointer',
                    transition: 'all var(--transition)'
                  }}
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{
            margin: '8px 0',
            textAlign: msg.from === 'user' ? 'right' : 'left'
          }}>
            <div style={{
              display: 'inline-block',
              maxWidth: '80%'
            }}>
              {msg.imageData && (
                <img
                  src={`data:${msg.imageType};base64,${msg.imageData}`}
                  alt="Uploaded"
                  style={{
                    maxWidth: '100%',
                    borderRadius: 8,
                    marginBottom: 4,
                    maxHeight: 150,
                    objectFit: 'contain'
                  }}
                />
              )}
              <span style={{
                display: 'inline-block',
                padding: '8px 14px',
                borderRadius: 20,
                background: msg.from === 'user' ? 'var(--accent)' : '#fff',
                color: msg.from === 'user' ? '#fff' : 'var(--foreground)',
                boxShadow: msg.from === 'user' ? '0 2px 8px #ff690033' : '0 1px 2px #0001',
                transition: 'all var(--transition)'
              }}>{msg.text}</span>
              <div style={{
                fontSize: 10,
                color: '#999',
                marginTop: 2,
                textAlign: msg.from === 'user' ? 'right' : 'left'
              }}>
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{
            margin: '8px 0',
            textAlign: 'left'
          }}>
            <span style={{
              display: 'inline-block',
              padding: '8px 14px',
              borderRadius: 20,
              background: '#fff',
              color: 'var(--foreground)',
              boxShadow: '0 1px 2px #0001'
            }}>
              <span style={{display: 'inline-block', animation: 'blink 1s infinite'}}>
                ●●●
              </span>
            </span>
          </div>
        )}
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        borderTop: '1px solid #ffe2cc',
        background: '#fff',
        padding: 12
      }}>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageUpload}
          style={{display: 'none'}}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            background: selectedImage ? 'var(--accent)' : '#fff',
            color: selectedImage ? '#fff' : 'var(--accent)',
            border: '1.5px solid var(--accent)',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginRight: 8,
            transition: 'all var(--transition)'
          }}
          aria-label="Upload image"
        >
          <CameraIcon style={{ width: 18, height: 18 }} />
        </button>
        {selectedImage && (
          <div style={{
            position: 'relative',
            marginRight: 8
          }}>
            <img
              src={`data:${selectedImage.type};base64,${selectedImage.data}`}
              alt="Selected"
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                objectFit: 'cover'
              }}
            />
            <button
              onClick={removeImage}
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
                background: 'red',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: 16,
                height: 16,
                fontSize: 10,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>
        )}
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type your question..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 20,
            border: '1px solid #ffd1a6',
            outline: 'none',
            marginRight: 8,
            transition: 'all var(--transition)',
            opacity: isLoading ? 0.5 : 1
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={isLoading || (!input.trim() && !selectedImage)}
          style={{
            background: 'var(--accent)',
            color: '#fff',
            border: 'none',
            borderRadius: 20,
            padding: '8px 16px',
            fontWeight: 600,
            marginRight: 8,
            cursor: isLoading || (!input.trim() && !selectedImage) ? 'not-allowed' : 'pointer',
            transition: 'all var(--transition)',
            opacity: isLoading || (!input.trim() && !selectedImage) ? 0.5 : 1
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
          <MicrophoneIcon style={{ width: 18, height: 18 }} />
        </button>
      </div>
      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
      )}
    </>
  );
};

export default Chatbot;
