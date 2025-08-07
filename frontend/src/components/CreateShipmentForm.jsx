import { useState, useEffect } from "react";
import { useShipmentStore } from "../stores/useShipmentStore";
import { Package, User, MapPin, Calendar, DollarSign } from "lucide-react";
import OpenStreetMap from "./OpenStreetMap";



const CreateShipmentForm = () => {
	const { createShipment, generateTrackingNumber, loading } = useShipmentStore();
	const [coordinates, setCoordinates] = useState(null);
	const [generatedTrackingNumber, setGeneratedTrackingNumber] = useState(null);
	const [formData, setFormData] = useState({
		// Sender Information
		senderName: "",
		senderEmail: "",
		senderPhone: "",
		senderAddress: "",
		senderCity: "",
		senderState: "",
		senderZip: "",
		senderCountry: "",

		// Recipient Information
		recipientName: "",
		recipientEmail: "",
		recipientPhone: "",
		recipientAddress: "",
		recipientCity: "",
		recipientState: "",
		recipientZip: "",
		recipientCountry: "",

		// Shipment Details
		packageType: "box",
		weight: "",
		dimensions: {
			length: "",
			width: "",
			height: "",
		},
		value: "",
		description: "",
		specialInstructions: "",

		// Shipping Options
		serviceType: "standard",
		priority: "normal",
		insurance: false,
		signatureRequired: false,

		// Delivery Information
		shippingDate: "",
		estimatedDeliveryDate: "",
		shippingCost: "",
	});

	useEffect(() => {
		const generateInitialTrackingNumber = async () => {
			try {
				const trackingNumber = await generateTrackingNumber();
				setGeneratedTrackingNumber(trackingNumber);
			} catch (error) {
				console.error("Failed to generate tracking number:", error);
			}
		};

		generateInitialTrackingNumber();
	}, [generateTrackingNumber]);
	
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
    
		
		const shipmentData = {
			trackingNumber: generatedTrackingNumber,
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
			shippingDate: formData.shippingDate
				? new Date(formData.shippingDate)
				: null,
			estimatedDeliveryDate: formData.estimatedDeliveryDate
				? new Date(formData.estimatedDeliveryDate)
				: null,
			shippingCost: parseFloat(formData.shippingCost) || 0,
			coordinates: coordinates ? {
				latitude: coordinates.latitude,
				longitude: coordinates.longitude
			} : null,
		};

		try {
			const createdShipment = await createShipment(shipmentData);
			// Generate a new tracking number for the next shipment
			const newTrackingNumber = await generateTrackingNumber();
			setGeneratedTrackingNumber(newTrackingNumber);
			// Reset form
			setFormData({
				senderName: "",
				senderEmail: "",
				senderPhone: "",
				senderAddress: "",
				senderCity: "",
				senderState: "",
				senderZip: "",
				senderCountry: "",
				recipientName: "",
				recipientEmail: "",
				recipientPhone: "",
				recipientAddress: "",
				recipientCity: "",
				recipientState: "",
				recipientZip: "",
				recipientCountry: "",
				packageType: "box",
				weight: "",
				dimensions: { length: "", width: "", height: "" },
				value: "",
				description: "",
				specialInstructions: "",
				serviceType: "standard",
				priority: "normal",
				insurance: false,
				signatureRequired: false,
				estimatedDeliveryDate: "",
				shippingCost: "",
			});
			setCoordinates(null);
		} catch (error) {
			console.error("Failed to create shipment:", error);
		}
	};

	return (
		
		<div className="max-w-6xl mx-auto">
			<div className="mb-6">
				<h2 className="text-2xl font-semibold text-emerald-400"> 
					Tracking Number: {generatedTrackingNumber ? (
						<span className="text-white bg-emerald-600 px-3 py-1 rounded-md font-mono text-lg">
							{generatedTrackingNumber}
						</span>
					) : (
						<span className="text-gray-400">Generating...</span>
					)}
				</h2>
				{generatedTrackingNumber && (
					<p className="text-sm text-gray-400 mt-2">
						📋 This tracking number has been pre-generated for this shipment. Fill out the form below to complete the shipment creation.
					</p>
				)}
			</div>
			<form onSubmit={handleSubmit} className="space-y-8">
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
							placeholder="Full Name "
						
							className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
						/>
						<input
							type="email"
							name="senderEmail"
							value={formData.senderEmail}
							onChange={handleInputChange}
							placeholder="Email Address "
							
							className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
						/>
						<input
							type="tel"
							name="senderPhone"
							value={formData.senderPhone}
							onChange={handleInputChange}
							placeholder="Phone Number "
							
							className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
						/>
						<input
							type="text"
							name="senderAddress"
							value={formData.senderAddress}
							onChange={handleInputChange}
							placeholder="Street Address "
							
							className="md:col-span-2 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
						/>
						<input
							type="text"
							name="senderCity"
							value={formData.senderCity}
							onChange={handleInputChange}
							placeholder="City "
							
							className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
						/>
						<input
							type="text"
							name="senderState"
							value={formData.senderState}
							onChange={handleInputChange}
							placeholder="State/Province "
							
							className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
						/>
						<input
							type="text"
							name="senderZip"
							value={formData.senderZip}
							onChange={handleInputChange}
							placeholder="ZIP/Postal Code "
						
							className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
						/>
						<input
							type="text"
							name="senderCountry"
							value={formData.senderCountry}
							onChange={handleInputChange}
							placeholder="Country "
							
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
							placeholder="Full Name *"
							required
							className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
						/>
						<input
							type="email"
							name="recipientEmail"
							value={formData.recipientEmail}
							onChange={handleInputChange}
							placeholder="Email Address *"
							required
							className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
						/>
						<input
							type="tel"
							name="recipientPhone"
							value={formData.recipientPhone}
							onChange={handleInputChange}
							placeholder="Phone Number "
							
							className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
						/>
						<input
							type="text"
							name="recipientAddress"
							value={formData.recipientAddress}
							onChange={handleInputChange}
							placeholder="Street Address "
							required
							className="md:col-span-2 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
						/>
						<input
							type="text"
							name="recipientCity"
							value={formData.recipientCity}
							onChange={handleInputChange}
							placeholder="City "
							
							className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
						/>
						<input
							type="text"
							name="recipientState"
							value={formData.recipientState}
							onChange={handleInputChange}
							placeholder="State/Province "
							
							className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
						/>
						<input
							type="text"
							name="recipientZip"
							value={formData.recipientZip}
							onChange={handleInputChange}
							placeholder="ZIP/Postal Code *"
							
							className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
						/>
						<input
							type="text"
							name="recipientCountry"
							value={formData.recipientCountry}
							onChange={handleInputChange}
							placeholder="Country *"
							required
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
							placeholder="Weight (lbs) *"
							required
							step="0.1"
							className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
						/>
						<input
							type="number"
							name="dimensions.length"
							value={formData.dimensions.length}
							onChange={handleInputChange}
							placeholder="Length (in) *"
							required
							step="0.1"
							className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
						/>
						<input
							type="number"
							name="dimensions.width"
							value={formData.dimensions.width}
							onChange={handleInputChange}
							placeholder="Width (in) *"
							required
							step="0.1"
							className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
						/>
						<input
							type="number"
							name="dimensions.height"
							value={formData.dimensions.height}
							onChange={handleInputChange}
							placeholder="Height (in) *"
							required
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
							placeholder="Package Description *"
							required
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
								Select Shipment Location
							</h3>
						</div>
						<OpenStreetMap 
							height="500px" 
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
						<p className="text-gray-400 text-sm">Shipping date</p>
						<input
							type="date"
							name="shippingDate"
							value={formData.shippingDate}
							onChange={handleInputChange}
							className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
						/>
						<p className="text-gray-400 text-sm">Delivery date</p>
						<input
							type="date"
							name="estimatedDeliveryDate"
							value={formData.estimatedDeliveryDate}
							onChange={handleInputChange}
							className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
						/>
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

				{/* Submit Button */}
				<div className="flex justify-center">
					<button
						type="submit"
						disabled={loading}
						className="bg-emerald-600 hover:bg-emerald-700 px-8 py-3 rounded-lg font-semibold text-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? "Creating Shipment..." : "Create Shipment"}
					</button>
				</div>
			</form>
			
			
		</div>
	);
};

export default CreateShipmentForm;
