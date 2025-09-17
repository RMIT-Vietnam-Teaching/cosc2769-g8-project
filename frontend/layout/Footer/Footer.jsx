/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Đoàn Đắc Nguyên
# ID: s4131473
*/
import { NavLink, useMatches } from 'react-router';

import { useAppSelector } from '#/hooks/redux';
import { userSelect } from '#/redux/slices/userSlice';

// Simple Bootstrap-only footer shared across pages
export const Footer = () => {
	const role = useAppSelector(userSelect.role);
	const layoutRoute = /** @type {app.AppLayoutUIMatch} */(useMatches().at(0));
	const mainUrl = role == null ? '/login' : layoutRoute.handle.defaultRouteForRole[role];

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
								<NavLink to={mainUrl} className='nav-link px-2 text-body-secondary'>Main</NavLink>
							</li>
							<li className='nav-item'>
								<NavLink to='/about#top' className='nav-link px-2 text-body-secondary'>About</NavLink>
							</li>
							<li className='nav-item'>
								<NavLink to='/privacy#top' className='nav-link px-2 text-body-secondary'>Privacy</NavLink>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
