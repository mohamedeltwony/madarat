import React, { useState, useEffect, useRef, useMemo } from 'react'; // Added useMemo
import styles from './LeadMagnets.module.scss';
import SparkleButton from '@/components/UI/SparkleButton';

export default function ChatBot({ isOpen, onToggle }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [formStep, setFormStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  // Wrap botMessages in useMemo to prevent it from causing useEffect re-runs
  const botMessages = useMemo(
    () => [
      'مرحباً! أنا المساعد الآلي لشركة مدارات. كيف يمكنني مساعدتك اليوم؟',
      'أنا هنا للإجابة على استفساراتك حول خدماتنا. هل ترغب في معرفة المزيد؟',
      'ممتاز! يمكننا تقديم عرض مخصص لاحتياجاتك. هل يمكنني الحصول على بعض المعلومات منك؟',
    ],
    []
  ); // Empty dependency array means this runs only once

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(botMessages[0]);
    }
    // Added missing dependencies to satisfy exhaustive-deps rule
  }, [isOpen, botMessages, messages.length]); // Keep dependencies here as effect relies on them

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addBotMessage = (text) => {
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'bot', text }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleUserInput = () => {
    if (!inputValue.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: 'user', text: inputValue }]);
    setInputValue('');

    // Determine bot response based on conversation state
    if (messages.length === 1) {
      setTimeout(() => {
        addBotMessage(botMessages[1]);
      }, 500);
    } else if (messages.length === 3) {
      setTimeout(() => {
        addBotMessage(botMessages[2]);
        setTimeout(() => {
          setShowForm(true);
        }, 1000);
      }, 500);
    } else {
      setTimeout(() => {
        addBotMessage(
          'شكراً على تواصلك! هل هناك أي شيء آخر يمكنني مساعدتك به؟'
        );
      }, 500);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleUserInput();
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (formStep === 0 && formData.name) {
      setFormStep(1);
      addBotMessage(
        `شكراً ${formData.name}! ما هو رقم هاتفك حتى نتمكن من التواصل معك؟`
      );
    } else if (formStep === 1 && formData.phone) {
      setShowForm(false);
      addBotMessage(
        `تم تسجيل بياناتك بنجاح! سيقوم أحد ممثلي خدمة العملاء بالتواصل معك قريباً على الرقم ${formData.phone}`
      );
    }
  };

  return (
    <div className={`${styles.chatbot} ${isOpen ? styles.open : ''}`}>
      <div className={styles.chatHeader}>
        <h3>محادثة مباشرة</h3>
        <button className={styles.closeChat} onClick={onToggle}>
          &times;
        </button>
      </div>

      <div className={styles.chatMessages}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${styles.message} ${message.sender === 'bot' ? styles.botMessage : styles.userMessage}`}
          >
            {message.text}
          </div>
        ))}

        {isTyping && (
          <div
            className={`${styles.message} ${styles.botMessage} ${styles.typing}`}
          >
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
          </div>
        )}

        {showForm && (
          <div
            className={`${styles.message} ${styles.botMessage} ${styles.formMessage}`}
          >
            <form onSubmit={handleFormSubmit}>
              {formStep === 0 ? (
                <div className={styles.chatFormGroup}>
                  <label>ما هو اسمك؟</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="أدخل اسمك"
                    required
                  />
                  <button type="submit" className={styles.chatFormSubmit}>
                    إرسال
                  </button>
                </div>
              ) : (
                <div className={styles.chatFormGroup}>
                  <label>رقم الهاتف</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    placeholder="أدخل رقم هاتفك"
                    required
                  />
                  <button type="submit" className={styles.chatFormSubmit}>
                    إرسال
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className={styles.chatInput}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="اكتب رسالتك هنا..."
          disabled={showForm}
        />
        <button
          onClick={handleUserInput}
          disabled={!inputValue.trim() || showForm}
        >
          <span>إرسال</span>
        </button>
      </div>
    </div>
  );
}
