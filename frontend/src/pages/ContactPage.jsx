import { motion } from "framer-motion";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare,
  Send,
  Building,
  Globe,
  CheckCircle,
  AlertCircle,
  Heart,
  FileCheck,
  Thermometer
} from "lucide-react";
import { useState } from "react";
import axios from "../lib/axios";
import { useTranslation } from "../hooks/useTranslation";

const ContactPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
    serviceType: "general"
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error', or null

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      // Send only the required fields that match the backend API
      const contactData = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      };

      const response = await axios.post('/contact/send', contactData);

      if (response.data.success) {
        setStatus('success');
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          subject: "",
          message: "",
          serviceType: "general"
        });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const offices = [
    {
      city: "New Jersey, USA",
      address: t('contact.offices.newjersey'),
      phone: "support@reptileglobal.site",
      email: "support@reptileglobal.site"
    },
    {
      city: "Amsterdam",
      address: t('contact.offices.amsterdam'),
      phone: "support@reptileglobal.site",
      email: "support@reptileglobal.site"
    },
    {
      city: "Rome",
      address: t('contact.offices.rome'),
      phone: "support@reptileglobal.site",
      email: "support@reptileglobal.site"
    },
    {
      city: "Singapore",
      address: t('contact.offices.singapore'),
      phone: "support@reptileglobal.site",
      email: "support@reptileglobal.site"
    },
    {
      city: "Hong Kong",
      address: t('contact.offices.hongkong'),
      phone: "support@reptileglobal.site",
      email: "support@reptileglobal.site"
    }
  ];

  const serviceTypes = [
    { value: "general", label: t('contact.serviceTypes.general') },
    { value: "shipping", label: t('contact.serviceTypes.shipping') },
    { value: "tracking", label: t('contact.serviceTypes.tracking') },
    { value: "documentation", label: t('contact.serviceTypes.documentation') },
    { value: "emergency", label: t('contact.serviceTypes.emergency') },
    { value: "partnership", label: t('contact.serviceTypes.partnership') }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-blue-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('contact.hero.title')} <span className="text-emerald-400">{t('contact.hero.subtitle')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              {t('contact.hero.description')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-xl p-8 shadow-lg"
            >
              <div className="flex items-center mb-6">
                <MessageSquare className="w-8 h-8 text-emerald-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">{t('contact.form.title')}</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={`${t('contact.form.name')} ${t('contact.form.required')}`}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={`${t('contact.form.email')} ${t('contact.form.required')}`}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={t('contact.form.phone')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder={t('contact.form.company')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  >
                    {serviceTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder={`${t('contact.form.subject')} ${t('contact.form.required')}`}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  />
                </div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={`${t('contact.form.message')} ${t('contact.form.required')}`}
                  required
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                />

                {/* Status Messages */}
                {status === 'success' && (
                  <div className='p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center'>
                    <CheckCircle className='w-5 h-5 mr-2' />
                    {t('contact.form.success')}
                  </div>
                )}

                {status === 'error' && (
                  <div className='p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center'>
                    <AlertCircle className='w-5 h-5 mr-2' />
                    {t('contact.form.error')}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-semibold text-lg transition duration-300 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {t('contact.form.sending')}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      {t('contact.form.submit')}
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('contact.info.title')}</h2>
                <p className="text-lg text-gray-600 mb-8">
                  {t('contact.info.description')}
                </p>
              </div>

              {/* Quick Contact */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('contact.info.quickContact')}</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-emerald-600 mr-3" />
                    <span className="text-gray-700">support@reptileglobal.site</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-emerald-600 mr-3" />
                    <span className="text-gray-700">{t('about.monitoring')}</span>
                  </div>
                  <div className="flex items-center">
                    <Heart className="w-5 h-5 text-emerald-600 mr-3" />
                    <span className="text-gray-700">{t('showcase.handlers')}</span>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                <h3 className="text-xl font-semibold text-red-800 mb-4">{t('contact.info.emergencyTitle')}</h3>
                <p className="text-red-700 mb-3">
                  {t('contact.info.emergencyDesc')}
                </p>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-red-600 mr-3" />
                  <span className="text-gray-700">support@reptileglobal.site</span>
                </div>
              </div>

              {/* Service Features */}
              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                <h3 className="text-xl font-semibold text-emerald-800 mb-4">{t('contact.info.servicesTitle')}</h3>
                <div className="space-y-3 text-emerald-700">
                  <div className="flex items-center">
                    <Thermometer className="w-4 h-4 text-emerald-600 mr-2" />
                    <span>{t('contact.info.climateTransport')}</span>
                  </div>
                  <div className="flex items-center">
                    <FileCheck className="w-4 h-4 text-emerald-600 mr-2" />
                    <span>{t('contact.info.citesDoc')}</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 text-emerald-600 mr-2" />
                    <span>{t('contact.info.europeAsiaShipping')}</span>
                  </div>
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 text-emerald-600 mr-2" />
                    <span>{t('contact.info.animalWelfare')}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Global Offices Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('contact.offices.title')}</h2>
            <p className="text-xl text-gray-600">
              {t('contact.offices.description')}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {offices.map((office, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition duration-300"
              >
                <div className="flex items-center mb-4">
                  <Building className="w-6 h-6 text-emerald-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">{office.city}</h3>
                </div>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-emerald-600 mr-2 mt-0.5" />
                    <span className="text-sm">{office.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-emerald-600 mr-2" />
                    <span className="text-sm">{office.email}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('contact.map.title')}</h2>
            <p className="text-xl text-gray-600">
              {t('contact.map.description')}
            </p>
          </motion.div>
          <div className="bg-gray-300 rounded-xl h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-600">{t('contact.map.placeholder')}</p>
              <p className="text-gray-500 text-sm">{t('contact.map.coming')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;