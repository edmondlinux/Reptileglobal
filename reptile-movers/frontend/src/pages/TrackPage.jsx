import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useShipmentStore } from "../stores/useShipmentStore";
import { Package, MapPin, Clock, CheckCircle, Truck, AlertCircle, User, DollarSign, Calendar, Shield, FileText, ArrowRight, Download } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import OpenStreetMap from "../components/OpenStreetMap";
import TrackingPDFGenerator from "../utils/TrackingPDFGenerator.js";
import { useTranslation } from 'react-i18next';

const TrackPage = () => {
	const location = useLocation();
	const [trackingNumber, setTrackingNumber] = useState("");
	const { currentShipment, loading, trackShipment, clearCurrentShipment } = useShipmentStore();
	const { t } = useTranslation();

	// Clear current shipment on component mount and unmount
	useEffect(() => {
		clearCurrentShipment();
		return () => {
			clearCurrentShipment();
		};
	}, [clearCurrentShipment]);

	// Handle tracking number from navigation state (from home page QuickTrack) or URL query params
	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const trackingNumberFromUrl = urlParams.get('trackingNumber');
		
		if (location.state?.trackingNumber) {
			setTrackingNumber(location.state.trackingNumber);
			// Auto-track the shipment
			trackShipment(location.state.trackingNumber);
		} else if (trackingNumberFromUrl) {
			setTrackingNumber(trackingNumberFromUrl);
			// Auto-track the shipment
			trackShipment(trackingNumberFromUrl);
		}
	}, [location.state, location.search, trackShipment]);

	// Clear current shipment when tracking number changes
	useEffect(() => {
		if (trackingNumber.trim() === "") {
			clearCurrentShipment();
		}
	}, [trackingNumber, clearCurrentShipment]);

	const handleTrack = async (e) => {
		e.preventDefault();
		if (!trackingNumber.trim()) return;

		// Clear previous results before tracking new shipment
		clearCurrentShipment();

		try {
			await trackShipment(trackingNumber.trim());
		} catch (error) {
			// Error handling is done in the store
		}
	};

	const getStatusIcon = (status) => {
		switch (status) {
			case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
			case 'picked_up': return <Package className="w-5 h-5 text-blue-500" />;
			case 'in_transit': return <Truck className="w-5 h-5 text-orange-500" />;
			case 'out_for_delivery': return <MapPin className="w-5 h-5 text-purple-500" />;
			case 'delivered': return <CheckCircle className="w-5 h-5 text-green-500" />;
			case 'exception': return <AlertCircle className="w-5 h-5 text-red-500" />;
			default: return <Package className="w-5 h-5 text-gray-500" />;
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case 'pending': return 'text-yellow-500 bg-yellow-500/10';
			case 'picked_up': return 'text-blue-500 bg-blue-500/10';
			case 'in_transit': return 'text-orange-500 bg-orange-500/10';
			case 'out_for_delivery': return 'text-purple-500 bg-purple-500/10';
			case 'delivered': return 'text-green-500 bg-green-500/10';
			case 'exception': return 'text-red-500 bg-red-500/10';
			default: return 'text-gray-500 bg-gray-500/10';
		}
	};

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(amount);
	};

	const handleDownloadPDF = () => {
		if (!currentShipment) return;

		try {
			const pdfGenerator = new TrackingPDFGenerator();
			pdfGenerator.downloadPDF(currentShipment);
		} catch (error) {
			console.error('Error generating PDF:', error);
			// You might want to show a toast notification here
		}
	};

	return (
		<div className='min-h-screen bg-gray-900 text-white pt-20'>
			<div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				<div className='text-center mb-12'>
					<h1 className='text-4xl font-bold text-emerald-400 mb-3'>
						{t('tracking.title')}
					</h1>
					<p className='text-gray-400 text-lg'>{t('tracking.subtitle')}</p>
				</div>

				{/* Search Form */}
				<div className='bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-6 mb-8 shadow-xl'>
					<form onSubmit={handleTrack} className='flex gap-4'>
						<div className='flex-1 relative'>
							<input
								type="text"
								value={trackingNumber}
								onChange={(e) => setTrackingNumber(e.target.value)}
								placeholder={t('hero.enterTracking')}
								className='w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all'
							/>
						</div>
						<button 
							type="submit"
							disabled={loading}
							className='bg-emerald-600 hover:bg-emerald-700 px-8 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-emerald-500/25'
						>
							{loading ? <LoadingSpinner /> : (
								<>
									{t('hero.trackNow')}
									<ArrowRight className="w-4 h-4" />
								</>
							)}
						</button>
					</form>

					{currentShipment && (
						<div className='flex items-center gap-3'>
							<button
								onClick={handleDownloadPDF}
								className='bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-blue-500/25'
							>
								<Download className="w-4 h-4" />
								{t('tracking.downloadPDF')}
							</button>
							<button
								onClick={() => {
									clearCurrentShipment();
									setTrackingNumber("");
								}}
								className='text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors'
							>
								{t('tracking.clearResults')}
							</button>
						</div>
					)}
				</div>

				{/* Complete Shipment Details */}
				{currentShipment && (
					<div className='space-y-6'>
						{/* Status Header */}
						<div className='bg-gradient-to-r from-gray-800/80 to-gray-800/60 backdrop-blur border border-gray-700/50 rounded-xl p-8 shadow-xl'>
							<div className='flex items-center justify-between mb-6'>
								<div>
									<h2 className='text-2xl font-bold text-white mb-2'>
										{currentShipment.trackingNumber}
									</h2>
									<p className='text-gray-400'>{t('tracking.trackingNumber')}</p>
								</div>

								<div className={`px-4 py-2 rounded-full ${getStatusColor(currentShipment.status)} border`}>
									<div className='flex items-center gap-2'>
										{getStatusIcon(currentShipment.status)}
										<span className='font-semibold capitalize'>
											{currentShipment.status.replace('_', ' ')}
										</span>
									</div>
								</div>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								{currentShipment.currentLocation && (
									<div className='flex items-center gap-3 p-4 bg-gray-700/30 rounded-lg'>
										<MapPin className="w-5 h-5 text-emerald-400" />
										<div>
											<p className='text-sm text-gray-400'>{t('tracking.currentLocation')}</p>
											<p className='font-medium text-white'>{currentShipment.currentLocation}</p>
										</div>
									</div>
								)}

								{currentShipment.estimatedDelivery && (
									<div className='flex items-center gap-3 p-4 bg-gray-700/30 rounded-lg'>
										<Calendar className="w-5 h-5 text-emerald-400" />
										<div>
											<p className='text-sm text-gray-400'>{t('tracking.estimatedDelivery')}</p>
											<p className='font-medium text-white'>{new Date(currentShipment.estimatedDelivery).toLocaleDateString()}</p>
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Sender and Recipient Information */}
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
							<div className='bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-6 shadow-lg'>
								<div className='flex items-center gap-3 mb-4'>
									<div className='p-2 bg-blue-500/20 rounded-lg'>
										<User className="w-5 h-5 text-blue-400" />
									</div>
									<h3 className='text-lg font-semibold text-blue-400'>{t('tracking.from')}</h3>
								</div>
								<div className='space-y-2'>
									<p className='font-medium text-white text-lg'>{currentShipment.sender.name}</p>
									<p className='text-gray-300'>{currentShipment.sender.email}</p>
									<p className='text-gray-300'>{currentShipment.sender.phone}</p>
									<div className='pt-2 border-t border-gray-700'>
										<p className='text-sm text-gray-400 leading-relaxed'>{currentShipment.sender.address}</p>
									</div>
								</div>
							</div>

							<div className='bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-6 shadow-lg'>
								<div className='flex items-center gap-3 mb-4'>
									<div className='p-2 bg-green-500/20 rounded-lg'>
										<User className="w-5 h-5 text-green-400" />
									</div>
									<h3 className='text-lg font-semibold text-green-400'>{t('tracking.to')}</h3>
								</div>
								<div className='space-y-2'>
									<p className='font-medium text-white text-lg'>{currentShipment.recipient.name}</p>
									<p className='text-gray-300'>{currentShipment.recipient.email}</p>
									<p className='text-gray-300'>{currentShipment.recipient.phone}</p>
									<div className='pt-2 border-t border-gray-700'>
										<p className='text-sm text-gray-400 leading-relaxed'>{currentShipment.recipient.address}</p>
									</div>
								</div>
							</div>
						</div>

						{/* Package & Service Details */}
						<div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
							{/* Package Details */}
							<div className='bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-6 shadow-lg'>
								<div className='flex items-center gap-3 mb-6'>
									<div className='p-2 bg-emerald-500/20 rounded-lg'>
										<Package className="w-5 h-5 text-emerald-400" />
									</div>
									<h3 className='text-lg font-semibold text-emerald-400'>{t('tracking.packageDetails')}</h3>
								</div>

								<div className='space-y-4'>
									<div className='grid grid-cols-2 gap-4'>
										<div>
											<p className='text-xs text-gray-400 uppercase tracking-wide mb-1'>Description</p>
											<p className='font-medium text-white'>{currentShipment.packageDetails.description}</p>
										</div>
										<div>
											<p className='text-xs text-gray-400 uppercase tracking-wide mb-1'>Category</p>
											<p className='font-medium text-white capitalize'>{currentShipment.packageDetails.category}</p>
										</div>
									</div>

									<div className='grid grid-cols-2 gap-4'>
										<div>
											<p className='text-xs text-gray-400 uppercase tracking-wide mb-1'>Weight</p>
											<p className='font-medium text-white'>{currentShipment.packageDetails.weight} {currentShipment.packageDetails.weightUnit}</p>
										</div>
										<div>
											<p className='text-xs text-gray-400 uppercase tracking-wide mb-1'>Value</p>
											<p className='font-medium text-white'>{formatCurrency(currentShipment.packageDetails.value)}</p>
										</div>
									</div>

									<div className='grid grid-cols-2 gap-4'>
										<div>
											<p className='text-xs text-gray-400 uppercase tracking-wide mb-1'>Dimensions</p>
											<p className='font-medium text-white text-sm'>
												{currentShipment.packageDetails.dimensions.length} × {currentShipment.packageDetails.dimensions.width} × {currentShipment.packageDetails.dimensions.height} {currentShipment.packageDetails.dimensionUnit}
											</p>
										</div>
										<div>
											<p className='text-xs text-gray-400 uppercase tracking-wide mb-1'>Fragile</p>
											<p className={`font-medium ${currentShipment.packageDetails.fragile ? 'text-red-400' : 'text-gray-300'}`}>
												{currentShipment.packageDetails.fragile ? 'Yes ⚠️' : 'No'}
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* Service Details */}
							<div className='bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-6 shadow-lg'>
								<div className='flex items-center gap-3 mb-6'>
									<div className='p-2 bg-emerald-500/20 rounded-lg'>
										<Truck className="w-5 h-5 text-emerald-400" />
									</div>
									<h3 className='text-lg font-semibold text-emerald-400'>{t('tracking.serviceDetails')}</h3>
								</div>

								<div className='space-y-4'>
									<div className='grid grid-cols-2 gap-4'>
										<div>
											<p className='text-xs text-gray-400 uppercase tracking-wide mb-1'>Service Type</p>
											<p className='font-medium text-white capitalize'>{currentShipment.serviceType}</p>
										</div>
										<div>
											<p className='text-xs text-gray-400 uppercase tracking-wide mb-1'>Priority</p>
											<p className='font-medium text-white capitalize'>{currentShipment.priority}</p>
										</div>
									</div>

									<div className='grid grid-cols-2 gap-4'>
										<div>
											<p className='text-xs text-gray-400 uppercase tracking-wide mb-1'>Shipping Cost</p>
											<p className='font-medium text-white'>{formatCurrency(currentShipment.shippingCost)}</p>
										</div>
										<div>
											<p className='text-xs text-gray-400 uppercase tracking-wide mb-1'>Insurance</p>
											<p className='font-medium text-white'>{currentShipment.insurance ? formatCurrency(currentShipment.insurance.amount) : 'None'}</p>
										</div>
									</div>

									<div className='grid grid-cols-2 gap-4'>
										<div>
											<p className='text-xs text-gray-400 uppercase tracking-wide mb-1'>Shipping Date</p>
											<p className='font-medium text-white'>{new Date(currentShipment.shippingDate).toLocaleDateString()}</p>
										</div>
										<div>
											<p className='text-xs text-gray-400 uppercase tracking-wide mb-1'>Signature Required</p>
											<p className='font-medium text-white'>{currentShipment.signatureRequired ? 'Yes ✓' : 'No'}</p>
										</div>
									</div>

									{currentShipment.specialInstructions && (
										<div className='pt-4 border-t border-gray-700'>
											<p className='text-xs text-gray-400 uppercase tracking-wide mb-2'>Special Instructions</p>
											<p className='font-medium text-white text-sm leading-relaxed'>{currentShipment.specialInstructions}</p>
										</div>
									)}
								</div>
							</div>
						</div>

						{/* Location Map */}
						{currentShipment.coordinates && (
							<div className='bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-6 shadow-lg'>
								<div className='flex items-center gap-3 mb-4'>
									<div className='p-2 bg-emerald-500/20 rounded-lg'>
										<MapPin className="w-5 h-5 text-emerald-400" />
									</div>
									<h3 className='text-lg font-semibold text-emerald-400'>{t('tracking.currentLocation')}</h3>
								</div>
								<div className='rounded-lg overflow-hidden'>
									<OpenStreetMap 
										height="400px"
										defaultZoom={10}
										selectedCoordinates={currentShipment.coordinates}
									/>
								</div>
							</div>
						)}

						{/* Tracking History */}
						{currentShipment.trackingHistory && currentShipment.trackingHistory.length > 0 && (
							<div className='bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-6 shadow-lg'>
								<div className='flex items-center gap-3 mb-6'>
									<div className='p-2 bg-emerald-500/20 rounded-lg'>
										<Clock className="w-5 h-5 text-emerald-400" />
									</div>
									<h3 className='text-lg font-semibold text-emerald-400'>{t('tracking.history')}</h3>
								</div>
								<div className='space-y-3'>
									{currentShipment.trackingHistory.map((event, index) => (
										<div key={index} className='relative'>
											{index !== currentShipment.trackingHistory.length - 1 && (
												<div className='absolute left-6 top-12 w-0.5 h-full bg-gray-600'></div>
											)}
											<div className='flex items-start gap-4 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors'>
												<div className='p-2 bg-gray-800 rounded-lg border-2 border-gray-600'>
													{getStatusIcon(event.status)}
												</div>
												<div className='flex-1 min-w-0'>
													<div className='flex items-center justify-between mb-1'>
														<p className='font-semibold capitalize text-white'>{event.status.replace('_', ' ')}</p>
														<p className='text-xs text-gray-400'>
															{new Date(event.timestamp).toLocaleString()}
														</p>
													</div>
													<p className='text-gray-300 mb-1'>{event.location}</p>
													{event.notes && (
														<p className='text-sm text-gray-400 leading-relaxed'>{event.notes}</p>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				)}

				{/* No results message */}
				{!currentShipment && !loading && trackingNumber && (
					<div className='bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-12 text-center shadow-lg'>
						<Package className='w-16 h-16 text-gray-500 mx-auto mb-4' />
						<h3 className='text-xl font-semibold text-gray-300 mb-2'>{t('tracking.notFound')}</h3>
						<p className='text-gray-400'>{t('tracking.checkNumber')}</p>
					</div>
				)}

				{/* Empty state */}
				{!currentShipment && !loading && !trackingNumber && (
					<div className='bg-gray-800/30 backdrop-blur border border-gray-700/30 rounded-xl p-12 text-center'>
						<Package className='w-20 h-20 text-gray-600 mx-auto mb-4' />
						<h3 className='text-xl font-semibold text-gray-400 mb-2'>{t('tracking.readyToTrack')}</h3>
						<p className='text-gray-500'>{t('tracking.enterNumber')}</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default TrackPage;