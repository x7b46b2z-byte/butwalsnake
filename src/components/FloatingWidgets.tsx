'use client';

import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const FloatingWidgets: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-[60] flex flex-col items-end space-y-3 font-manrope select-none pointer-events-none">
      
      {/* Floating WhatsApp Widget */}
      <a
        href={`https://wa.me/9816482570`}
        target="_blank"
        rel="noreferrer"
        className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 hover:scale-105 active:scale-95 text-white p-3 sm:p-3.5 rounded-full shadow-2xl transition-all duration-300 border border-emerald-500 shadow-emerald-500/20 group glow-primary pointer-events-auto cursor-pointer"
        title={t('whatsappChat')}
      >
        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:rotate-6 transition-transform" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out text-sm font-bold block whitespace-nowrap">
          {t('whatsappChat')}
        </span>
      </a>

    </div>
  );
};

export default FloatingWidgets;
