
const ServiceCard = ({ icon: Icon, title, description }) => {
	return (
		<div className='bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2'>
			<div className='w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mb-4'>
				<Icon className='w-8 h-8 text-emerald-600' />
			</div>
			<h3 className='text-xl font-semibold text-gray-900 mb-3'>{title}</h3>
			<p className='text-gray-600 leading-relaxed'>{description}</p>
		</div>
	);
};

export default ServiceCard;
