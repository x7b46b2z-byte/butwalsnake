'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ne';

type TranslationDict = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: TranslationDict = {
  en: {
    // Navigation
    home: 'Home',
    emergency: 'Emergency Rescue',
    snakes: 'Snake DB & AI',
    firstAid: 'First Aid',
    blogs: 'Stories & News',
    volunteer: 'Volunteer',
    donate: 'Donate',
    contact: 'Contact',
    admin: 'Admin Login',
    dashboard: 'Dashboard',
    
    // Status Badge
    avail24h: '24 Hours Available',
    emergencyCall: 'Emergency Call',
    whatsappChat: 'WhatsApp Support',
    
    // Hero Section
    heroTitle: '24/7 Snake Rescue Service in Butwal & Rupandehi',
    heroSub: 'Protecting People, Conserving Wildlife Through Safe Rescue & Awareness.',
    ctaEmergency: 'Request Rescue',
    ctaCall: 'Call Now',
    ctaVolunteer: 'Volunteer With Us',
    ctaIdentify: 'Identify Snake',
    
    // Rescuer Availability
    rescuerTitle: 'Live Rescuer Availability',
    available: 'Available Now',
    busy: 'On Call',
    offline: 'Offline',
    responseTime: 'Est. Response Time: 15-30 Mins',
    
    // Quick Contacts
    tel1: '9816482570',
    tel2: '9867501942',
    nepalTime: 'Local Time (Nepal)',

    // Contact Page
    contactTitle: 'Contact Us',
    contactSub: 'For emergencies, call directly. For general queries, use the form below.',
    getInTouch: 'GET IN TOUCH',
    sendMessage: 'Send Us a Message',
    yourName: 'Your Name *',
    phone: 'Phone',
    email: 'Email',
    subject: 'Subject',
    message: 'Message *',
    sendBtn: 'Send Message',
    sending: 'Sending...',
    messageSent: 'Message Sent!',

    // Footer
    coverageAreas: 'Coverage Areas',
    usefulInfo: 'Useful Information',
    hotlineContacts: '24/7 Hotline Contacts',
    designedBy: 'Designed by semicolon victims ;',
  },
  ne: {
    // Navigation
    home: 'गृहपृष्ठ',
    emergency: 'आपतकालीन उद्धार',
    snakes: 'सर्प निर्देशिका र AI',
    firstAid: 'प्राथमिक उपचार',
    blogs: 'ब्लग र समाचार',
    volunteer: 'स्वयंसेवक',
    donate: 'सहयोग',
    contact: 'सम्पर्क',
    admin: 'प्रशासक लगइन',
    dashboard: 'ड्यासबोर्ड',
    
    // Status Badge
    avail24h: '२४ घण्टा उपलब्ध',
    emergencyCall: 'आपतकालीन कल',
    whatsappChat: 'व्हाट्सएप सहायता',
    
    // Hero Section
    heroTitle: 'बुटवल र रुपन्देहीमा २४/७ सर्प उद्धार सेवा',
    heroSub: 'सुरक्षित उद्धार र सचेतना मार्फत मानिसको रक्षा र वन्यजन्तुको संरक्षण।',
    ctaEmergency: 'उद्धारको अनुरोध',
    ctaCall: 'अहिले कल गर्नुहोस्',
    ctaVolunteer: 'स्वयंसेवक बन्नुहोस्',
    ctaIdentify: 'सर्प पहिचान',
    
    // Rescuer Availability
    rescuerTitle: 'उद्धारकर्ता उपलब्धता',
    available: 'उपलब्ध हुनुहुन्छ',
    busy: 'उद्धारमा व्यस्त',
    offline: 'अफलाइन',
    responseTime: 'अनुमानित समय: १५-३० मिनेट',
    
    // Quick Contacts
    tel1: '९८१६४८२५७०',
    tel2: '९८६७५०१९४२',
    nepalTime: 'स्थानीय समय (नेपाल)',

    // Contact Page
    contactTitle: 'सम्पर्क गर्नुहोस्',
    contactSub: 'आपतकालिन अवस्थामा सीधै कल गर्नुहोस्। सामान्य सोधपुछको लागि तलको फारम प्रयोग गर्नुहोस्।',
    getInTouch: 'सम्पर्कमा रहनुहोस्',
    sendMessage: 'हामीलाई सन्देश पठाउनुहोस्',
    yourName: 'तपाईंको नाम *',
    phone: 'फोन',
    email: 'इमेल',
    subject: 'विषय',
    message: 'सन्देश *',
    sendBtn: 'सन्देश पठाउनुहोस्',
    sending: 'पठाउँदै...',
    messageSent: 'सन्देश पठाइयो!',

    // Footer
    coverageAreas: 'कभरेज क्षेत्रहरू',
    usefulInfo: 'उपयोगी जानकारी',
    hotlineContacts: '२४/७ हटलाइन सम्पर्क',
    designedBy: 'डिजाइन द्वारा सेमीकोलन पिडित ;',
  }
};

type AppContextType = {
  lang: Language;
  toggleLang: () => void;
  t: (key: string) => string;
  isEmergencyBannerOpen: boolean;
  setEmergencyBannerOpen: (val: boolean) => void;
  activeRescuers: any[];
  volunteers: any[];
  volunteersLoading: boolean;
  fetchActiveRescuers: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('en');
  const [isEmergencyBannerOpen, setEmergencyBannerOpen] = useState(true);
  const [activeRescuers, setActiveRescuers] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [volunteersLoading, setVolunteersLoading] = useState(false);
  const [hasFetchedRescuers, setHasFetchedRescuers] = useState(false);

  // Load language preference if set
  useEffect(() => {
    const savedLang = localStorage.getItem('bsr_lang') as Language;
    if (savedLang === 'en' || savedLang === 'ne') {
      setLang(savedLang);
    }
  }, []);

  const fetchActiveRescuers = () => {
    if (hasFetchedRescuers) return;
    setVolunteersLoading(true);
    fetch('/api/volunteer?status=APPROVED')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setVolunteers(data.data || []);
          const mapped = (data.data || []).map((v: any) => ({
            name: v.name,
            status: v.isAvailableNow ? 'available' : 'busy',
            zone: v.assignedZone || v.municipality,
            experience: v.experience,
            imageUrl: v.imageUrl,
            description: v.description,
          }));
          setActiveRescuers(mapped);
          setHasFetchedRescuers(true);
        }
      })
      .catch(err => console.error('Failed to fetch rescuers:', err))
      .finally(() => setVolunteersLoading(false));
  };

  useEffect(() => {
    fetchActiveRescuers();
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'ne' : 'en';
    setLang(newLang);
    localStorage.setItem('bsr_lang', newLang);
  };

  const t = (key: string): string => {
    return translations[lang][key] || translations['en'][key] || key;
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        toggleLang,
        t,
        isEmergencyBannerOpen,
        setEmergencyBannerOpen,
        activeRescuers,
        volunteers,
        volunteersLoading,
        fetchActiveRescuers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
