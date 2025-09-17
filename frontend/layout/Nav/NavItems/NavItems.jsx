/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Trần Phan Anh Khoa
# ID: s4136776
*/
import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { BsCart4 } from 'react-icons/bs';
import { FaPlus } from 'react-icons/fa';
import { MdAccountCircle, MdOutlineLogin, MdOutlineLogout, MdPerson } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router';
import { clsx } from 'clsx';

import { accountHelper } from '#/helpers/account';
import { fetchHelper } from '#/helpers/fetch';
import { useAppDispatch, useAppSelector } from '#/hooks/redux';
import { productsSelectors } from '#/redux/slices/productSlice.js';
import { userAction, userSelect } from '#/redux/slices/userSlice';

export const NavItems = () => {
	const user = useAppSelector(userSelect.info);
	const products = useSelector(productsSelectors.products);
	const cartCount = products.length;
	const dispatch = useAppDispatch();
	/** @type {import('react').Ref<HTMLDivElement>} */
	const logoutToastRef = useRef(null);

	const handleLogOut = async () => {
		let hasError = false;
		try {
			/** @type {app.Response} */
			const res = await fetchHelper.post('/api/logout');
			if (res.success) {
				dispatch(userAction.clearUser());
			} else {
				hasError = true;
			}
		} catch {
			hasError = true;
		}

		if (hasError && logoutToastRef.current != null) {
			bootstrap.Toast.getOrCreateInstance(logoutToastRef.current).show();
		}
	};

	return (<>
		{user == null ? (
			<li className='nav-item'>
				<NavLink className='nav-link' to='/login'>
					<MdOutlineLogin /> Login
				</NavLink>
			</li>
		) : (<>

			{user.role === accountHelper.role.VENDOR && (
				<li className='nav-item'>
					<NavLink className='nav-link' to='/vendor/new-product'>
						<button className='btn btn-light'>
							<div className='d-sm-none d-flex flex-row align-items-center gap-2'>
								<FaPlus />
								<span className='position-relative' style={{ top: 1 }}>Add</span>
							</div>
							<span className='d-none d-sm-inline-block'>
								Add New Product
							</span>
						</button>
					</NavLink>
				</li>
			)}

			{user.role === accountHelper.role.CUSTOMER && (
				<li className='nav-item'>
					<NavLink
						className={clsx(
							'nav-link position-relative',
							cartCount > 0 && cartCount < 10 && 'me-1',
							cartCount >= 10 && 'me-2',
						)}
						to='/cart'
					>
						<BsCart4 className='nav__icon text-light' />
						{cartCount > 0 ? (
							<span
								className='position-absolute translate-middle badge rounded-pill bg-danger fs-6 py-1'
								style={{ top: 10, left: 'calc(100% - 10px)' }}
								aria-label={`Items in cart: ${cartCount}`}
							>
								{cartCount}
							</span>
						) : null}
					</NavLink>
				</li>
			)}

			<li className='nav-item dropdown'>
				<a className='nav-link active d-flex flex-row align-items-center gap-2' href='#' role='button' data-bs-toggle='dropdown' aria-expanded='false'>
					{user.img == null ? <MdAccountCircle className='nav__icon' /> : (
						<img src={user.img} alt='user profile picture' className='nav__icon object-fit-cover rounded-circle' />
					)}

					<div className='text-truncate nav__display-name d-none d-lg-block'>{user.name}</div>
				</a>
				<ul className='dropdown-menu dropdown-menu-end'>
					<li className='dropdown-item pe-none pb-2 d-lg-none'>
						<div className='text-truncate nav__display-name-long'>Welcome {user.name}!</div>
					</li>
					<li>
						<NavLink className='dropdown-item' to='/my-account'>
							<MdPerson /> My Account
						</NavLink>
					</li>
					<li><hr className='dropdown-divider' /></li>
					<li>
						<a className='dropdown-item' href='#' onClick={handleLogOut}>
							<MdOutlineLogout /> Log Out
						</a>
					</li>
				</ul>
			</li>
		</>)}

		{createPortal(
			<div className='toast-container position-fixed top-content start-0 p-3'>
				<div ref={logoutToastRef} className='toast rounded-4 border-0' role='alert' aria-live='assertive' aria-atomic='true'>
					<div className='toast-body alert alert-danger m-0 d-flex justify-content-between'>
						Unable to Log Out!
						<button type='button' className='btn-close' data-bs-dismiss='toast' aria-label='Close'></button>
					</div>
				</div>
			</div>,
			document.body,
		)}
	</>);
};
