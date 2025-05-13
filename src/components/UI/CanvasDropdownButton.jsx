import React from 'react';
import { FaPhoneAlt, FaUserTie, FaCommentDots } from 'react-icons/fa';
import CanvasButton from './CanvasButton';

const CanvasDropdownButton = ({ text = 'تواصل معنا' }) => {
  // Dropdown items with icons and handlers
  const dropdownItems = [
    {
      text: 'إتصل في مستشارك',
      href: 'tel:+966123456789',
      icon: <FaPhoneAlt />,
    },
    {
      text: 'للحجز سجل رقمك',
      href: '/booking',
      icon: <FaUserTie />,
    },
    {
      text: 'شكوى أو ملاحظات',
      href: '/feedback',
      icon: <FaCommentDots />,
    },
  ];

  return <CanvasButton text={text} dropdownItems={dropdownItems} />;
};

export default CanvasDropdownButton;
