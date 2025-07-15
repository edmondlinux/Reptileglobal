
import { useEffect } from "react";
import { useUserStore } from "../stores/useUserStore";
import { 
	Package, 
	Truck, 
	Warehouse, 
	Globe, 
	Shield, 
	Clock, 
	MapPin,
	Zap,
	DollarSign,
	PhoneCall,
	CheckCircle,
	ArrowRight,
	Users,
	Award,
	Target
} from "lucide-react";
import HeroSection from "../components/HeroSection";
import ServiceCard from "../components/ServiceCard";
import FeatureCard from "../components/FeatureCard";
import TestimonialCard from "../components/TestimonialCard";
import ProcessStep from "../components/ProcessStep";
import ContactForm from "../components/ContactForm";
import PartnersSection from "../components/PartnersSection";
import Gallery from "../components/Gallery";
import { useTranslation } from "../hooks/useTranslation";

const HomePage = () => {
	const { user } = useUserStore();
	const { t } = useTranslation();

	const services = [
		{
			icon: Truck,
			title: t('services.climateTransport.title'),
			description: t('services.climateTransport.description')
		},
		{
			icon: Globe,
			title: t('services.globalShipping.title'),
			description: t('services.globalShipping.description')
		},
		{
			icon: Warehouse,
			title: t('services.quarantine.title'),
			description: t('services.quarantine.description')
		},
		{
			icon: Package,
			title: t('services.doorToDoor.title'),
			description: t('services.doorToDoor.description')
		},
		{
			icon: Target,
			title: t('services.breederNetwork.title'),
			description: t('services.breederNetwork.description')
		},
		{
			icon: CheckCircle,
			title: t('services.cites.title'),
			description: t('services.cites.description')
		}
	];

	const features = [
		{
			icon: Zap,
			title: t('features.express.title'),
			description: t('features.express.description')
		},
		{
			icon: MapPin,
			title: t('features.tracking.title'),
			description: t('features.tracking.description')
		},
		{
			icon: Shield,
			title: t('features.insurance.title'),
			description: t('features.insurance.description')
		},
		{
			icon: Globe,
			title: t('features.network.title'),
			description: t('features.network.description')
		}
	];

	const testimonials = [
		{
			name: "Marco Rossi",
			company: t('testimonials.marco.company'),
			quote: t('testimonials.marco.quote'),
			rating: 5,
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MarcoRossi"
		},
		{
			name: "Lisa Wang",
			company: t('testimonials.lisa.company'),
			quote: t('testimonials.lisa.quote'),
			rating: 5,
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=LisaWang"
		},
		{
			name: "Johan Andersson",
			company: t('testimonials.johan.company'),
			quote: t('testimonials.johan.quote'),
			rating: 5,
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JohanAndersson"
		},
		{
			name: "Sophie Dubois",
			company: t('testimonials.sophie.company'),
			quote: t('testimonials.sophie.quote'),
			rating: 5,
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SophieDubois"
		}
	];

	const processSteps = [
		{
			number: 1,
			icon: PhoneCall,
			title: t('process.consultation.title'),
			description: t('process.consultation.description')
		},
		{
			number: 2,
			icon: Package,
			title: t('process.pickup.title'),
			description: t('process.pickup.description')
		},
		{
			number: 3,
			icon: Truck,
			title: t('process.transport.title'),
			description: t('process.transport.description')
		},
		{
			number: 4,
			icon: CheckCircle,
			title: t('process.delivery.title'),
			description: t('process.delivery.description')
		}
	];

	return (
		<div className='min-h-screen bg-white'>
			{/* Hero Section */}
			<HeroSection />

			{/* Partners Section */}
			<PartnersSection />

			{/* Gallery Section */}
			<Gallery />

			{/* Services Section */}
			<section className='py-20 bg-gray-50'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-16'>
						<h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>{t('services.title')}</h2>
						<p className='text-xl text-gray-600 max-w-3xl mx-auto'>
							{t('services.description')}
						</p>
					</div>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
						{services.map((service, index) => (
							<ServiceCard
								key={index}
								icon={service.icon}
								title={service.title}
								description={service.description}
							/>
						))}
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className='py-20 bg-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-16'>
						<h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>{t('features.title')}</h2>
						<p className='text-xl text-gray-600'>
							{t('features.description')}
						</p>
					</div>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
						{features.map((feature, index) => (
							<FeatureCard
								key={index}
								icon={feature.icon}
								title={feature.title}
								description={feature.description}
							/>
						))}
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section className='py-20 bg-emerald-50'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-16'>
						<h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>{t('process.title')}</h2>
						<p className='text-xl text-gray-600'>
							{t('process.description')}
						</p>
					</div>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
						{processSteps.map((step, index) => (
							<ProcessStep
								key={index}
								number={step.number}
								icon={step.icon}
								title={step.title}
								description={step.description}
							/>
						))}
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			<section className='py-20 bg-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-16'>
						<h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>{t('testimonials.title')}</h2>
						<p className='text-xl text-gray-600'>
							{t('testimonials.description')}
						</p>
					</div>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
						{testimonials.map((testimonial, index) => (
							<TestimonialCard
								key={index}
								name={testimonial.name}
								company={testimonial.company}
								quote={testimonial.quote}
								rating={testimonial.rating}
								avatar={testimonial.avatar}
							/>
						))}
					</div>
				</div>
			</section>

			{/* Visual Showcase Section */}
			<section className='py-20 bg-gray-100'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-16'>
						<h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>{t('showcase.title')}</h2>
						<p className='text-xl text-gray-600'>
							{t('showcase.description')}
						</p>
					</div>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
						{/* Image Placeholders */}
						<div className='bg-gray-300 rounded-lg h-64 flex items-center justify-center'>
							<div className='text-center'>
								<Users className='w-12 h-12 text-gray-500 mx-auto mb-2' />
								<p className='text-gray-600'>{t('showcase.handlers')}</p>
							</div>
						</div>
						<div className='bg-gray-300 rounded-lg h-64 flex items-center justify-center'>
							<div className='text-center'>
								<Truck className='w-12 h-12 text-gray-500 mx-auto mb-2' />
								<p className='text-gray-600'>{t('showcase.vehicles')}</p>
							</div>
						</div>
						<div className='bg-gray-300 rounded-lg h-64 flex items-center justify-center'>
							<div className='text-center'>
								<Warehouse className='w-12 h-12 text-gray-500 mx-auto mb-2' />
								<p className='text-gray-600'>{t('showcase.facilities')}</p>
							</div>
						</div>
						<div className='bg-gray-300 rounded-lg h-64 flex items-center justify-center'>
							<div className='text-center'>
								<Globe className='w-12 h-12 text-gray-500 mx-auto mb-2' />
								<p className='text-gray-600'>{t('showcase.distribution')}</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* About Us Section */}
			<section className='py-20 bg-gray-900 text-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
						<div>
							<h2 className='text-3xl md:text-4xl font-bold mb-6'>{t('about.title')}</h2>
							<p className='text-xl text-gray-300 mb-6 leading-relaxed'>
								{t('about.description')}
							</p>
							<p className='text-lg text-gray-400 mb-8'>
								{t('about.compliance')}
							</p>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
								<div className='text-center'>
									<div className='text-3xl font-bold text-emerald-400 mb-2'>5+</div>
									<div className='text-gray-400'>{t('about.experience')}</div>
								</div>
								<div className='text-center'>
									<div className='text-3xl font-bold text-emerald-400 mb-2'>9+</div>
									<div className='text-gray-400'>{t('about.countries')}</div>
								</div>
								<div className='text-center'>
									<div className='text-3xl font-bold text-emerald-400 mb-2'>10K+</div>
									<div className='text-gray-400'>{t('about.shipped')}</div>
								</div>
							</div>
						</div>
						<div className='grid grid-cols-2 gap-4'>
							<div className='bg-gray-800 rounded-lg p-6 text-center'>
								<Award className='w-12 h-12 text-emerald-400 mx-auto mb-4' />
								<h3 className='font-semibold mb-2'>{t('about.certified')}</h3>
								<p className='text-gray-400 text-sm'>{t('about.certifiedDesc')}</p>
							</div>
							<div className='bg-gray-800 rounded-lg p-6 text-center'>
								<Shield className='w-12 h-12 text-emerald-400 mx-auto mb-4' />
								<h3 className='font-semibold mb-2'>{t('about.climate')}</h3>
								<p className='text-gray-400 text-sm'>{t('about.climateDesc')}</p>
							</div>
							<div className='bg-gray-800 rounded-lg p-6 text-center'>
								<Clock className='w-12 h-12 text-emerald-400 mx-auto mb-4' />
								<h3 className='font-semibold mb-2'>{t('about.monitoring')}</h3>
								<p className='text-gray-400 text-sm'>{t('about.monitoringDesc')}</p>
							</div>
							<div className='bg-gray-800 rounded-lg p-6 text-center'>
								<DollarSign className='w-12 h-12 text-emerald-400 mx-auto mb-4' />
								<h3 className='font-semibold mb-2'>{t('about.rates')}</h3>
								<p className='text-gray-400 text-sm'>{t('about.ratesDesc')}</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Contact Form Section */}
			<ContactForm />

			{/* CTA Section */}
			<section className='py-16 bg-emerald-600 text-white'>
				<div className='max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8'>
					<h2 className='text-3xl md:text-4xl font-bold mb-4'>{t('cta.title')}</h2>
					<p className='text-xl mb-8'>
						{t('cta.description')}
					</p>
					<div className='flex flex-col sm:flex-row gap-4 justify-center'>
						<button className='bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition duration-300 flex items-center justify-center group'>
							{t('cta.getQuote')}
							<ArrowRight className='ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform' />
						</button>
						<button className='border-2 border-white hover:bg-white hover:text-emerald-600 px-8 py-4 rounded-lg font-semibold text-lg transition duration-300'>
							{t('cta.email')}
						</button>
					</div>
				</div>
			</section>
		</div>
	);
};

export default HomePage;
