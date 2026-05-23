'use client';

import { motion } from 'framer-motion';
import { Heart, QrCode, Copy, CheckCircle, ExternalLink, Smartphone } from 'lucide-react';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWidgets from '@/components/FloatingWidgets';

const PAYMENT_METHODS = [
  {
    id: 'esewa',
    name: 'eSewa',
    color: 'green',
    emoji: '💚',
    number: '9856034050',
    name_on_account: 'Butwal Snake Rescuers',
    instructions: [
      'Open the eSewa app on your phone',
      'Tap "Send Money" → "To eSewa ID"',
      'Enter ID: 9856034050',
      'Enter amount and add note "Donation"',
      'Confirm and send',
    ],
  },
  {
    id: 'khalti',
    name: 'Khalti',
    color: 'purple',
    emoji: '💜',
    number: '9856034050',
    name_on_account: 'Butwal Snake Rescuers',
    instructions: [
      'Open the Khalti app on your phone',
      'Tap "Transfer" → "Send Money"',
      'Enter Khalti ID: 9856034050',
      'Enter the donation amount',
      'Add purpose: "Wildlife Rescue Donation" and confirm',
    ],
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    color: 'blue',
    emoji: '🏦',
    number: 'NIC Asia Bank',
    name_on_account: 'Butwal Snake Rescuers Society',
    instructions: [
      'Bank: NIC Asia Bank, Butwal Branch',
      'Account Name: Butwal Snake Rescuers Society',
      'Account Number: 3210087654300015',
      'Use "Wildlife Donation" as the transfer note',
      'Send transfer receipt to our WhatsApp: 9856034050',
    ],
  },
];

const IMPACT = [
  { amount: 'Rs. 500', impact: 'Funds one rescue mission fuel & equipment', emoji: '🔦' },
  { amount: 'Rs. 1,500', impact: 'Provides snake-handling gloves for a volunteer', emoji: '🧤' },
  { amount: 'Rs. 5,000', impact: 'Covers full rescue kit & medical supplies', emoji: '🎒' },
  { amount: 'Rs. 15,000', impact: 'Sponsors a volunteer training session for 5 people', emoji: '🏫' },
];

export default function DonatePage() {
  const [active, setActive] = useState('esewa');
  const [copied, setCopied] = useState('');

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  const method = PAYMENT_METHODS.find(m => m.id === active)!;

  return (
    <div className="min-h-screen bg-[#0f1a1c]">
      <Navbar />

      {/* Hero */}
      <div className="py-20 px-4 text-center border-b border-white/5 bg-gradient-to-b from-red-900/10 to-transparent">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/40">
            <Heart className="w-8 h-8 text-red-400" />
          </motion.div>
          <h1 className="text-5xl font-bold text-white mb-4">Support Our Mission</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Your donation funds rescue equipment, volunteer training, and wildlife education in Rupandehi District.
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* Impact */}
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Your Donation Impact</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {IMPACT.map(({ amount, impact, emoji }, i) => (
            <motion.div key={amount} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-5 text-center border border-white/10 hover:border-emerald-500/30 transition-colors">
              <p className="text-4xl mb-3">{emoji}</p>
              <p className="text-emerald-400 font-bold text-lg mb-2">{amount}</p>
              <p className="text-gray-400 text-xs leading-relaxed">{impact}</p>
            </motion.div>
          ))}
        </div>

        {/* Payment Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Method Tabs */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-2xl font-bold text-white mb-4">Choose Payment Method</h2>
            {PAYMENT_METHODS.map(m => (
              <button key={m.id} onClick={() => setActive(m.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${active === m.id ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                <span className="text-3xl">{m.emoji}</span>
                <div>
                  <p className={`font-bold ${active === m.id ? 'text-emerald-400' : 'text-white'}`}>{m.name}</p>
                  <p className="text-gray-500 text-xs">{m.number}</p>
                </div>
                {active === m.id && <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400" />}
              </button>
            ))}
          </div>

          {/* Instructions */}
          <div className="lg:col-span-3">
            <motion.div key={active} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-3xl p-7 border border-white/10 h-full">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">{method.emoji}</span>
                <div>
                  <h3 className="text-white font-bold text-xl">Donate via {method.name}</h3>
                  <p className="text-gray-400 text-sm">{method.name_on_account}</p>
                </div>
              </div>

              {/* Account number copy */}
              <div className="bg-black/30 rounded-xl p-4 mb-6 flex items-center gap-3 border border-white/10">
                <div className="flex-1">
                  <p className="text-gray-400 text-xs mb-1">{method.id === 'bank' ? 'Bank' : 'Account ID'}</p>
                  <p className="text-white font-mono font-bold text-lg">{method.number}</p>
                </div>
                <button onClick={() => copyText(method.number, 'number')} className="p-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 hover:bg-emerald-500/30 transition-colors">
                  {copied === 'number' ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {method.instructions.map((step, i) => (
                  <motion.div key={i} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3 bg-white/5 rounded-xl p-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-gray-300 text-sm leading-relaxed">{step}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-sm text-yellow-300">
                <p className="font-semibold mb-1">After donating:</p>
                <p className="text-yellow-300/80">Please send a screenshot of your transaction to our <a href="https://wa.me/9779856034050" className="underline hover:text-yellow-200 transition-colors">WhatsApp: 9856034050</a> so we can send you a thank-you message and receipt.</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Thank you */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="mt-14 glass-card rounded-2xl p-8 border border-emerald-500/20 text-center">
          <p className="text-4xl mb-3">🙏</p>
          <h3 className="text-white font-bold text-2xl mb-2">Thank You for Your Support</h3>
          <p className="text-gray-400 max-w-lg mx-auto text-sm leading-relaxed">
            Every donation — no matter the size — directly supports snake rescue operations, wildlife education, and community awareness across Rupandehi District. You are a hero to both humans and wildlife.
          </p>
        </motion.div>
      </div>
      <Footer />
      <FloatingWidgets />
    </div>
  );
}
