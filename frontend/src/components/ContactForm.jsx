import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";
import axios from "../lib/axios";
import { useTranslation } from "../hooks/useTranslation";

const ContactForm = () => {
	const { t } = useTranslation();
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		subject: '',
		message: ''
	});

	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState(null); // 'success', 'error', or null

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setStatus(null);

		try {
			const response = await axios.post('/contact/send', formData);

			if (response.data.success) {
				setStatus('success');
				// Reset form
				setFormData({
					name: '',
					email: '',
					subject: '',
					message: ''
				});
			} else {
				setStatus('error');
			}
		} catch (error) {
			console.error('Error sending message:', error);
			setStatus('error');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='bg-gray-50 py-16'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='text-center mb-12'>
					<h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>{t('contactForm.title')}</h2>
					<p className='text-xl text-gray-600'>{t('contactForm.description')}</p>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
					{/* Contact Form */}
					<div className='bg-white rounded-xl p-8 shadow-lg'>
						<form onSubmit={handleSubmit}>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
								<div>
									<label className='block text-gray-700 font-semibold mb-2'>{t('contactForm.name')}</label>
									<input
										type="text"
										name="name"
										value={formData.name}
										onChange={handleChange}
										className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900'
										required
									/>
								</div>
								<div>
									<label className='block text-gray-700 font-semibold mb-2'>{t('contactForm.email')}</label>
									<input
										type="email"
										name="email"
										value={formData.email}
										onChange={handleChange}
										className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900'
										required
									/>
								</div>
							</div>
							<div className='mb-6'>
								<label className='block text-gray-700 font-semibold mb-2'>{t('contactForm.subject')}</label>
								<input
									type="text"
									name="subject"
									value={formData.subject}
									onChange={handleChange}
									className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900'
									required
								/>
							</div>
							<div className='mb-6'>
								<label className='block text-gray-700 font-semibold mb-2'>{t('contactForm.message')}</label>
								<textarea
									name="message"
									value={formData.message}
									onChange={handleChange}
									rows="5"
									className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900'
									required
								></textarea>
							</div>
							{/* Status Messages */}
							{status === 'success' && (
								<div className='mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center'>
									<CheckCircle className='w-5 h-5 mr-2' />
									{t('contactForm.success')}
								</div>
							)}

							{status === 'error' && (
								<div className='mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center'>
									<AlertCircle className='w-5 h-5 mr-2' />
									{t('contactForm.error')}
								</div>
							)}

							<button
								type="submit"
								disabled={loading}
								className='w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition duration-300 flex items-center justify-center'
							>
								{loading ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
										{t('contactForm.sending')}
									</>
								) : (
									<>
										<Send className='w-4 h-4 mr-2' />
										{t('contactForm.send')}
									</>
								)}
							</button>
						</form>
					</div>

					{/* Contact Info & Map */}
					<div>
						<div className='bg-white rounded-xl p-8 shadow-lg mb-6'>
							<h3 className='text-2xl font-bold text-gray-900 mb-6'>{t('contactForm.contactInfo')}</h3>
							<div className='space-y-4'>
								<div className='flex items-center'>
									<Phone className='w-6 h-6 text-emerald-600 mr-4' />
									<div>
										<p className='font-semibold text-gray-900'>{t('contactForm.phone')}</p>
										<p className='text-gray-600'>support@reptileglobal.site</p>
									</div>
								</div>
								<div className='flex items-center'>
									<Mail className='w-6 h-6 text-emerald-600 mr-4' />
									<div>
										<p className='font-semibold text-gray-900'>{t('contactForm.email')}</p>
										<p className='text-gray-600'>support@reptileglobal.site</p>
									</div>
								</div>
								<div className='flex items-center'>
									<MapPin className='w-6 h-6 text-emerald-600 mr-4' />
									<div>
										<p className='font-semibold text-gray-900'>{t('contactForm.address')}</p>
										<p className='text-gray-600'>REPTILE GLOBAL</p>
									</div>
								</div>
							</div>
						</div>

						{/* Map Placeholder */}
						<div className='bg-gray-300 rounded-xl h-64 flex items-center justify-center'>
							<div className='text-center'>
								<MapPin className='w-12 h-12 text-gray-500 mx-auto mb-2' />
								<p className='text-gray-600'>{t('contactForm.googleMap')}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ContactForm;