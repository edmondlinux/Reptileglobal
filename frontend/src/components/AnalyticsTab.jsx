
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const AnalyticsTab = () => {
	const [analyticsData, setAnalyticsData] = useState({
		totalShipments: 0,
		pendingShipments: 0,
		inTransitShipments: 0,
		deliveredShipments: 0,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [shipmentsByStatus, setShipmentsByStatus] = useState([]);
	const [dailyShipmentsData, setDailyShipmentsData] = useState([]);

	useEffect(() => {
		const fetchAnalyticsData = async () => {
			try {
				const response = await axios.get("/shipments/admin/all");
				const shipments = response.data.shipments || response.data;

				// Calculate analytics from shipments
				const analytics = {
					totalShipments: shipments.length,
					pendingShipments: shipments.filter(s => s.status === 'pending').length,
					inTransitShipments: shipments.filter(s => ['picked_up', 'in_transit', 'out_for_delivery'].includes(s.status)).length,
					deliveredShipments: shipments.filter(s => s.status === 'delivered').length,
				};

				// Group shipments by status for pie chart
				const statusCounts = {};
				shipments.forEach(shipment => {
					statusCounts[shipment.status] = (statusCounts[shipment.status] || 0) + 1;
				});

				const statusData = Object.entries(statusCounts).map(([status, count]) => ({
					name: status.replace('_', ' ').toUpperCase(),
					value: count,
					status: status
				}));

				// Group shipments by creation date for line chart
				const dailyData = {};
				shipments.forEach(shipment => {
					const date = new Date(shipment.createdAt).toISOString().split('T')[0];
					if (!dailyData[date]) {
						dailyData[date] = { date, shipments: 0, delivered: 0 };
					}
					dailyData[date].shipments++;
					if (shipment.status === 'delivered') {
						dailyData[date].delivered++;
					}
				});

				const sortedDailyData = Object.values(dailyData)
					.sort((a, b) => new Date(a.date) - new Date(b.date))
					.slice(-7) // Last 7 days
					.map(item => ({
						name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
						shipments: item.shipments,
						delivered: item.delivered
					}));

				setAnalyticsData(analytics);
				setShipmentsByStatus(statusData);
				setDailyShipmentsData(sortedDailyData);
			} catch (error) {
				console.error("Error fetching analytics data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAnalyticsData();
	}, []);

	if (isLoading) {
		return <div className="flex justify-center items-center h-64">
			<div className="text-emerald-400">Loading analytics...</div>
		</div>;
	}

	const COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#8B5CF6'];

	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
				<AnalyticsCard
					title='Total Shipments'
					value={analyticsData.totalShipments.toLocaleString()}
					icon={Package}
					color='from-emerald-500 to-teal-700'
				/>
				<AnalyticsCard
					title='Pending Shipments'
					value={analyticsData.pendingShipments.toLocaleString()}
					icon={Clock}
					color='from-yellow-500 to-orange-700'
				/>
				<AnalyticsCard
					title='In Transit'
					value={analyticsData.inTransitShipments.toLocaleString()}
					icon={Truck}
					color='from-blue-500 to-cyan-700'
				/>
				<AnalyticsCard
					title='Delivered'
					value={analyticsData.deliveredShipments.toLocaleString()}
					icon={CheckCircle}
					color='from-green-500 to-lime-700'
				/>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
				<motion.div
					className='bg-gray-800/60 rounded-lg p-6 shadow-lg'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.25 }}
				>
					<h3 className='text-xl font-semibold text-emerald-400 mb-4'>Shipments by Status</h3>
					<ResponsiveContainer width='100%' height={300}>
						<PieChart>
							<Pie
								data={shipmentsByStatus}
								cx='50%'
								cy='50%'
								labelLine={false}
								label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
								outerRadius={80}
								fill='#8884d8'
								dataKey='value'
							>
								{shipmentsByStatus.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
								))}
							</Pie>
							<Tooltip />
						</PieChart>
					</ResponsiveContainer>
				</motion.div>

				<motion.div
					className='bg-gray-800/60 rounded-lg p-6 shadow-lg'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.35 }}
				>
					<h3 className='text-xl font-semibold text-emerald-400 mb-4'>Daily Shipments (Last 7 Days)</h3>
					<ResponsiveContainer width='100%' height={300}>
						<LineChart data={dailyShipmentsData}>
							<CartesianGrid strokeDasharray='3 3' />
							<XAxis dataKey='name' stroke='#D1D5DB' />
							<YAxis stroke='#D1D5DB' />
							<Tooltip />
							<Legend />
							<Line
								type='monotone'
								dataKey='shipments'
								stroke='#10B981'
								activeDot={{ r: 8 }}
								name='Created'
							/>
							<Line
								type='monotone'
								dataKey='delivered'
								stroke='#3B82F6'
								activeDot={{ r: 8 }}
								name='Delivered'
							/>
						</LineChart>
					</ResponsiveContainer>
				</motion.div>
			</div>
		</div>
	);
};

export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
	<motion.div
		className={`bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden relative`}
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
	>
		<div className='flex justify-between items-center'>
			<div className='z-10'>
				<p className='text-emerald-300 text-sm mb-1 font-semibold'>{title}</p>
				<h3 className='text-white text-3xl font-bold'>{value}</h3>
			</div>
		</div>
		<div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-30`} />
		<div className='absolute -bottom-4 -right-4 text-emerald-800 opacity-50'>
			<Icon className='h-32 w-32' />
		</div>
	</motion.div>
);
