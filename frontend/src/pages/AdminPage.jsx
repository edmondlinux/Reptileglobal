
import { BarChart, Plus, Package, List, Search, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";


import AnalyticsTab from "../components/AnalyticsTab";
import CreateShipmentForm from "../components/CreateShipmentForm";
import ShipmentsList from "../components/ShipmentsList";
import { useShipmentStore } from "../stores/useShipmentStore";


const tabs = [
	{ id: "create", label: "Create Shipment", icon: Plus },
	{ id: "shipments", label: "All Shipments", icon: Package },
	{ id: "search", label: "Search & Edit", icon: Search },
	{ id: "analytics", label: "Analytics", icon: BarChart },
];

const AdminPage = () => {
	const [activeTab, setActiveTab] = useState("create");
	const { shipments, getAllShipments } = useShipmentStore();

	useEffect(() => {
		getAllShipments();
	}, [getAllShipments]);

	return (
		<div className='min-h-screen bg-gray-900 text-white relative overflow-hidden pt-20'>
			<div className='relative z-10 container mx-auto px-4 py-16'>
				<motion.h1
					className='text-4xl font-bold mb-8 text-emerald-400 text-center'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					Shipment Management Dashboard
				</motion.h1>

				<div className='flex justify-center mb-8 flex-wrap gap-2'>
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex items-center px-4 py-2 mx-1 rounded-md transition-colors duration-200 ${
								activeTab === tab.id
									? "bg-emerald-600 text-white"
									: "bg-gray-700 text-gray-300 hover:bg-gray-600"
							}`}
						>
							<tab.icon className='mr-2 h-5 w-5' />
							{tab.label}
						</button>
					))}
				</div>

				{activeTab === "create" && <CreateShipmentForm />}
				{activeTab === "shipments" && <ShipmentsList isAdmin={true} />}
				{activeTab === "search" && <SearchEditShipments />}
				{activeTab === "analytics" && <AnalyticsTab />}
			</div>
		</div>
	);
};

const SearchEditShipments = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedShipment, setSelectedShipment] = useState(null);
	const { shipments, trackShipment, updateShipmentStatus } = useShipmentStore();

	const filteredShipments = shipments.filter(shipment => 
		shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
		shipment.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		shipment.recipient.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleStatusUpdate = async (shipmentId, newStatus, location) => {
		try {
			await updateShipmentStatus(shipmentId, newStatus, location);
			setSelectedShipment(null);
		} catch (error) {
			console.error("Failed to update shipment:", error);
		}
	};

	return (
		<div className="space-y-6">
			<div className="bg-gray-800 rounded-lg p-6">
				<h3 className="text-xl font-semibold text-emerald-400 mb-4">Search Shipments</h3>
				<input
					type="text"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder="Search by tracking number, sender, or recipient..."
					className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
				/>
			</div>

			{searchTerm && (
				<div className="bg-gray-800 rounded-lg p-6">
					<h3 className="text-xl font-semibold text-emerald-400 mb-4">Search Results</h3>
					{filteredShipments.length === 0 ? (
						<p className="text-gray-400">No shipments found</p>
					) : (
						<div className="space-y-4">
							{filteredShipments.map((shipment) => (
								<div key={shipment._id} className="bg-gray-700 rounded-lg p-4">
									<div className="flex justify-between items-start">
										<div>
											<h4 className="font-semibold text-emerald-400">#{shipment.trackingNumber}</h4>
											<p className="text-sm text-gray-300">{shipment.sender.name} → {shipment.recipient.name}</p>
											<p className="text-sm text-gray-400 capitalize">{shipment.status.replace('_', ' ')}</p>
										</div>
										<button
											onClick={() => setSelectedShipment(shipment)}
											className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-sm transition duration-300"
										>
											Edit
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			)}

			{selectedShipment && (
				<div className="bg-gray-800 rounded-lg p-6">
					<h3 className="text-xl font-semibold text-emerald-400 mb-4">Edit Shipment #{selectedShipment.trackingNumber}</h3>
					<ShipmentEditForm 
						shipment={selectedShipment} 
						onUpdate={handleStatusUpdate}
						onCancel={() => setSelectedShipment(null)}
					/>
				</div>
			)}
		</div>
	);
};

const ShipmentEditForm = ({ shipment, onUpdate, onCancel }) => {
	const [status, setStatus] = useState(shipment.status);
	const [location, setLocation] = useState(shipment.currentLocation || "");

	const statusOptions = [
		{ value: 'pending', label: 'Pending' },
		{ value: 'picked_up', label: 'Picked Up' },
		{ value: 'in_transit', label: 'In Transit' },
		{ value: 'out_for_delivery', label: 'Out for Delivery' },
		{ value: 'delivered', label: 'Delivered' },
		{ value: 'exception', label: 'Exception' }
	];

	const handleSubmit = (e) => {
		e.preventDefault();
		onUpdate(shipment._id, status, location);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
					<select
						value={status}
						onChange={(e) => setStatus(e.target.value)}
						className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
					>
						{statusOptions.map(option => (
							<option key={option.value} value={option.value}>{option.label}</option>
						))}
					</select>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-300 mb-2">Current Location</label>
					<input
						type="text"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
						className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
						placeholder="Enter current location"
					/>
				</div>
			</div>
			<div className="flex gap-4">
				<button
					type="submit"
					className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-medium transition duration-300"
				>
					Update Shipment
				</button>
			
				<button
					type="button"
					onClick={onCancel}
					className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition duration-300"
				>
					Cancel
				</button>
			</div>
			
		</form>
	);
};

export default AdminPage;
