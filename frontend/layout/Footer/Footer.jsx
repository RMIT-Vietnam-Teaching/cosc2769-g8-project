import { Link } from 'react-router';

// Simple Bootstrap-only footer shared across pages
export const Footer = () => {
	return (
		<footer className='bg-body-secondary mt-auto border-top'>
			<div className='container py-4'>
				<div className='row align-items-center gy-3'>
					<div className='col-12 col-md-6 text-center text-md-start'>
						<span className='text-muted'>© {new Date().getFullYear()} RMIT COSC2769 E-Commerce</span>
					</div>
					<div className='col-12 col-md-6'>
						<ul className='nav nav-underline justify-content-center justify-content-md-end'>
							<li className='nav-item'>
								<Link to='/customer' className='nav-link px-2 text-body-secondary'>Main</Link>
							</li>
							<li className='nav-item'>
								<Link to='/about' className='nav-link px-2 text-body-secondary'>About</Link>
							</li>
							<li className='nav-item'>
								<Link to='/privacy' className='nav-link px-2 text-body-secondary'>Privacy</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
