
const ProcessStep = ({ number, icon: Icon, title, description }) => {
	return (
		<div className='flex flex-col items-center text-center'>
			<div className='relative mb-4'>
				<div className='w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center'>
					<Icon className='w-10 h-10 text-white' />
				</div>
				<div className='absolute -top-2 -right-2 w-8 h-8 bg-emerald-800 rounded-full flex items-center justify-center'>
					<span className='text-white font-bold text-sm'>{number}</span>
				</div>
			</div>
			<h3 className='text-xl font-semibold text-gray-900 mb-2'>{title}</h3>
			<p className='text-gray-600 max-w-xs'>{description}</p>
		</div>
	);
};

export default ProcessStep;
