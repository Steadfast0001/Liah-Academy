'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

const quickChips = [
  { label: 'Requirements', query: 'What are the admission requirements?' },
  { label: 'Tuition Fees', query: 'Show me tuition fees and cost breakdown.' },
  { label: 'Degrees', query: 'What degree programs are offered?' },
  { label: 'Location', query: 'Where is the campus located in Buea?' },
  { label: 'Hostel/Housing', query: 'Is there student accommodation or hostels?' },
  { label: 'Internships', query: 'How does the corporate internship work?' }
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Hello! Welcome to Liah Academy (Buea). I'm your interactive chat assistant. How can I guide you today?"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    const query = textToSend.trim();
    if (!query) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setShowChips(false);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      
      setIsTyping(false);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.response || "I'm happy to help! You can reach our admissions team directly at info@liahacademy.com or +237 652 154 095."
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      setIsTyping(false);
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: "Thanks for reaching out! You can learn more by applying on our Admissions page or contacting us at info@liahacademy.com."
      };
      setMessages(prev => [...prev, fallbackMsg]);
    }
  };

  return (
    <>
      {/* Floating Toggle Bubble */}
      <div
        className="chat-widget-bubble"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Chat Assistant"
        role="button"
        tabIndex={0}
      >
        {isOpen ? <X size={26} /> : <MessageSquare size={26} />}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-widget-window">
          {/* Header */}
          <div className="chat-window-header">
            <div className="chat-bot-identity">
              <span className="bot-dot"></span>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: '#F8FAFC' }}>
                  Liah Assist Bot
                </h4>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>Ready to help</span>
              </div>
            </div>
            <button
              className="close-chat-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close Chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="chat-messages-area">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="chat-msg bot" style={{ display: 'flex', gap: '4px', padding: '10px 14px' }}>
                <span style={{ animation: 'pulse 1s infinite' }}>●</span>
                <span style={{ animation: 'pulse 1s infinite 0.2s' }}>●</span>
                <span style={{ animation: 'pulse 1s infinite 0.4s' }}>●</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ Chips */}
          {showChips && (
            <div className="chat-quick-replies">
              {quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  className="quick-reply-chip"
                  onClick={() => handleSendMessage(chip.query)}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          )}

          {/* Bottom Input Row */}
          <div className="chat-input-row">
            <input
              type="text"
              className="chat-text-input"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage(input);
              }}
            />
            <button
              className="chat-send-btn"
              onClick={() => handleSendMessage(input)}
              aria-label="Send Message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
