
import { Mail, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const FloatingActionButtons = () => {
  const handleKakaoTalk = () => {
    // Open KakaoTalk web or app
    window.open('https://open.kakao.com/me/reptileglobal', '_blank');
  };

  const handleEmailSupport = () => {
    // Open default email client with pre-filled email
    window.location.href = 'mailto:support@reptileglobal.site?subject=Support Request&body=Hello Reptile Global Support Team,%0D%0A%0D%0AI need assistance with...';
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-4">
      {/* Email Support Button */}
      <motion.button
        onClick={handleEmailSupport}
        className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Mail className="w-6 h-6" />
        <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Email Support
        </div>
      </motion.button>

      {/* KakaoTalk Button */}
      <motion.button
        onClick={handleKakaoTalk}
        className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group relative"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src="/talklogo.png"
          alt="KakaoTalk"
          className="w-6 h-6"
        />
        <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          KakaoTalk
        </div>
      </motion.button>
    </div>
  );
};

export default FloatingActionButtons;
