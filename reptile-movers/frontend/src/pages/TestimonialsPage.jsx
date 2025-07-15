import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

const TestimonialsPage = () => {
  const { t } = useTranslation();

  const testimonials = [
    {
      name: "Marco Rodriguez",
      company: t('testimonials.marco.company'),
      quote: t('testimonials.marco.quote'),
      rating: 5,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MarcoRodriguez"
    },
    {
      name: "Lisa Chen",
      company: t('testimonials.lisa.company'),
      quote: t('testimonials.lisa.quote'),
      rating: 5,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=LisaChen"
    },
    {
      name: "Johan Larsson",
      company: t('testimonials.johan.company'),
      quote: t('testimonials.johan.quote'),
      rating: 5,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JohanLarsson"
    },
    {
      name: "Sophie Martin",
      company: t('testimonials.sophie.company'),
      quote: t('testimonials.sophie.quote'),
      rating: 5,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SophieMartin"
    },
    {
      name: "David Kim",
      company: "Korean Exotic Pets",
      quote: "Outstanding service to Korea. Professional handling and perfect documentation every time.",
      rating: 5,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DavidKim"
    },
    {
      name: "Maria Santos",
      company: "Brazilian Reptiles Import",
      quote: "Reliable and safe transport from Europe to South America. Highly recommended for international shipping.",
      rating: 5,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MariaSantos"
    }
  ];

  const stats = [
    { number: "500+", label: "Happy Clients" },
    { number: "98%", label: "Success Rate" },
    { number: "15+", label: "Years Experience" },
    { number: "24/7", label: "Support" }
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
              {t('testimonials.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              {t('testimonials.description')}
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

      {/* Testimonials Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-gray-600">{testimonial.company}</p>
                    <div className="flex mt-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <Quote className="w-8 h-8 text-emerald-600 mb-4" />
                <p className="text-gray-700 text-lg leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Join Our Satisfied Customers
            </h2>
            <p className="text-xl text-emerald-100 mb-8">
              Experience the same level of professional service and care for your reptile shipping needs.
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

export default TestimonialsPage;