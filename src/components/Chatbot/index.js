import React, { useState, useEffect } from 'react';
import styles from './Chatbot.module.scss';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newMessage = {
      type: 'user',
      content: userInput,
    };

    setMessages((prev) => [...prev, newMessage]);
    setUserInput('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        type: 'bot',
        content: 'شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.',
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className={styles.chatbotContainer}>
      <button className={styles.chatbotToggle} onClick={toggleChat}>
        {isOpen ? 'إغلاق المحادثة' : 'تحدث معنا'}
      </button>

      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <h3>المساعد الآلي</h3>
          </div>

          <div className={styles.chatMessages}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${styles.message} ${
                  message.type === 'user'
                  ? styles.userMessage
                  : styles.botMessage
                }`}
              >
                {message.content}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className={styles.chatInput}>
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

export default Chatbot;
