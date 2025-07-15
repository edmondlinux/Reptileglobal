
import { useEffect } from "react";
import { useShipmentStore } from "../stores/useShipmentStore";
import { useUserStore } from "../stores/useUserStore";
import { Package, Clock, CheckCircle, Truck, AlertCircle, MapPin } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router-dom";

const ShipmentsPage = () => {
	const { shipments, loading, getUserShipments } = useShipmentStore();
	const { user } = useUserStore();

	useEffect(() => {
		// Commented out user check for development
		// if (user) {
			getUserShipments();
		// }
	}, [getUserShipments]);

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
			case 'pending': return 'text-yellow-500';
			case 'picked_up': return 'text-blue-500';
			case 'in_transit': return 'text-orange-500';
			case 'out_for_delivery': return 'text-purple-500';
			case 'delivered': return 'text-green-500';
			case 'exception': return 'text-red-500';
			default: return 'text-gray-500';
		}
	};

	// Commented out for development - remove comments when authentication is ready
	// if (!user) {
	// 	return (
	// 		<div className='min-h-screen bg-gray-900 text-white pt-20'>
	// 			<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center'>
	// 				<Package className='w-16 h-16 text-gray-500 mx-auto mb-4' />
	// 				<h2 className='text-2xl font-semibold text-emerald-400 mb-4'>Sign In Required</h2>
	// 				<p className='text-gray-400 mb-6'>Please sign in to view your shipments</p>
	// 				<Link
	// 					to="/login"
	// 					className='bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300'
	// 				>
	// 					Sign In
	// 				</Link>
	// 			</div>
	// 		</div>
	// 	);
	// }

	return (
		<div className='min-h-screen bg-gray-900 text-white pt-20'>
			<div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<h1 className='text-4xl font-bold text-emerald-400 mb-8'>
					My Shipments
				</h1>

				{loading ? (
					<div className='flex justify-center items-center h-64'>
						<LoadingSpinner />
					</div>
				) : shipments.length === 0 ? (
					<div className='bg-gray-800 rounded-lg p-8 text-center'>
						<Package className='w-16 h-16 text-gray-500 mx-auto mb-4' />
						<h2 className='text-xl font-semibold text-emerald-400 mb-2'>No Shipments Found</h2>
						<p className='text-gray-400 mb-6'>You don't have any shipments yet</p>
						<Link
							to="/track"
							className='bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300'
						>
							Track a Package
						</Link>
					</div>
				) : (
					<div className='grid gap-6'>
						{shipments.map((shipment) => (
							<div key={shipment._id} className='bg-gray-800 rounded-lg p-6'>
								<div className='flex flex-col md:flex-row md:items-center justify-between mb-4'>
									<div>
										<h3 className='text-xl font-semibold text-emerald-400 mb-1'>
											#{shipment.trackingNumber}
										</h3>
										<div className='flex items-center gap-2'>
											{getStatusIcon(shipment.status)}
											<span className={`font-medium capitalize ${getStatusColor(shipment.status)}`}>
												{shipment.status.replace('_', ' ')}
											</span>
										</div>
									</div>
									<div className='text-right mt-4 md:mt-0'>
										<p className='text-sm text-gray-400'>Created</p>
										<p className='font-medium'>{new Date(shipment.createdAt).toLocaleDateString()}</p>
									</div>
								</div>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
									<div>
										<p className='text-gray-400 text-sm'>From:</p>
										<p className='font-medium'>{shipment.sender.name}</p>
										<p className='text-sm text-gray-300'>{shipment.sender.address}</p>
									</div>
									<div>
										<p className='text-gray-400 text-sm'>To:</p>
										<p className='font-medium'>{shipment.recipient.name}</p>
										<p className='text-sm text-gray-300'>{shipment.recipient.address}</p>
									</div>
								</div>

								{shipment.currentLocation && (
									<div className='mb-4'>
										<p className='text-gray-400 text-sm'>Current Location:</p>
										<p className='font-medium'>{shipment.currentLocation}</p>
									</div>
								)}

								{shipment.estimatedDelivery && (
									<div className='mb-4'>
										<p className='text-gray-400 text-sm'>Estimated Delivery:</p>
										<p className='font-medium'>{new Date(shipment.estimatedDelivery).toLocaleDateString()}</p>
									</div>
								)}

								<Link
									to={`/track?number=${shipment.trackingNumber}`}
									className='inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-300'
								>
									View Details
								</Link>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default ShipmentsPage;
