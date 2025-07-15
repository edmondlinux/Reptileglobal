
const FeatureCard = ({ icon: Icon, title, description }) => {
	return (
		<div className='text-center p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg transition duration-300'>
			<div className='w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4'>
				<Icon className='w-8 h-8 text-white' />
			</div>
			<h3 className='text-xl font-semibold text-gray-900 mb-2'>{title}</h3>
			<p className='text-gray-600'>{description}</p>
		</div>
	);
};

export default FeatureCard;
