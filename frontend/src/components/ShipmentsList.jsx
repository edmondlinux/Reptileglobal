
import { useEffect, useState } from "react";
import { useShipmentStore } from "../stores/useShipmentStore";
import { Package, Clock, CheckCircle, Truck, AlertCircle, MapPin, Edit, Eye } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import EditShipmentForm from "./EditShipmentForm";

const ShipmentsList = ({ isAdmin = false }) => {
	const { shipments, loading, getAllShipments, getUserShipments, updateShipmentStatus, updateShipment } = useShipmentStore();
	const [statusFilter, setStatusFilter] = useState("all");
	const [sortBy, setSortBy] = useState("createdAt");
	const [editingShipment, setEditingShipment] = useState(null);

	useEffect(() => {
		if (isAdmin) {
			getAllShipments();
		} else {
			getUserShipments();
		}
	}, [isAdmin, getAllShipments, getUserShipments]);

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

	// Ensure shipments is always an array
	const shipmentsArray = Array.isArray(shipments) ? shipments : (shipments?.shipments || []);
	
	const filteredShipments = shipmentsArray.filter(shipment => {
		if (statusFilter === "all") return true;
		return shipment.status === statusFilter;
	});

	const sortedShipments = [...filteredShipments].sort((a, b) => {
		switch (sortBy) {
			case 'createdAt':
				return new Date(b.createdAt) - new Date(a.createdAt);
			case 'trackingNumber':
				return a.trackingNumber.localeCompare(b.trackingNumber);
			case 'status':
				return a.status.localeCompare(b.status);
			default:
				return 0;
		}
	});

	const handleShipmentUpdate = async (shipmentId, shipmentData) => {
		try {
			await updateShipment(shipmentId, shipmentData);
			setEditingShipment(null);
		} catch (error) {
			console.error("Failed to update shipment:", error);
		}
	};

	if (loading) {
		return (
			<div className='flex justify-center items-center h-64'>
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Filters and Controls */}
			<div className="bg-gray-800 rounded-lg p-6">
				<div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
					<div className="flex flex-col sm:flex-row gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">Filter by Status</label>
							<select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
								className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
							>
								<option value="all">All Statuses</option>
								<option value="pending">Pending</option>
								<option value="picked_up">Picked Up</option>
								<option value="in_transit">In Transit</option>
								<option value="out_for_delivery">Out for Delivery</option>
								<option value="delivered">Delivered</option>
								<option value="exception">Exception</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">Sort by</label>
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
							>
								<option value="createdAt">Date Created</option>
								<option value="trackingNumber">Tracking Number</option>
								<option value="status">Status</option>
							</select>
						</div>
					</div>
					<div className="text-gray-300">
						<span className="text-emerald-400 font-semibold">{sortedShipments.length}</span> shipments found
					</div>
				</div>
			</div>

			{/* Shipments List */}
			{sortedShipments.length === 0 ? (
				<div className='bg-gray-800 rounded-lg p-8 text-center'>
					<Package className='w-16 h-16 text-gray-500 mx-auto mb-4' />
					<h2 className='text-xl font-semibold text-emerald-400 mb-2'>No Shipments Found</h2>
					<p className='text-gray-400'>No shipments match your current filters</p>
				</div>
			) : (
				<div className='space-y-4'>
					{sortedShipments.map((shipment) => (
						<div key={shipment._id} className='bg-gray-800 rounded-lg p-6'>
							<div className='flex flex-col lg:flex-row lg:items-center justify-between mb-4'>
								<div className="flex-1">
									<div className="flex items-center gap-4 mb-2">
										<h3 className='text-xl font-semibold text-emerald-400'>
											#{shipment.trackingNumber}
										</h3>
										<div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(shipment.status)}`}>
											{getStatusIcon(shipment.status)}
											<span className='font-medium capitalize text-sm'>
												{shipment.status.replace('_', ' ')}
											</span>
										</div>
									</div>
									<div className='text-sm text-gray-400'>
										Created: {new Date(shipment.createdAt).toLocaleDateString()} at {new Date(shipment.createdAt).toLocaleTimeString()}
									</div>
								</div>
								{isAdmin && (
									<div className="flex gap-2 mt-4 lg:mt-0">
										<button
											onClick={() => setEditingShipment(shipment)}
											className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-sm font-medium transition duration-300 flex items-center gap-2"
										>
											<Edit className="w-4 h-4" />
											Edit
										</button>
									</div>
								)}
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-4'>
								<div>
									<p className='text-gray-400 text-sm font-medium mb-1'>From:</p>
									<p className='font-medium text-white'>{shipment.sender.name}</p>
									<p className='text-sm text-gray-300'>{shipment.sender.email}</p>
									<p className='text-sm text-gray-300'>{shipment.sender.address}</p>
								</div>
								<div>
									<p className='text-gray-400 text-sm font-medium mb-1'>To:</p>
									<p className='font-medium text-white'>{shipment.recipient.name}</p>
									<p className='text-sm text-gray-300'>{shipment.recipient.email}</p>
									<p className='text-sm text-gray-300'>{shipment.recipient.address}</p>
								</div>
							</div>

							{/* Package Details */}
							{shipment.packageDetails && (
								<div className="mb-4 p-4 bg-gray-700 rounded-lg">
									<h4 className="text-emerald-400 font-medium mb-2">Package Details</h4>
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
										<div>
											<span className="text-gray-400">Type:</span>
											<p className="font-medium capitalize">{shipment.packageDetails.type}</p>
										</div>
										<div>
											<span className="text-gray-400">Weight:</span>
											<p className="font-medium">{shipment.packageDetails.weight} lbs</p>
										</div>
										<div>
											<span className="text-gray-400">Dimensions:</span>
											<p className="font-medium">
												{shipment.packageDetails.dimensions?.length} × {shipment.packageDetails.dimensions?.width} × {shipment.packageDetails.dimensions?.height} in
											</p>
										</div>
										<div>
											<span className="text-gray-400">Value:</span>
											<p className="font-medium">${shipment.packageDetails.value}</p>
										</div>
									</div>
									{shipment.packageDetails.description && (
										<div className="mt-2">
											<span className="text-gray-400">Description:</span>
											<p className="font-medium">{shipment.packageDetails.description}</p>
										</div>
									)}
								</div>
							)}

							{/* Current Status Info */}
							<div className="flex flex-col sm:flex-row gap-4 text-sm">
								{shipment.currentLocation && (
									<div>
										<span className='text-gray-400'>Current Location:</span>
										<p className='font-medium text-white'>{shipment.currentLocation}</p>
									</div>
								)}
								{shipment.estimatedDelivery && (
									<div>
										<span className='text-gray-400'>Estimated Delivery:</span>
										<p className='font-medium text-white'>{new Date(shipment.estimatedDelivery).toLocaleDateString()}</p>
									</div>
								)}
								{shipment.serviceType && (
									<div>
										<span className='text-gray-400'>Service:</span>
										<p className='font-medium text-white capitalize'>{shipment.serviceType}</p>
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			)}

			{/* Edit Modal */}
			{editingShipment && (
				<EditShipmentForm
					shipment={editingShipment}
					onUpdate={handleShipmentUpdate}
					onClose={() => setEditingShipment(null)}
				/>
			)}
		</div>
	);
};

export default ShipmentsList;
