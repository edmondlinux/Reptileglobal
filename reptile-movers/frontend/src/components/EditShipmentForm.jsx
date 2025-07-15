
import { useState, useEffect } from "react";
import { useShipmentStore } from "../stores/useShipmentStore";
import { Package, User, MapPin, Calendar, DollarSign, X } from "lucide-react";
import OpenStreetMap from "./OpenStreetMap";

const EditShipmentForm = ({ shipment, onClose, onUpdate }) => {
	const { updateShipmentStatus, loading } = useShipmentStore();
	const [coordinates, setCoordinates] = useState(shipment.coordinates || null);
	const [formData, setFormData] = useState({
		// Sender Information
		senderName: shipment.sender.name || "",
		senderEmail: shipment.sender.email || "",
		senderPhone: shipment.sender.phone || "",
		senderAddress: "",
		senderCity: "",
		senderState: "",
		senderZip: "",
		senderCountry: "",

		// Recipient Information
		recipientName: shipment.recipient.name || "",
		recipientEmail: shipment.recipient.email || "",
		recipientPhone: shipment.recipient.phone || "",
		recipientAddress: "",
		recipientCity: "",
		recipientState: "",
		recipientZip: "",
		recipientCountry: "",

		// Shipment Details
		packageType: shipment.packageDetails.type || "box",
		weight: shipment.packageDetails.weight || "",
		dimensions: {
			length: shipment.packageDetails.dimensions?.length || "",
			width: shipment.packageDetails.dimensions?.width || "",
			height: shipment.packageDetails.dimensions?.height || "",
		},
		value: shipment.packageDetails.value || "",
		description: shipment.packageDetails.description || "",
		specialInstructions: shipment.specialInstructions || "",

		// Shipping Options
		serviceType: shipment.serviceType || "standard",
		priority: shipment.priority || "normal",
		insurance: shipment.insurance || false,
		signatureRequired: shipment.signatureRequired || false,

		// Status and Location
		status: shipment.status || "pending",
		currentLocation: shipment.currentLocation || "",

		// Delivery Information
		shippingDate: shipment.shippingDate ? new Date(shipment.shippingDate).toISOString().split('T')[0] : "",
		estimatedDeliveryDate: shipment.estimatedDelivery ? new Date(shipment.estimatedDelivery).toISOString().split('T')[0] : "",
		shippingCost: shipment.shippingCost || "",
	});

	// Parse addresses on component mount
	useEffect(() => {
		// Parse sender address
		if (shipment.sender.address) {
			const senderParts = shipment.sender.address.split(', ');
			setFormData(prev => ({
				...prev,
				senderAddress: senderParts[0] || "",
				senderCity: senderParts[1] || "",
				senderState: senderParts[2]?.split(' ')[0] || "",
				senderZip: senderParts[2]?.split(' ')[1] || "",
				senderCountry: senderParts[3] || "",
			}));
		}

		// Parse recipient address
		if (shipment.recipient.address) {
			const recipientParts = shipment.recipient.address.split(', ');
			setFormData(prev => ({
				...prev,
				recipientAddress: recipientParts[0] || "",
				recipientCity: recipientParts[1] || "",
				recipientState: recipientParts[2]?.split(' ')[0] || "",
				recipientZip: recipientParts[2]?.split(' ')[1] || "",
				recipientCountry: recipientParts[3] || "",
			}));
		}
	}, [shipment]);

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;

		if (name.includes("dimensions.")) {
			const dimField = name.split(".")[1];
			setFormData((prev) => ({
				...prev,
				dimensions: {
					...prev.dimensions,
					[dimField]: value,
				},
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: type === "checkbox" ? checked : value,
			}));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		const updatedShipmentData = {
			sender: {
				name: formData.senderName,
				email: formData.senderEmail,
				phone: formData.senderPhone,
				address: `${formData.senderAddress}, ${formData.senderCity}, ${formData.senderState} ${formData.senderZip}, ${formData.senderCountry}`,
			},
			recipient: {
				name: formData.recipientName,
				email: formData.recipientEmail,
				phone: formData.recipientPhone,
				address: `${formData.recipientAddress}, ${formData.recipientCity}, ${formData.recipientState} ${formData.recipientZip}, ${formData.recipientCountry}`,
			},
			packageDetails: {
				type: formData.packageType,
				weight: parseFloat(formData.weight),
				dimensions: {
					length: parseFloat(formData.dimensions.length),
					width: parseFloat(formData.dimensions.width),
					height: parseFloat(formData.dimensions.height),
				},
				value: parseFloat(formData.value),
				description: formData.description,
			},
			serviceType: formData.serviceType,
			priority: formData.priority,
			insurance: formData.insurance,
			signatureRequired: formData.signatureRequired,
			specialInstructions: formData.specialInstructions,
			status: formData.status,
			currentLocation: formData.currentLocation,
			shippingDate: formData.shippingDate ? new Date(formData.shippingDate) : null,
			estimatedDelivery: formData.estimatedDeliveryDate ? new Date(formData.estimatedDeliveryDate) : null,
			shippingCost: parseFloat(formData.shippingCost) || 0,
			coordinates: coordinates ? {
				latitude: coordinates.latitude,
				longitude: coordinates.longitude
			} : null,
		};

		try {
			// You'll need to create an updateShipment function in your store
			await onUpdate(shipment._id, updatedShipmentData);
			onClose();
		} catch (error) {
			console.error("Failed to update shipment:", error);
		}
	};

	const statusOptions = [
		{ value: 'pending', label: 'Pending' },
		{ value: 'picked_up', label: 'Picked Up' },
		{ value: 'in_transit', label: 'In Transit' },
		{ value: 'out_for_delivery', label: 'Out for Delivery' },
		{ value: 'delivered', label: 'Delivered' },
		{ value: 'exception', label: 'Exception' }
	];

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
			<div className="bg-gray-900 rounded-lg p-6 w-full max-w-6xl max-h-[95vh] overflow-y-auto">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-2xl font-semibold text-emerald-400">
						Edit Shipment #{shipment.trackingNumber}
					</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-white p-2"
					>
						<X className="w-6 h-6" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-8">
					{/* Status Section */}
					<div className="bg-gray-800 rounded-lg p-6">
						<div className="flex items-center mb-4">
							<Package className="w-6 h-6 text-emerald-400 mr-2" />
							<h3 className="text-xl font-semibold text-emerald-400">
								Shipment Status
							</h3>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
								<select
									name="status"
									value={formData.status}
									onChange={handleInputChange}
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
									name="currentLocation"
									value={formData.currentLocation}
									onChange={handleInputChange}
									placeholder="Current location"
									className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
								/>
							</div>
						</div>
					</div>

					{/* Sender Information */}
					<div className="bg-gray-800 rounded-lg p-6">
						<div className="flex items-center mb-4">
							<User className="w-6 h-6 text-emerald-400 mr-2" />
							<h3 className="text-xl font-semibold text-emerald-400">
								Sender Information
							</h3>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<input
								type="text"
								name="senderName"
								value={formData.senderName}
								onChange={handleInputChange}
								placeholder="Full Name"
								className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
							<input
								type="email"
								name="senderEmail"
								value={formData.senderEmail}
								onChange={handleInputChange}
								placeholder="Email Address"
								className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
							<input
								type="tel"
								name="senderPhone"
								value={formData.senderPhone}
								onChange={handleInputChange}
								placeholder="Phone Number"
								className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
							<input
								type="text"
								name="senderAddress"
								value={formData.senderAddress}
								onChange={handleInputChange}
								placeholder="Street Address"
								className="md:col-span-2 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
							<input
								type="text"
								name="senderCity"
								value={formData.senderCity}
								onChange={handleInputChange}
								placeholder="City"
								className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
							<input
								type="text"
								name="senderState"
								value={formData.senderState}
								onChange={handleInputChange}
								placeholder="State/Province"
								className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
							<input
								type="text"
								name="senderZip"
								value={formData.senderZip}
								onChange={handleInputChange}
								placeholder="ZIP/Postal Code"
								className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
							<input
								type="text"
								name="senderCountry"
								value={formData.senderCountry}
								onChange={handleInputChange}
								placeholder="Country"
								className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
						</div>
					</div>

					{/* Recipient Information */}
					<div className="bg-gray-800 rounded-lg p-6">
						<div className="flex items-center mb-4">
							<MapPin className="w-6 h-6 text-emerald-400 mr-2" />
							<h3 className="text-xl font-semibold text-emerald-400">
								Recipient Information
							</h3>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<input
								type="text"
								name="recipientName"
								value={formData.recipientName}
								onChange={handleInputChange}
								placeholder="Full Name"
								className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
							<input
								type="email"
								name="recipientEmail"
								value={formData.recipientEmail}
								onChange={handleInputChange}
								placeholder="Email Address"
								className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
							<input
								type="tel"
								name="recipientPhone"
								value={formData.recipientPhone}
								onChange={handleInputChange}
								placeholder="Phone Number"
								className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
							<input
								type="text"
								name="recipientAddress"
								value={formData.recipientAddress}
								onChange={handleInputChange}
								placeholder="Street Address"
								className="md:col-span-2 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
							<input
								type="text"
								name="recipientCity"
								value={formData.recipientCity}
								onChange={handleInputChange}
								placeholder="City"
								className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
							<input
								type="text"
								name="recipientState"
								value={formData.recipientState}
								onChange={handleInputChange}
								placeholder="State/Province"
								className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
							<input
								type="text"
								name="recipientZip"
								value={formData.recipientZip}
								onChange={handleInputChange}
								placeholder="ZIP/Postal Code"
								className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
							<input
								type="text"
								name="recipientCountry"
								value={formData.recipientCountry}
								onChange={handleInputChange}
								placeholder="Country"
								className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
						</div>
					</div>

					{/* Package Details */}
					<div className="bg-gray-800 rounded-lg p-6">
						<div className="flex items-center mb-4">
							<Package className="w-6 h-6 text-emerald-400 mr-2" />
							<h3 className="text-xl font-semibold text-emerald-400">
								Package Details
							</h3>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<select
								name="packageType"
								value={formData.packageType}
								onChange={handleInputChange}
								className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
							>
								<option value="box">Box</option>
								<option value="envelope">Crate</option>
								<option value="tube">Container</option>
								<option value="pallet">Pallet</option>
								<option value="other">Other</option>
							</select>
							<input
								type="number"
								name="weight"
								value={formData.weight}
								onChange={handleInputChange}
								placeholder="Weight (lbs)"
								step="0.1"
								className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
							<input
								type="number"
								name="dimensions.length"
								value={formData.dimensions.length}
								onChange={handleInputChange}
								placeholder="Length (in)"
								step="0.1"
								className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
							<input
								type="number"
								name="dimensions.width"
								value={formData.dimensions.width}
								onChange={handleInputChange}
								placeholder="Width (in)"
								step="0.1"
								className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
							<input
								type="number"
								name="dimensions.height"
								value={formData.dimensions.height}
								onChange={handleInputChange}
								placeholder="Height (in)"
								step="0.1"
								className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
							<input
								type="number"
								name="value"
								value={formData.value}
								onChange={handleInputChange}
								placeholder="Declared Value ($)"
								step="0.01"
								className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
							<textarea
								name="description"
								value={formData.description}
								onChange={handleInputChange}
								placeholder="Package Description"
								rows="3"
								className="md:col-span-2 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
						</div>
					</div>

					{/* OpenStreetMap Component */}
					<div className="mt-8">
						<div className="bg-gray-800 rounded-lg p-6">
							<div className="flex items-center mb-4">
								<MapPin className="w-6 h-6 text-emerald-400 mr-2" />
								<h3 className="text-xl font-semibold text-emerald-400">
									Update Shipment Location
								</h3>
							</div>
							<OpenStreetMap 
								height="400px" 
								defaultZoom={2} 
								onCoordinatesChange={setCoordinates}
								selectedCoordinates={coordinates}
								interactive={true}
							/>
						</div>
					</div>

					{/* Shipping Options */}
					<div className="bg-gray-800 rounded-lg p-6">
						<div className="flex items-center mb-4">
							<DollarSign className="w-6 h-6 text-emerald-400 mr-2" />
							<h3 className="text-xl font-semibold text-emerald-400">
								Shipping Options
							</h3>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<select
								name="serviceType"
								value={formData.serviceType}
								onChange={handleInputChange}
								className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
							>
								<option value="standard">Standard</option>
								<option value="express">Express</option>
								<option value="overnight">Overnight</option>
								<option value="ground">Ground</option>
								<option value="international">International</option>
							</select>
							<select
								name="priority"
								value={formData.priority}
								onChange={handleInputChange}
								className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
							>
								<option value="low">Low</option>
								<option value="normal">Normal</option>
								<option value="high">High</option>
								<option value="urgent">Urgent</option>
							</select>
							<input
								type="number"
								name="shippingCost"
								value={formData.shippingCost}
								onChange={handleInputChange}
								placeholder="Shipping Cost ($)"
								step="0.01"
								className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
							<div className="space-y-2">
								<label className="block text-sm text-gray-400">Shipping Date</label>
								<input
									type="date"
									name="shippingDate"
									value={formData.shippingDate}
									onChange={handleInputChange}
									className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
								/>
							</div>
							<div className="space-y-2">
								<label className="block text-sm text-gray-400">Delivery Date</label>
								<input
									type="date"
									name="estimatedDeliveryDate"
									value={formData.estimatedDeliveryDate}
									onChange={handleInputChange}
									className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
								/>
							</div>
						</div>
						<div className="mt-4 space-y-2">
							<label className="flex items-center text-gray-300">
								<input
									type="checkbox"
									name="insurance"
									checked={formData.insurance}
									onChange={handleInputChange}
									className="mr-2 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
								/>
								Insurance Coverage
							</label>
							<label className="flex items-center text-gray-300">
								<input
									type="checkbox"
									name="signatureRequired"
									checked={formData.signatureRequired}
									onChange={handleInputChange}
									className="mr-2 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
								/>
								Signature Required
							</label>
						</div>
						<div className="mt-4">
							<textarea
								name="specialInstructions"
								value={formData.specialInstructions}
								onChange={handleInputChange}
								placeholder="Special Instructions / Notes"
								rows="3"
								className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
						</div>
					</div>

					{/* Submit Buttons */}
					<div className="flex justify-end gap-4">
						<button
							type="button"
							onClick={onClose}
							className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition duration-300"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							className="bg-emerald-600 hover:bg-emerald-700 px-8 py-3 rounded-lg font-semibold transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? "Updating Shipment..." : "Update Shipment"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditShipmentForm;
