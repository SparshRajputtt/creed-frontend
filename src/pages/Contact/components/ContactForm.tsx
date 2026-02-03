//@ts-nocheck
'use client';

import type React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import location from '@/images/location.png';
import { Link } from 'react-router-dom';
import { useSubmitContact } from '@/queries/hooks/contact/useContact'; // Adjust import path as needed

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: '',
  });

  const submitContactMutation = useSubmitContact();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      return;
    }

    try {
      await submitContactMutation.mutateAsync(formData);

      // Reset form on successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        category: '',
        message: '',
      });
    } catch (error) {
      // Error is handled by the mutation's onError callback
      console.error('Form submission error:', error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Success state
  if (submitContactMutation.isSuccess) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto text-center"
          >
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-600 mb-4">
                  Thank you for contacting us. We'll get back to you within 24
                  hours.
                </p>
                <p className="text-sm text-gray-500">
                  You should receive a confirmation email shortly.
                </p>
                <Button
                  onClick={() => submitContactMutation.reset()}
                  variant="outline"
                  className="mt-4"
                >
                  Send Another Message
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Send us a Message
                </h2>

                {/* Error state */}
                {submitContactMutation.isError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
                  >
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <p className="text-red-800 text-sm">
                      {(submitContactMutation.error as any)?.response?.data
                        ?.message ||
                        'Failed to send message. Please try again.'}
                    </p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Your full name"
                        className="border-gray-200 focus:border-[var(--medium)] focus:ring-[var(--medium)]"
                        disabled={submitContactMutation.isPending}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="your@email.com"
                        className="border-gray-200 focus:border-[var(--medium)] focus:ring-[var(--medium)]"
                        disabled={submitContactMutation.isPending}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="+91 9897000000"
                        className="border-gray-200 focus:border-[var(--medium)] focus:ring-[var(--medium)]"
                        disabled={submitContactMutation.isPending}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          handleChange('category', value)
                        }
                        disabled={submitContactMutation.isPending}
                      >
                        <SelectTrigger className="border-gray-200 focus:border-[var(--medium)] focus:ring-[var(--medium)]">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">
                            General Inquiry
                          </SelectItem>
                          <SelectItem value="bulk">
                            Bulk Order Inquiry
                          </SelectItem>
                          <SelectItem value="product">
                            Product Question
                          </SelectItem>
                          <SelectItem value="support">
                            Technical Support
                          </SelectItem>
                          <SelectItem value="order">Order Status</SelectItem>
                          <SelectItem value="partnership">
                            Partnership
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <Input
                      required
                      value={formData.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      placeholder="Brief description of your inquiry"
                      className="border-gray-200 focus:border-[var(--medium)] focus:ring-[var(--medium)]"
                      disabled={submitContactMutation.isPending}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder="Tell us more about your inquiry..."
                      className="border-gray-200 focus:border-[var(--medium)] focus:ring-[var(--medium)] resize-none"
                      disabled={submitContactMutation.isPending}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitContactMutation.isPending}
                    className="w-full bg-[var(--medium)] hover:bg-[var(--dark)] text-white h-12 group disabled:opacity-50"
                  >
                    {submitContactMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Send Message
                        <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Map & Additional Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Map */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <Link
                to={
                  'https://www.google.com/maps/place/Shivalik+ganga+vihar+phase+II+gate+no1+Navodaya+nagar/data=!4m2!3m1!1s0x0:0x5897177876527078?sa=X&ved=1t:2428&ictx=111'
                }
              >
                <div className="h-64 bg-gray-200 relative">
                  <img
                    src={location}
                    alt="Manufacturing Plant Location"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg">
                    <div className="font-semibold text-gray-900">Creed HQ</div>
                  </div>
                </div>
              </Link>
            </Card>

            {/* FAQ */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      What are your response times?
                    </h4>
                    <p className="text-sm text-gray-600">
                      We typically respond to inquiries within 24 hours during
                      business days.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Do you offer phone support?
                    </h4>
                    <p className="text-sm text-gray-600">
                      Yes! Call us at +91 9897967727 during business hours for
                      immediate assistance.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Can I visit your plant?
                    </h4>
                    <p className="text-sm text-gray-600">
                      We welcome visitors to our plant. Check our business hours
                      above.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
