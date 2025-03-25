import { useState, useRef, useEffect } from 'react';
import styles from './Chatbot.module.scss';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newMessages = [
      ...messages,
      { type: 'user', content: userInput },
      { type: 'bot', content: 'شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.' },
    ];
    
    setMessages(newMessages);
    setUserInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className={styles.chatbotContainer}>
      <button
        className={styles.chatbotToggle}
        onClick={toggleChat}
      >
        {isOpen ? '×' : 'دردشة'}
      </button>

      {isOpen && (
        <div className={styles.chatbotWindow}>
          <div className={styles.chatHeader}>
            <h3>المساعد الافتراضي</h3>
          </div>

          <div className={styles.messagesContainer}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${styles.message} ${
                  message.type === 'user' ? styles.userMessage : styles.botMessage
                }`}
              >
                {message.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className={styles.inputForm}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اكتب رسالتك هنا..."
              className={styles.input}
            />
            <button type="submit" className={styles.sendButton}>
              إرسال
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
