"use client";

import React from 'react';
import PageLayout from '../../components/PageLayout';
import { motion } from 'framer-motion';
import { Share2, Gift, Users, Trophy, Copy, Check } from 'lucide-react';

const rewards = [
  {
    icon: Gift,
    title: "$50 Credit",
    description: "Get $50 in credit for each friend who joins and makes their first purchase."
  },
  {
    icon: Users,
    title: "Friend Discount",
    description: "Your friends get $25 off their first purchase when they sign up using your link."
  },
  {
    icon: Trophy,
    title: "Bonus Rewards",
    description: "Earn extra rewards when you reach referral milestones (5, 10, 20 friends)."
  }
];

const milestones = [
  {
    count: 5,
    reward: "$100 Bonus",
    description: "Refer 5 friends and get an additional $100 bonus"
  },
  {
    count: 10,
    reward: "$250 Bonus",
    description: "Refer 10 friends and get an additional $250 bonus"
  },
  {
    count: 20,
    reward: "$500 Bonus",
    description: "Refer 20 friends and get an additional $500 bonus"
  }
];

const InvitePage = () => {
  const [copied, setCopied] = React.useState(false);
  const referralLink = "https://cardealerapp.com/ref/USER123";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaEmail = () => {
    const subject = "Join Car Dealer App - Get $25 Off Your First Purchase";
    const body = `Hey! I thought you might be interested in Car Dealer App. Use my referral link to get $25 off your first purchase: ${referralLink}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <PageLayout pageKey="invite">
      <div className="space-y-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-block p-3 bg-blue-100 rounded-2xl mb-6">
            <Share2 size={32} className="text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Share the Love, Earn Rewards
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Invite your friends to Car Dealer App and earn rewards for every successful referral.
            Plus, your friends get a special discount on their first purchase!
          </p>
        </motion.div>

        {/* Referral Link Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4">Your Referral Link</h3>
          <div className="flex gap-4">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="mt-4 flex gap-4">
            <button
              onClick={shareViaEmail}
              className="flex-1 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Share via Email
            </button>
            <button
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join Car Dealer App and get $25 off your first purchase! Use my referral link: ${referralLink}`)}`)}
              className="flex-1 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Share on Twitter
            </button>
          </div>
        </motion.div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rewards.map((reward, index) => (
            <motion.div
              key={reward.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <reward.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{reward.title}</h3>
                  <p className="text-gray-600">{reward.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <h3 className="text-2xl font-bold mb-8 text-center">Referral Milestones</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {milestones.map((milestone, index) => (
              <div key={milestone.count} className="text-center">
                <div className="text-4xl font-bold mb-2">{milestone.count}</div>
                <div className="text-xl font-semibold mb-2">{milestone.reward}</div>
                <p className="text-white/80">{milestone.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl p-8 shadow-sm"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Your Referral Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">0</div>
              <div className="text-gray-600">Friends Invited</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">$0</div>
              <div className="text-gray-600">Rewards Earned</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">0</div>
              <div className="text-gray-600">Successful Referrals</div>
            </div>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default InvitePage; 