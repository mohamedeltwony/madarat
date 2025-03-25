import React, { useState, useEffect } from 'react';
import styles from './ChatBot.module.scss';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  const botMessages = [
    'مرحباً! كيف يمكنني مساعدتك اليوم؟',
    'هل تبحث عن وجهة سياحية معينة؟',
    'يمكنني مساعدتك في العثور على أفضل العروض السياحية.',
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ type: 'bot', content: botMessages[0] }]);
    }
  }, [isOpen, messages.length, botMessages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newMessage = { type: 'user', content: userInput };
    setMessages((prev) => [...prev, newMessage]);
    setUserInput('');

    // Simulate bot response
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * (botMessages.length - 1)) + 1;
      const botResponse = { type: 'bot', content: botMessages[randomIndex] };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className={styles.chatbot}>
      <button onClick={() => setIsOpen(!isOpen)} className={styles.toggleButton}>
        {isOpen ? 'إغلاق المحادثة' : 'تحدث معنا'}
      </button>

      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.messages}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${styles.message} ${
                  msg.type === 'user' ? styles.userMessage : styles.botMessage
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className={styles.inputForm}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
            />
            <button type="submit">إرسال</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
