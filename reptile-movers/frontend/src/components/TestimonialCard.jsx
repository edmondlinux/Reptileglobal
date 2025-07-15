import { Star, Quote } from "lucide-react";

const TestimonialCard = ({ name, company, quote, rating, companyLogo, avatar }) => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4 overflow-hidden">
          {avatar ? (
            <img src={avatar} alt={name} className="w-16 h-16 object-cover rounded-full" />
          ) : companyLogo ? (
            <img src={companyLogo} alt={company} className="w-12 h-12 object-contain" />
          ) : (
            <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">{name.charAt(0)}</span>
            </div>
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
          <p className="text-gray-600">{company}</p>
          <div className="flex mt-2">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
            ))}
          </div>
        </div>
      </div>
      <Quote className="w-8 h-8 text-emerald-600 mb-4" />
      <p className="text-gray-700 text-lg leading-relaxed italic">
        "{quote}"
      </p>
    </div>
  );
};

export default TestimonialCard;