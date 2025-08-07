import { useEffect, useState } from "react";
import { Package, ArrowRight, Search, X } from "lucide-react";
import { useShipmentStore } from "../stores/useShipmentStore";
import { useTranslation } from "../hooks/useTranslation";
import { useNavigate } from "react-router-dom";

// Reptile and nature themed background images
const backgroundImages = [
	"https://img.joomcdn.net/36156a9978ca2e5baf7e9de46a6ba9388c0e918d_original.jpeg",
	"https://cdn.mos.cms.futurecdn.net/LeLcqJPp6DtqwFddXH5X6A-1024-80.jpg.webp",
	"https://www.anywhere.com/img-a/flora-fauna/reptile/iguana-verde/green-iguana2.jpg?q=95&w=650",
	"https://live.staticflickr.com/916/28319597677_c9acaf5d4e_b.jpg",
];

const HeroSection = () => {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [showTrackingInput, setShowTrackingInput] = useState(false);
	const [trackingNumber, setTrackingNumber] = useState("");
	const { trackShipment, loading } = useShipmentStore();
	const { t } = useTranslation();
    const navigate = useNavigate();

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
		}, 5000);
		return () => clearInterval(interval);
	}, []);

	const handleTrackShipment = async (e) => {
		e.preventDefault();
		if (!trackingNumber.trim()) return;

		try {
			await trackShipment(trackingNumber.trim());
			// Clear the input and hide the tracking form after successful tracking
			setTrackingNumber("");
			setShowTrackingInput(false);
            navigate(`/track?trackingNumber=${trackingNumber.trim()}`);
		} catch (error) {
			// Error handling is done in the store
		}
	};

	const toggleTrackingInput = () => {
		setShowTrackingInput(!showTrackingInput);
		if (showTrackingInput) {
			setTrackingNumber("");
		}
	};

	return (
		<div className="relative h-screen flex items-center justify-center text-white overflow-hidden">
			{/* Image Slider Container */}
			<div className="absolute inset-0">
				<div 
					className="flex h-full transition-transform duration-1000 ease-in-out"
					style={{
						width: `${backgroundImages.length * 100}%`,
						transform: `translateX(-${(currentImageIndex * 100) / backgroundImages.length}%)`
					}}
				>
					{backgroundImages.map((image, index) => (
						<div
							key={index}
							className="w-full h-full bg-cover bg-center flex-shrink-0"
							style={{
								backgroundImage: `url(${image})`,
								width: `${100 / backgroundImages.length}%`
							}}
						/>
					))}
				</div>
			</div>

			{/* Dark overlay */}
			<div className="absolute inset-0 bg-black opacity-60 z-10"></div>

			{/* Optional Icon Overlay */}
			<div className="absolute inset-0 flex items-center justify-center opacity-20 z-10">
				<Package className="w-96 h-96 text-emerald-400" />
			</div>

			{/* Main Content */}
			<div className="relative z-20 text-center max-w-4xl mx-auto px-4">
				<h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
					{t('hero.title')}
					<span className="text-emerald-400 block">{t('hero.subtitle')}</span>
				</h1>
				<p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
					{t('hero.description')}
				</p>
				<div className="flex flex-col gap-4 justify-center">
					{!showTrackingInput && (
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<button className="bg-emerald-600 hover:bg-emerald-700 px-8 py-4 rounded-lg font-semibold text-lg transition duration-300 flex items-center justify-center group">
								{t('hero.getQuote')}
								<ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</button>
							<button 
								onClick={toggleTrackingInput}
								className="border-2 border-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition duration-300 flex items-center justify-center group"
							>
								<Search className="mr-2 w-5 h-5" />
								{t('hero.trackShipment')}
							</button>
						</div>
					)}

					{/* Tracking Input Form */}
					{showTrackingInput && (
						<div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto w-full">
							<form onSubmit={handleTrackShipment} className="flex flex-col gap-3">
								<input
									type="text"
									value={trackingNumber}
									onChange={(e) => setTrackingNumber(e.target.value)}
									placeholder={t('hero.enterTracking')}
									className="bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm"
								/>
								<div className="flex gap-2">
									<button 
										type="submit"
										disabled={loading || !trackingNumber.trim()}
										className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-semibold transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-1"
									>
										<Search className="mr-2 w-4 h-4" />
										{loading ? t('hero.tracking') : t('hero.trackNow')}
									</button>
									<button 
										type="button"
										onClick={toggleTrackingInput}
										className="border-2 border-white hover:bg-white hover:text-gray-900 px-4 py-3 rounded-lg font-semibold transition duration-300 flex items-center justify-center"
									>
										<X className="w-4 h-4" />
									</button>
								</div>
							</form>
						</div>
					)}
				</div>
			</div>

			{/* Slide Indicators */}
			<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
				{backgroundImages.map((_, index) => (
					<button
						key={index}
						onClick={() => setCurrentImageIndex(index)}
						className={`w-3 h-3 rounded-full transition-all duration-300 ${
							index === currentImageIndex 
								? 'bg-emerald-400 scale-125' 
								: 'bg-white bg-opacity-50 hover:bg-opacity-75'
						}`}
					/>
				))}
			</div>
		</div>
	);
};

export default HeroSection;