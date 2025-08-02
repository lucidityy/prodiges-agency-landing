"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Layout, Share2 } from 'lucide-react';

const tabs = [
  { id: 'analytics', label: 'Growth Analytics', icon: Users },
  { id: 'automation', label: 'AI Automation', icon: Layout },
  { id: 'campaigns', label: 'Growth Campaigns', icon: Share2 },
];

export default function DemoArea() {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <section className="py-20 bg-white/50">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-text-dark mb-4">
            Your Growth Command Center
          </h2>
          <p className="text-xl text-text-light">
            Real-time insights and automation that drive exponential growth
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8"
        >
          <div className="flex flex-wrap gap-4 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-button transition-all ${
                  activeTab === tab.id
                    ? 'bg-button-gradient text-white shadow-lg'
                    : 'bg-gray-100 text-text-dark hover:bg-gray-200'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          
          <div className="bg-gradient-to-br from-bg-light to-bg-gradient rounded-2xl p-8 min-h-[400px]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeTab === 'analytics' && (
                <>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full"></div>
                        <div className="h-3 bg-gray-100 rounded flex-1"></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full"></div>
                        <div className="h-3 bg-gray-100 rounded flex-1"></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full"></div>
                        <div className="h-3 bg-gray-100 rounded flex-1"></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm md:col-span-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg"></div>
                  </div>
                </>
              )}
              
              {activeTab === 'automation' && (
                <div className="md:col-span-3">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-purple-200 rounded"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-40 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg"></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-20 bg-gray-100 rounded-lg"></div>
                        <div className="h-20 bg-gray-100 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'campaigns' && (
                <>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-24 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-24 bg-gradient-to-br from-pink-100 to-orange-100 rounded-lg mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}