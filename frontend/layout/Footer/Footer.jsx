/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Đoàn Đắc Nguyên, Trần Phan Anh Khoa
# ID: s4131473, s4136776
*/
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
								<Link to='/' className='nav-link px-2 text-body-secondary'>Main</Link>
							</li>
							<li className='nav-item'>
								<Link to='/about#top' className='nav-link px-2 text-body-secondary'>About</Link>
							</li>
							<li className='nav-item'>
								<Link to='/privacy#top' className='nav-link px-2 text-body-secondary'>Privacy</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
