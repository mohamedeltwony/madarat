import React from 'react';
import { 
  BorderButton, 
  GoldenButton, 
  PureButton, 
  IsolatedButton, 
  CSSFreeButton,
  SVGButton,
  SVGDropdownButton,
  CanvasButton,
  CanvasDropdownButton,
  IframeButton,
  IframeDropdownButton,
  FinalButton,
  FinalDropdownButton,
  ImprovedButton,
  ImprovedDropdownButton,
  UltimateButton,
  UltimateDropdownButton,
  IsolatedGoldButton,
  IsolatedGoldDropdownButton,
  GoldLinkButton,
  GoldLinkDropdownButton
} from './index';

const ButtonTest = () => {
  return (
    <div style={{ 
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      gap: '30px',
      alignItems: 'center',
      background: 'linear-gradient(to bottom, #222, #111)',
      borderRadius: '10px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h2 style={{ color: 'white', marginBottom: '20px' }}>Button Test Component</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: 'white', marginBottom: '10px' }}>BorderButton:</h3>
        <BorderButton text="زر مع حدود ذهبية" />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: 'white', marginBottom: '10px' }}>GoldenButton:</h3>
        <GoldenButton text="زر ذهبي جديد" />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: 'white', marginBottom: '10px' }}>PureButton:</h3>
        <PureButton onClick={() => alert('Pure Button Clicked!')}>
          زر نقي بدون تنسيقات خارجية
        </PureButton>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: 'white', marginBottom: '10px' }}>IsolatedButton:</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
          <IsolatedButton text="زر معزول تماماً" />
          <IsolatedButton text="زر كنترول فقط" onClick={() => alert('Isolated Button Clicked!')} />
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: 'white', marginBottom: '10px' }}>CSSFreeButton (DIV elements only):</h3>
        <CSSFreeButton text="زر بدون عناصر Button" onClick={() => alert('CSS Free Button Clicked!')} />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: 'white', marginBottom: '10px' }}>SVG Buttons (Completely isolated):</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
          <SVGButton text="زر بتقنية SVG" onClick={() => alert('SVG Button Clicked!')} />
          <SVGDropdownButton text="زر SVG مع قائمة منسدلة" />
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: 'white', marginBottom: '10px' }}>Canvas Buttons (Ultimate isolation):</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
          <CanvasButton text="زر بتقنية Canvas" onClick={() => alert('Canvas Button Clicked!')} />
          <CanvasDropdownButton text="زر Canvas مع قائمة منسدلة" />
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: 'white', marginBottom: '10px' }}>Iframe Buttons (Total Isolation):</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
          <IframeButton text="زر بتقنية Iframe" onClick={() => alert('Iframe Button Clicked!')} />
          <IframeDropdownButton text="زر Iframe مع قائمة منسدلة" />
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: 'white', marginBottom: '10px' }}>Final Buttons:</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
          <FinalButton text="زر نهائي" onClick={() => alert('Final Button Clicked!')} />
          <FinalDropdownButton text="زر نهائي منسدل" />
        </div>
      </div>
      
      <div style={{ marginBottom: '20px', marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px' }}>
        <h3 style={{ color: '#ffd700', marginBottom: '20px', fontSize: '1.5rem' }}>✨ Improved Buttons (2023) ✨</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
          <ImprovedButton text="زر ذهبي محسن" onClick={() => alert('Improved Button Clicked!')} />
          <ImprovedDropdownButton text="زر ذهبي منسدل محسن" />
        </div>
      </div>
      
      <div style={{ marginBottom: '20px', marginTop: '30px', borderTop: '2px solid #ffd700', paddingTop: '30px' }}>
        <h3 style={{ color: '#ffd700', marginBottom: '20px', fontSize: '1.5rem' }}>🏆 Ultimate Buttons (2023) 🏆</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
          <UltimateButton text="زر ذهبي نهائي" onClick={() => alert('Ultimate Button Clicked!')} />
          <UltimateDropdownButton text="زر منسدل نهائي" />
        </div>
      </div>
      
      <div style={{ marginBottom: '20px', marginTop: '30px', borderTop: '2px solid #ffd700', paddingTop: '30px' }}>
        <h3 style={{ color: '#ffd700', marginBottom: '20px', fontSize: '1.5rem' }}>💯 Isolated Gold Buttons (2023) 💯</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
          <IsolatedGoldButton text="زر ذهبي معزول" onClick={() => alert('Isolated Gold Button Clicked!')} />
          <IsolatedGoldDropdownButton text="زر ذهبي منسدل معزول" />
        </div>
      </div>
      
      <div style={{ marginBottom: '20px', marginTop: '30px', borderTop: '2px solid #ffd700', paddingTop: '30px' }}>
        <h3 style={{ color: '#ffd700', marginBottom: '20px', fontSize: '1.5rem' }}>🔗 Gold Link Buttons (2023) 🔗</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
          <GoldLinkButton text="رابط ذهبي" href="#" />
          <GoldLinkDropdownButton text="روابط منسدلة" />
        </div>
      </div>
    </div>
  );
};

export default ButtonTest; 