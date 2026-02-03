//@ts-nocheck
'use client';

import type React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import plant from '@/images/manufactoringplant.jpg';

export const ContactHero: React.FC = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Our Plant',
      details: [
        '1/139, Shivalik Ganga Vihar, Navodya Nagar, Haridwar, Uttarakhand 249408',
      ],
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+91 9897967727', 'Mon-Fri: 10AM-8PM'],
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['pranav.c@thpl.co.in', 'helpdesk@thpl.co.in'],
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Mon-Sat: 10AM-6PM'],
    },
  ];

  return (
    <section className="relative bg-gradient-to-br from-[var(--lightest)] to-white py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-[var(--medium)] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-[var(--light)] rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight"
            >
              Get In{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--medium)] to-[var(--dark)]">
                Touch
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-gray-600 leading-relaxed"
            >
              Have questions about our products or need expert advice for your
              aquarium? We're here to help! Reach out to our friendly team of
              aquatic specialists.
            </motion.p>

            {/* Contact Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8"
            >
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[var(--lightest)] rounded-full flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-5 w-5 text-[var(--medium)]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {info.title}
                      </h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-sm text-gray-600">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={plant}
                alt="Customer Service"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Floating Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute -top-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--medium)]">
                  24/7
                </div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--medium)]">
                  98%
                </div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
