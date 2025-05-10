import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 20) {
      newErrors.message = 'Message should be at least 20 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real application, this would submit to an API endpoint
      // await api.post('/contact', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Your message has been sent successfully! We will contact you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Contact Us
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Have a question or want to learn more about CV Matcher? We're here to help!
            </p>
          </div>
          
          <div className="mt-12 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3">
              {/* Contact Information */}
              <div className="bg-blue-600 text-white py-10 px-6">
                <h2 className="text-lg font-semibold">Contact Information</h2>
                <p className="mt-2 text-blue-100">
                  Reach out to us with any questions or inquiries.
                </p>
                
                <div className="mt-8 space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Mail className="h-6 w-6 text-blue-100" />
                    </div>
                    <div className="ml-3 text-blue-100">
                      <p>Email</p>
                      <a href="mailto:info@cvmatcher.com" className="font-medium text-white hover:text-blue-50">
                        info@cvmatcher.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Phone className="h-6 w-6 text-blue-100" />
                    </div>
                    <div className="ml-3 text-blue-100">
                      <p>Phone</p>
                      <a href="tel:+1-555-123-4567" className="font-medium text-white hover:text-blue-50">
                        +1 (555) 123-4567
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <MapPin className="h-6 w-6 text-blue-100" />
                    </div>
                    <div className="ml-3 text-blue-100">
                      <p>Address</p>
                      <p className="font-medium text-white">
                        123 Innovation Drive<br />
                        San Francisco, CA 94107
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-12">
                  <h3 className="text-lg font-semibold text-white">Office Hours</h3>
                  <div className="mt-2 text-blue-100">
                    <p>Monday - Friday: 9 AM - 6 PM</p>
                    <p>Saturday: 10 AM - 2 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="col-span-2 py-10 px-6">
                <h2 className="text-lg font-semibold text-gray-900">Send us a message</h2>
                <p className="mt-1 text-gray-600">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
                
                <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`block w-full rounded-md shadow-sm sm:text-sm ${
                          errors.name 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`block w-full rounded-md shadow-sm sm:text-sm ${
                          errors.email 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                      Subject
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`block w-full rounded-md shadow-sm sm:text-sm ${
                          errors.subject 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                      />
                      {errors.subject && (
                        <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className={`block w-full rounded-md shadow-sm sm:text-sm ${
                          errors.message 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="mr-2 h-5 w-5" />
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          {/* Map Section */}
          <div className="mt-12 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Find Us</h2>
            </div>
            <div className="h-96 bg-gray-200 flex items-center justify-center">
              {/* In a real application, you would embed a map here */}
              <div className="text-center text-gray-500">
                <MapPin className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-2">Map would be displayed here</p>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 text-center">Frequently Asked Questions</h2>
            <div className="mt-6 border-t border-b border-gray-200 divide-y divide-gray-200">
              <div className="py-6">
                <h3 className="text-lg font-medium text-gray-900">How does CV Matcher work?</h3>
                <div className="mt-2">
                  <p className="text-gray-500">
                    CV Matcher uses advanced AI algorithms to analyze resumes and job descriptions, 
                    identifying the most suitable candidates for specific positions based on skills, 
                    experience, and other relevant factors.
                  </p>
                </div>
              </div>
              <div className="py-6">
                <h3 className="text-lg font-medium text-gray-900">Is my data secure with CV Matcher?</h3>
                <div className="mt-2">
                  <p className="text-gray-500">
                    Yes, we take data security seriously. All personal information and documents are 
                    encrypted and stored securely. We comply with data protection regulations and 
                    never share your data with third parties without your explicit consent.
                  </p>
                </div>
              </div>
              <div className="py-6">
                <h3 className="text-lg font-medium text-gray-900">How much does CV Matcher cost?</h3>
                <div className="mt-2">
                  <p className="text-gray-500">
                    We offer various plans to suit different needs. Candidates can create basic 
                    profiles for free, while employers can choose from our flexible subscription 
                    options. Visit our pricing page for more details or contact our sales team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Contact;