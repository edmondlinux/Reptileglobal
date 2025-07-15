
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const Gallery = () => {
	const { t } = useTranslation();
	const [selectedImage, setSelectedImage] = useState(null);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	const galleryImages = [
		{
			id: 1,
			url: "https://cdn.reptile.guide/wp-content/uploads/2019/01/Bearded-Dragon-Buckled-Up-In-Car.jpg",
			title: "Bearded Dragon Transport",
			category: t('gallery.categories.reptiles'),
			description: t('gallery.images.beardedTransport')
		},
		{
			id: 2,
			url: "https://shipyourreptiles.com/products/213/213_2023_05_24_04_22_10.png",
			title: "Insulated Box",
			category: t('gallery.categories.reptiles'),
			description: t('gallery.images.insulatedBox')
		},
		{
			id: 3,
			url: "https://cdn.machineseeker.com/data/listing/img/vga/ms/30/41/16095703-01.jpg?v=1714742205",
			title: "Climate-Controlled Containers",
			category: t('gallery.categories.equipment'),
			description: t('gallery.images.climateContainers')
		},
		{
			id: 4,
			url: "https://64.media.tumblr.com/3eac0b6bef44e51769fabcc610dcd1e5/tumblr_inline_pflhkk6jbS1qml5jd_1280.jpg",
			title: "Transport Setup",
			category: t('gallery.categories.reptiles'),
			description: t('gallery.images.transportSetup')
		},
		{
			id: 5,
			url: "https://preview.redd.it/bough-a-small-coral-is-it-safe-to-travel-with-it-more-in-v0-kfknhcesn3cb1.png?auto=webp&s=348d38ea7757ef3b1d2e7ba39d233a51d7e8863b",
			title: "Shipping Documentation",
			category: t('gallery.categories.process'),
			description: t('gallery.images.documentation')
		},
		{
			id: 6,
			url: "https://eu-exoticreptiles.com/wp-content/uploads/2024/10/b36381_90fb4389f3144a95b7dd4fff8352063fmv2.jpg",
			title: "Secure Packaging",
			category: t('gallery.categories.equipment'),
			description: t('gallery.images.packaging')
		},
		{
			id: 7,
			url: "https://exoticpetdecor.com/cdn/shop/collections/other-lizards.jpg?v=1708661289",
			title: "Lizard Species Collection",
			category: t('gallery.categories.reptiles'),
			description: t('gallery.images.lizardCollection')
		},
		{
			id: 8,
			url: "https://ik.imagekit.io/14iir4o77/IMG_0402.jpeg",
			title: "Transport Monitoring",
			category: t('gallery.categories.process'),
			description: t('gallery.images.monitoring')
		}
	];

	const categories = [t('gallery.categories.all'), ...new Set(galleryImages.map(img => img.category))];
	const [activeCategory, setActiveCategory] = useState(t('gallery.categories.all'));

	const filteredImages = activeCategory === t('gallery.categories.all')
		? galleryImages 
		: galleryImages.filter(img => img.category === activeCategory);

	const openModal = (image, index) => {
		setSelectedImage(image);
		setCurrentImageIndex(index);
	};

	const closeModal = () => {
		setSelectedImage(null);
	};

	const navigateImage = (direction) => {
		const newIndex = direction === 'next' 
			? (currentImageIndex + 1) % filteredImages.length
			: currentImageIndex === 0 ? filteredImages.length - 1 : currentImageIndex - 1;
		
		setCurrentImageIndex(newIndex);
		setSelectedImage(filteredImages[newIndex]);
	};

	return (
		<section className="py-20 bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
						{t('gallery.title')}
					</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						{t('gallery.description')}
					</p>
				</div>

				{/* Category Filter */}
				<div className="flex flex-wrap justify-center gap-4 mb-12">
					{categories.map((category) => (
						<button
							key={category}
							onClick={() => setActiveCategory(category)}
							className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
								activeCategory === category
									? 'bg-emerald-600 text-white shadow-lg'
									: 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 border border-gray-200'
							}`}
						>
							{category}
						</button>
					))}
				</div>

				{/* Gallery Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{filteredImages.map((image, index) => (
						<div
							key={image.id}
							className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
							onClick={() => openModal(image, index)}
						>
							<div className="aspect-w-4 aspect-h-3 overflow-hidden">
								<img
									src={image.url}
									alt={image.title}
									className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
									loading="lazy"
								/>
							</div>
							<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<div className="absolute bottom-0 left-0 right-0 p-4 text-white">
									<h3 className="font-semibold text-lg mb-1">{image.title}</h3>
									<p className="text-sm text-gray-200">{image.description}</p>
								</div>
								<div className="absolute top-4 right-4">
									<ZoomIn className="w-6 h-6 text-white" />
								</div>
							</div>
							<div className="p-4">
								<span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
									{image.category}
								</span>
								<h3 className="font-semibold text-gray-900 mt-2 group-hover:text-emerald-600 transition-colors">
									{image.title}
								</h3>
							</div>
						</div>
					))}
				</div>

				{/* Modal for enlarged image */}
				{selectedImage && (
					<div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
						<div className="relative max-w-4xl max-h-full">
							<button
								onClick={closeModal}
								className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
							>
								<X className="w-8 h-8" />
							</button>
							
							<button
								onClick={() => navigateImage('prev')}
								className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
							>
								<ChevronLeft className="w-8 h-8" />
							</button>
							
							<button
								onClick={() => navigateImage('next')}
								className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
							>
								<ChevronRight className="w-8 h-8" />
							</button>

							<img
								src={selectedImage.url}
								alt={selectedImage.title}
								className="max-w-full max-h-full object-contain"
							/>
							
							<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
								<h3 className="text-2xl font-bold mb-2">{selectedImage.title}</h3>
								<p className="text-gray-200">{selectedImage.description}</p>
								<span className="inline-block mt-2 px-3 py-1 bg-emerald-600 text-white text-sm font-semibold rounded-full">
									{selectedImage.category}
								</span>
							</div>
						</div>
					</div>
				)}
			</div>
		</section>
	);
};

export default Gallery;
