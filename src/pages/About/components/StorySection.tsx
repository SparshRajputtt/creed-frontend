//@ts-nocheck
'use client';

import type React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Earth, Eye, Heart, Lightbulb, Target, Users } from 'lucide-react';

export const StorySection: React.FC = () => {
  const milestones = [
    {
      year: 'June 2023',
      title: 'The Beginning',
      description:
        'Trust Homewares Pvt Ltd started its journey in June 2023 with a clear goal — to offer reliable, stylish, and high-quality homeware products for Indian homes.',
    },
    {
      year: '2023',
      title: '⁠First Market Launch',
      description:
        'Our first sales began in Uttar Pradesh, starting with trusted retailers and distributors in Lucknow.',
    },
    {
      year: '2024',
      title: '⁠Online Expansion',
      description:
        'To meet rising demand, we expanded online through our own eCommerce platform and social media channels, reaching customers across India.',
    },
    {
      year: '2025',
      title: '⁠Innovation-Driven Growth',
      description:
        'We focus on continuous innovation — from modern product design to user-friendly packaging — to deliver convenience, quality, and value.',
    },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Passion',
      description:
        'We’re passionate about creating meaningful, well-crafted products that improve daily living. Every design reflects care, usability, and commitment to excellence.',
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description:
        'Our team continuously rethinks, refines, and reinvents — to deliver smarter, better homeware solutions that fit today’s fast-paced lifestyle.',
    },
    {
      icon: Target,
      title: 'Mission',
      description:
        'To provide durable, affordable, and aesthetically pleasing homeware products that bring ease, utility, and elegance to homes across India and beyond.',
    },
    {
      icon: Earth,
      title: 'Vision',
      description:
        'To become a globally trusted homeware brand, expanding our reach from Indian households to international markets, through innovation, quality, and customer-first values.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Story Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Our Story
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From humble beginnings to becoming a trusted name in the aquatic
            industry, our journey has been driven by passion, innovation, and an
            unwavering commitment to our customers.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="h-full border-0 shadow-sm hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[var(--medium)] to-[var(--dark)] rounded-full flex items-center justify-center text-white font-bold">
                        {milestone.year.slice(-2)}
                      </div>
                      <div>
                        <div className="text-sm text-[var(--medium)] font-semibold">
                          {milestone.year}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[var(--medium)] transition-colors">
                          {milestone.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {milestone.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Our Values
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The principles that guide everything we do and shape our commitment
            to excellence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full border-0 shadow-sm hover:shadow-lg transition-all duration-300 text-center group">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-[var(--lightest)] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[var(--light)] transition-colors">
                    <value.icon className="h-8 w-8 text-[var(--medium)]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[var(--medium)] transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
