
import { motion } from "framer-motion";
import { 
  Award, 
  Shield, 
  Thermometer, 
  Clock,
  Users,
  Globe,
  CheckCircle,
  Heart
} from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

const AboutPage = () => {
  const { t } = useTranslation();

  const stats = [
    { number: "15+", label: t('about.experience') },
    { number: "9+", label: t('about.countries') },
    { number: "10K+", label: t('about.shipped') },
    { number: "99%", label: "Success Rate" }
  ];

  const features = [
    {
      icon: <Award className="w-8 h-8 text-emerald-600" />,
      title: t('about.certified'),
      description: t('about.certifiedDesc')
    },
    {
      icon: <Thermometer className="w-8 h-8 text-emerald-600" />,
      title: t('about.climate'),
      description: t('about.climateDesc')
    },
    {
      icon: <Clock className="w-8 h-8 text-emerald-600" />,
      title: t('about.monitoring'),
      description: t('about.monitoringDesc')
    },
    {
      icon: <Heart className="w-8 h-8 text-emerald-600" />,
      title: t('about.rates'),
      description: t('about.ratesDesc')
    }
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
              {t('about.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              {t('about.description')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center text-white"
              >
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-emerald-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('features.title')}
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                {t('features.description')}
              </p>
              <p className="text-lg text-gray-600 mb-8">
                {t('about.compliance')}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 gap-6"
            >
              {features.map((feature, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 text-center">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('services.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('services.description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <Thermometer className="w-8 h-8 text-emerald-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  {t('services.climateTransport.title')}
                </h3>
              </div>
              <p className="text-gray-600">
                {t('services.climateTransport.description')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <Globe className="w-8 h-8 text-emerald-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  {t('services.globalShipping.title')}
                </h3>
              </div>
              <p className="text-gray-600">
                {t('services.globalShipping.description')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <Shield className="w-8 h-8 text-emerald-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  {t('services.quarantine.title')}
                </h3>
              </div>
              <p className="text-gray-600">
                {t('services.quarantine.description')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <Users className="w-8 h-8 text-emerald-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  {t('services.doorToDoor.title')}
                </h3>
              </div>
              <p className="text-gray-600">
                {t('services.doorToDoor.description')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <Globe className="w-8 h-8 text-emerald-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  {t('services.breederNetwork.title')}
                </h3>
              </div>
              <p className="text-gray-600">
                {t('services.breederNetwork.description')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  {t('services.cites.title')}
                </h3>
              </div>
              <p className="text-gray-600">
                {t('services.cites.description')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-emerald-100 mb-8">
              {t('cta.description')}
            </p>
            <button className="bg-white text-emerald-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition duration-300">
              {t('cta.getQuote')}
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
