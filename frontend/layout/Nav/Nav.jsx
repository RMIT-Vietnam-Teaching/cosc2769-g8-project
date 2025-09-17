/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Trần Phan Anh Khoa
# ID: s4136776
*/
import { Link } from 'react-router';

import shopIcon from '../../../public/rmit-icon.png';
import { NavItems } from './NavItems/NavItems';
import { ProductSearch } from './ProductSearch/ProductSearch';

import './Nav.css';

import { accountHelper } from '#/helpers/account';
import { useAppSelector } from '#/hooks/redux';
import { userSelect } from '#/redux/slices/userSlice';

export const Nav = () => {
	const role = useAppSelector(userSelect.role);

	return (<>
		<nav className='layout__nav navbar navbar-expand d-flex shadow'>
			<div className='container-fluid gap-2 gap-sm-4'>
				<Link className='navbar-brand d-flex align-items-center gap-2 m-0' to='/'>
					<img src={shopIcon} alt='Shop icon' className='nav__icon' />
					<span className='d-none d-md-inline-block'>Shop</span>
				</Link>

				{role === accountHelper.role.CUSTOMER && <ProductSearch />}

				<ul className='navbar-nav align-items-center'>
					<NavItems />
				</ul>
			</div>
		</nav>
	</>);
};
