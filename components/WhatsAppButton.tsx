'use client';

import React, { useState } from 'react';
import { WhatsAppIcon } from './SocialIcons';

export default function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false);
  const phoneNumber = '237699526607';
  const defaultMessage = 'Hello Liah Academy Admissions, I would like to inquire about programs and admission.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="whatsapp-floating-wrapper">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-floating-btn"
        aria-label="Chat on WhatsApp (+237 699 526 607)"
        title="Chat with Liah Admissions on WhatsApp"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="whatsapp-icon-inner">
          <WhatsAppIcon size={30} />
        </span>
        <span className="whatsapp-pulse-ring" />
        <span className="whatsapp-online-dot" />

        <div className={`whatsapp-tooltip ${isHovered ? 'visible' : ''}`}>
          <div className="whatsapp-tooltip-title">WhatsApp Admissions</div>
          <div className="whatsapp-tooltip-sub">Online &bull; +237 699 526 607</div>
        </div>
      </a>
    </div>
  );
}
