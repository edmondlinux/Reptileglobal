
import { Package, UserPlus, LogIn, LogOut, Lock, Truck, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useState } from "react";
import { useTranslation } from "../hooks/useTranslation";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
	const { user, logout } = useUserStore();
	const [isOpen, setIsOpen] = useState(false);
	const { t } = useTranslation();

	return (
		<header className='fixed top-0 left-0 w-full bg-gray-900 bg-opacity-95 backdrop-blur-md z-50 border-b border-gray-800'>
			<div className='container mx-auto px-4 h-16'>
				<div className='flex items-center justify-between h-full'>
					<Link to='/' className='flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors'>
						<img src='/logo.png' alt='Reptile Global Logo' className='h-10 w-10' />
						<span className='font-bold text-xl'>Reptile Global</span>
					</Link>

					{/* Desktop Navigation */}
					<nav className='hidden md:flex items-center space-x-8'>
						<Link to='/' className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'>
							{t('nav.home')}
						</Link>
						<Link to='/about' className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'>
							{t('nav.about')}
						</Link>
						<Link to='/team' className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'>
							{t('nav.team')}
						</Link>
						<Link to='/testimonials' className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'>
							{t('nav.testimonials')}
						</Link>
						<Link to='/contact' className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'>
							{t('nav.contact')}
						</Link>
						<Link to='/track' className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'>
							{t('nav.track')}
						</Link>
					</nav>

					{/* Desktop Actions */}
					<div className='hidden md:flex items-center space-x-4'>
						<LanguageSwitcher />
						
						{user ? (
							<div className='flex items-center space-x-4'>
								{user.role === 'admin' && (
									<Link
										to='/admin-dashboard'
										className='bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition duration-300 ease-in-out flex items-center'
									>
										<Lock className='mr-2 h-4 w-4' />
										{t('nav.dashboard')}
									</Link>
								)}
								<Link
									to='/shipments'
									className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out flex items-center'
								>
									<Truck className='mr-2 h-4 w-4' />
									{t('nav.myShipments')}
								</Link>
								<button
									onClick={logout}
									className='bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition duration-300 ease-in-out flex items-center'
								>
									<LogOut className='mr-2 h-4 w-4' />
									{t('nav.logOut')}
								</button>
							</div>
						) : (
							<div className='flex items-center space-x-4'>
								<Link
									to='/signup'
									className='bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition duration-300 ease-in-out flex items-center'
								>
									<UserPlus className='mr-2 h-4 w-4' />
									{t('nav.signUp')}
								</Link>
								<Link
									to='/login'
									className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out flex items-center'
								>
									<LogIn className='mr-2 h-4 w-4' />
									{t('nav.login')}
								</Link>
							</div>
						)}
					</div>

					{/* Mobile menu button */}
					<div className='md:hidden flex items-center space-x-4'>
						<LanguageSwitcher />
						<button
							onClick={() => setIsOpen(!isOpen)}
							className='text-gray-300 hover:text-emerald-400 focus:outline-none focus:text-emerald-400'
						>
							{isOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
						</button>
					</div>
				</div>

				{/* Mobile Navigation */}
				{isOpen && (
					<div className='md:hidden'>
						<div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800 bg-opacity-95 backdrop-blur-md'>
							<Link
								to='/'
								className='block px-3 py-2 text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
								onClick={() => setIsOpen(false)}
							>
								{t('nav.home')}
							</Link>
							<Link
								to='/about'
								className='block px-3 py-2 text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
								onClick={() => setIsOpen(false)}
							>
								{t('nav.about')}
							</Link>
							<Link
								to='/team'
								className='block px-3 py-2 text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
								onClick={() => setIsOpen(false)}
							>
								{t('nav.team')}
							</Link>
							<Link
								to='/testimonials'
								className='block px-3 py-2 text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
								onClick={() => setIsOpen(false)}
							>
								{t('nav.testimonials')}
							</Link>
							<Link
								to='/contact'
								className='block px-3 py-2 text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
								onClick={() => setIsOpen(false)}
							>
								{t('nav.contact')}
							</Link>
							<Link
								to='/track'
								className='block px-3 py-2 text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
								onClick={() => setIsOpen(false)}
							>
								{t('nav.track')}
							</Link>

							{user ? (
								<div className='border-t border-gray-700 pt-4 mt-4'>
									{user.role === 'admin' && (
										<Link
											to='/admin-dashboard'
											className='block px-3 py-2 text-emerald-400 hover:text-emerald-300 transition duration-300 ease-in-out'
											onClick={() => setIsOpen(false)}
										>
											<Lock className='inline mr-2 h-4 w-4' />
											{t('nav.dashboard')}
										</Link>
									)}
									<Link
										to='/shipments'
										className='block px-3 py-2 text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
										onClick={() => setIsOpen(false)}
									>
										<Truck className='inline mr-2 h-4 w-4' />
										{t('nav.myShipments')}
									</Link>
									<button
										onClick={() => {
											logout();
											setIsOpen(false);
										}}
										className='block w-full text-left px-3 py-2 text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
									>
										<LogOut className='inline mr-2 h-4 w-4' />
										{t('nav.logOut')}
									</button>
								</div>
							) : (
								<div className='border-t border-gray-700 pt-4 mt-4'>
									<Link
										to='/signup'
										className='block px-3 py-2 text-emerald-400 hover:text-emerald-300 transition duration-300 ease-in-out'
										onClick={() => setIsOpen(false)}
									>
										<UserPlus className='inline mr-2 h-4 w-4' />
										{t('nav.signUp')}
									</Link>
									<Link
										to='/login'
										className='block px-3 py-2 text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
										onClick={() => setIsOpen(false)}
									>
										<LogIn className='inline mr-2 h-4 w-4' />
										{t('nav.login')}
									</Link>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</header>
	);
};

export default Navbar;
