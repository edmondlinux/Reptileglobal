import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useShipmentStore = create((set, get) => ({
	shipments: [],
	currentShipment: null,
	loading: false,

	// Track a shipment by tracking number
	trackShipment: async (trackingNumber) => {
		set({ loading: true, currentShipment: null }); // Clear previous shipment
		try {
			const res = await axios.get(`/shipments/track/${trackingNumber}`);
			set({ currentShipment: res.data, loading: false });
			return res.data;
		} catch (error) {
			set({ loading: false, currentShipment: null });
			toast.error(error.response?.data?.message || "Shipment not found");
			throw error;
		}
	},

	// Get all shipments for logged in user
	getUserShipments: async () => {
		set({ loading: true });
		try {
			const res = await axios.get("/shipments/user");
			set({ shipments: res.data, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to fetch shipments");
		}
	},

	// Generate a new tracking number
	generateTrackingNumber: async () => {
		try {
			const res = await axios.get("/shipments/generate-tracking");
			return res.data.trackingNumber;
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to generate tracking number");
			throw error;
		}
	},

	// Create a new shipment
	createShipment: async (shipmentData) => {
		set({ loading: true });
		try {
			const res = await axios.post("/shipments", shipmentData);
			set((state) => ({
				shipments: [res.data, ...Array.from(state.shipments || [])],
				loading: false
			}));
			toast.success(`Shipment created successfully! Tracking #: ${res.data.trackingNumber}`);
			return res.data;
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to create shipment");
			throw error;
		}
	},

	// Update shipment status (admin only)
	updateShipmentStatus: async (shipmentId, status, location) => {
		set({ loading: true });
		try {
			const res = await axios.put(`/shipments/${shipmentId}/status`, { status, location });
			set((state) => ({
				shipments: Array.from(state.shipments || []).map(shipment => 
					shipment._id === shipmentId ? res.data : shipment
				),
				currentShipment: state.currentShipment?._id === shipmentId ? res.data : state.currentShipment,
				loading: false
			}));
			toast.success("Shipment status updated");
			return res.data;
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to update shipment");
			throw error;
		}
	},

	// Update entire shipment (admin only)
	updateShipment: async (shipmentId, shipmentData) => {
		set({ loading: true });
		try {
			const res = await axios.put(`/shipments/${shipmentId}`, shipmentData);
			set((state) => ({
				shipments: Array.from(state.shipments || []).map(shipment => 
					shipment._id === shipmentId ? res.data : shipment
				),
				currentShipment: state.currentShipment?._id === shipmentId ? res.data : state.currentShipment,
				loading: false
			}));
			toast.success("Shipment updated successfully");
			return res.data;
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to update shipment");
			throw error;
		}
	},

	// Get all shipments (admin only)
	getAllShipments: async () => {
		set({ loading: true });
		try {
			const res = await axios.get("/shipments/admin/all");
			// Extract shipments array from response if it's in pagination format
			const shipmentsData = res.data.shipments || res.data;
			set({ shipments: shipmentsData, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to fetch all shipments");
		}
	},

	// Clear current shipment
	clearCurrentShipment: () => {
		set({ currentShipment: null });
	},
}));