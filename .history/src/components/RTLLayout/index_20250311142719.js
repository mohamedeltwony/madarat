import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ExitPopup from '@/components/LeadMagnets/ExitPopup';
import WelcomePopup from '@/components/LeadMagnets/WelcomePopup';
import ChatBot from '@/components/LeadMagnets/ChatBot';
import styles from './RTLLayout.module.scss';

export default function RTLLayout({ children, title, description, keywords }) {
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  
  // Show welcome popup after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomePopup(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Setup exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e) => {
      // Only trigger when mouse leaves through the top of the page
      if (e.clientY <= 0) {
        setShowExitPopup(true);
      }
    };
    
    // Show chatbot after 10 seconds
    const chatbotTimer = setTimeout(() => {
      setShowChatbot(true);
    }, 10000);
    
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(chatbotTimer);
    };
  }, []);
  
  const hideWelcomePopup = () => setShowWelcomePopup(false);
  const hideExitPopup = () => setShowExitPopup(false);
  const toggleChatbot = () => setShowChatbot(!showChatbot);
  
  return (
    <div className={styles.rtlLayout} dir="rtl">
      <Head>
        <title>{title || 'الصفحة الرئيسية | مدارات للتسويق الرقمي'}</title>
        <meta name="description" content={description || 'شركة مدارات للتسويق الرقمي - خدمات تسويق رقمي متكاملة'} />
        <meta name="keywords" content={keywords || 'تسويق رقمي, سوشيال ميديا, تصميم مواقع, تطوير مواقع'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header />
      
      <main className={styles.main}>
        {children}
      </main>
      
      <Footer />
      
      {showWelcomePopup && <WelcomePopup onClose={hideWelcomePopup} />}
      {showExitPopup && <ExitPopup onClose={hideExitPopup} />}
      {showChatbot && <ChatBot onToggle={toggleChatbot} isOpen={showChatbot} />}
      
      <div className={styles.chatbotToggle} onClick={toggleChatbot}>
        <span className={showChatbot ? styles.close : styles.chat}>
          {showChatbot ? '✕' : '💬'}
        </span>
      </div>
    </div>
  );
} 