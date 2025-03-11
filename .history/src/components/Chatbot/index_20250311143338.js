import React, { useState, useEffect, useRef } from 'react';
import { FaComment, FaPaperPlane, FaTimes } from 'react-icons/fa';
import styles from './Chatbot.module.scss';

const initialMessages = [
  {
    id: 1,
    text: 'مرحباً بك في مدارات! أنا المساعد الافتراضي وسعيد بالتحدث معك. كيف يمكنني مساعدتك اليوم؟',
    isBot: true,
  },
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('greeting'); // greeting, name, phone, email, done
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom of messages when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Show bot typing indicator, then add message
  const addBotMessage = (text) => {
    setMessages(prev => [...prev, { id: Date.now(), isBot: true, isTyping: true }]);
    
    setTimeout(() => {
      setMessages(prev => {
        const newMessages = [...prev];
        const typingMsgIndex = newMessages.findIndex(msg => msg.isTyping);
        
        if (typingMsgIndex !== -1) {
          newMessages[typingMsgIndex] = {
            ...newMessages[typingMsgIndex],
            text,
            isTyping: false,
          };
        }
        
        return newMessages;
      });
    }, 1000); // simulate typing time
  };
  
  // Add user message and trigger next step
  const handleSendMessage = () => {
    if (!input.trim() && step !== 'greeting') return;
    
    // Add user message
    if (input.trim()) {
      setMessages(prev => [...prev, { id: Date.now(), text: input, isBot: false }]);
    }
    
    // Handle different conversation steps
    switch (step) {
      case 'greeting':
        setStep('name');
        addBotMessage('يسعدني التحدث معك! ما هو اسمك الكريم؟');
        break;
        
      case 'name':
        setName(input);
        setStep('phone');
        addBotMessage(`شكراً ${input}! هل يمكنك مشاركة رقم هاتفك للتواصل؟`);
        break;
        
      case 'phone':
        setPhone(input);
        setStep('email');
        addBotMessage('ممتاز! وماهو بريدك الإلكتروني؟');
        break;
        
      case 'email':
        setEmail(input);
        setStep('done');
        addBotMessage(`شكراً جزيلاً! سيقوم فريقنا بالتواصل معك قريباً على الرقم ${phone}. هل لديك أي استفسارات أخرى؟`);
        break;
        
      case 'done':
        addBotMessage('سعدت بالتحدث معك! إذا كان لديك أي استفسارات أخرى، فلا تتردد في السؤال.');
        break;
        
      default:
        break;
    }
    
    setInput('');
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };
  
  // Render bot typing indicator
  const renderTypingIndicator = () => (
    <div className={styles.typingIndicator}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
  
  return (
    <div className={styles.chatbotContainer}>
      {/* Chat toggle button */}
      <button 
        className={styles.chatToggle} 
        onClick={toggleChat}
        aria-label={isOpen ? "إغلاق المحادثة" : "فتح المحادثة"}
      >
        {isOpen ? <FaTimes /> : <FaComment />}
      </button>
      
      {/* Chat window */}
      <div className={`${styles.chatWindow} ${isOpen ? styles.open : ''}`}>
        <div className={styles.chatHeader}>
          <h3>مساعد مدارات</h3>
          <button onClick={toggleChat} aria-label="إغلاق المحادثة">
            <FaTimes />
          </button>
        </div>
        
        <div className={styles.chatMessages}>
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`${styles.message} ${message.isBot ? styles.botMessage : styles.userMessage}`}
            >
              {message.isTyping ? renderTypingIndicator() : message.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className={styles.chatInput}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              step === 'name' ? 'أدخل اسمك...' :
              step === 'phone' ? 'أدخل رقم هاتفك...' :
              step === 'email' ? 'أدخل بريدك الإلكتروني...' :
              'اكتب رسالتك هنا...'
            }
            disabled={step === 'greeting'}
          />
          <button 
            onClick={handleSendMessage} 
            aria-label="إرسال"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
} 