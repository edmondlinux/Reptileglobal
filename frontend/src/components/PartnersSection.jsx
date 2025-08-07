
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const PartnersSection = () => {
	const { t } = useTranslation();
	
	const partners = [
		{
			name: "FedEx",
			logoUrl: "https://purepng.com/public/uploads/large/purepng.com-fedex-logologobrand-logoiconslogos-251519939539h7rji.png",
			alt: "FedEx Logo"
		},
		{
			name: "DHL",
			logoUrl: "https://www.citypng.com/public/uploads/preview/download-round-dhl-express-delivery-logo-icon-png-701751695035671nhorrw95xk.png?v=2025060419",
			alt: "DHL Logo"
		},
		{
			name: "UPS",
			logoUrl: "https://www.logodesignvalley.com/blog/wp-content/uploads/2023/06/04.png",
			alt: "UPS Logo"
		},
		{
			name: "Delta Cargo",
			logoUrl: "https://www.portseattle.org/sites/default/files/airline-logo/2017-12/DeltaCargoLogo_0.jpg",
			alt: "Delta Air Lines Logo"
		},
		{
			name: "Maersk",
			logoUrl: "https://www.maersk.com/~/media_sc9/maersk/assets/favicon/ogimage.png"
		},
		{
			name: "TNT",
			logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/TNT_Express_Logo.svg/2560px-TNT_Express_Logo.svg.png",
			alt: "TNT Logo"
		},
		{
			name: "USPS",
			logoUrl: "https://images.seeklogo.com/logo-png/28/2/usps-logo-png_seeklogo-289018.png"
		},
		{
			name: "Lufthansa Cargo",
			logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTH1cTIBn9NqccaSS77b5ICvmkh8s3AGbBn4w&s",
			alt: "Lufthansa Logo"
		}
	];

	return (
		<section className='py-16 bg-white border-b border-gray-100'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='text-center mb-12'>
					<h2 className='text-2xl md:text-3xl font-bold text-gray-900 mb-4'>
						{t('partners.title')}
					</h2>
					<p className='text-lg text-gray-600 max-w-2xl mx-auto'>
						{t('partners.description')}
					</p>
				</div>

				<div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6'>
					{partners.map((partner, index) => (
						<div
							key={index}
							className='bg-white rounded-xl p-6 border border-gray-100 flex flex-col items-center justify-center hover:shadow-lg hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1 group min-h-[120px]'
						>
							<div className='w-full h-12 flex items-center justify-center mb-3'>
								<img
									src={partner.logoUrl}
									alt={partner.alt}
									className='max-w-full max-h-full object-contain transition-all duration-300 group-hover:scale-105'
									loading="lazy"
									onError={(e) => {
										// Fallback to company name if image fails to load
										e.target.style.display = 'none';
										e.target.nextElementSibling.style.display = 'block';
									}}
								/>
								<div 
									className='hidden text-gray-600 font-semibold text-sm text-center'
								>
									{partner.name}
								</div>
							</div>
							<div className='text-gray-500 text-xs text-center font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
								{partner.name}
							</div>
						</div>
					))}
				</div>

				<div className='text-center mt-12'>
					<p className='text-gray-500 text-sm'>
						{t('partners.morePartners')}
					</p>
				</div>
			</div>
		</section>
	);
};

export default PartnersSection;
