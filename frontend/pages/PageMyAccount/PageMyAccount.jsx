import { useActionState, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaCamera, FaUser } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { Link, useNavigate } from 'react-router';
import { clsx } from 'clsx';

import './PageMyAccount.css';

import { accountHelper } from '#/helpers/account';
import { fetchHelper } from '#/helpers/fetch';
import { useAppSelector } from '#/hooks/redux';
import { accountService } from '#/services/accountService';

export const PageMyAccount = () => {
	const navigate = useNavigate();
	const user = useAppSelector(state => state.user);
	const [profileData, setProfileData] = useState(/** @type {any} */(null));
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [updatePictureState, updatePictureAction, isUpdatingPicture] = useActionState(
		accountService.updateProfilePicture,
		{ success: false, error: {} },
	);
	const profilePictureRef = useRef(/** @type {HTMLInputElement | null} */(null));
	const updateToastRef = useRef(/** @type {HTMLDivElement | null} */(null));

	useEffect(() => {
		// Check if user is authenticated
		if (!user.isAuthenticated || !user.info?.id) {
			navigate('/login');
			return;
		}

		// Fetch detailed profile data
		const fetchProfile = async () => {
			try {
				setLoading(true);
				/** @type {any} */
				const response = await fetchHelper.get('/api/account/profile');
				if (response.success) {
					setProfileData(response.data);
				} else {
					setError('Failed to load profile data');
				}
			} catch (err) {
				setError('Network error occurred');
				console.error('Profile fetch error:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, [user.isAuthenticated, user.info?.id, navigate]);

	useEffect(() => {
		if (updatePictureState.success && updateToastRef.current) {
			bootstrap.Toast.getOrCreateInstance(updateToastRef.current, { delay: 2000 }).show();
			// Refresh profile data
			window.location.reload();
		}
	}, [updatePictureState.success]);

	const handleProfilePictureClick = () => {
		profilePictureRef.current?.click();
	};

	const backButton = (
		<div className='row'>
			<div className='col d-flex flex-row justify-content-start'>
				<Link
					to='/'
					className='align-items-center border-0 btn btn-outline-secondary d-flex flex-row gap-3 pe-3 ps-2 py-2'
				>
					<IoMdArrowRoundBack className='fs-5' />
					<span className='position-relative'>
						{user.info?.role === accountHelper.role.SHIPPER ? 'View Orders' : 'View Products'}
					</span>
				</Link>
			</div>
		</div>
	);

	if (loading) {
		return (
			<div className='container d-flex flex-column gap-3 my-4 h-100'>
				{backButton}
				<div className='row flex-grow-1'>
					<div className='col h-100'>
						<div className='loading-container'>
							<div className='spinner-border text-primary loading-spinner' role='status'>
								<span className='visually-hidden'>Loading...</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='container d-flex flex-column gap-3 my-4 h-100'>
				{backButton}
				<div className='row flex-grow-1'>
					<div className='col h-100'>
						<div className='error-container'>
							<div className='alert alert-danger error-alert' role='alert'>
								{error}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!profileData) {
		return null;
	}

	const getProfilePictureUrl = () => {
		if (profileData.profilePicture) {
			// Handle both old format (with /uploads/ prefix) and new format (filename only)
			if (profileData.profilePicture.startsWith('/uploads/')) {
				return profileData.profilePicture; // Old format, use as is
			} else {
				return `/uploads/${profileData.profilePicture}`; // New format, add prefix
			}
		}
		return '/vite.svg'; // Default image
	};

	return (<>
		<title>My Account</title>
		<div className='my-account-container'>
			<div className='my-account-card position-relative' style={{ top: 50 }}>
				<div className='position-absolute start-0 end-0 container-fluid' style={{ top: -60 }}>
					{backButton}
				</div>
				{/* Header */}
				<div className='my-account-header d-flex justify-content-between align-items-center'>
					<h3 className='my-account-title mb-0'>
						<FaUser className='text-primary' />
						My Account
					</h3>
					<span className='role-badge'>{user.info?.role}</span>
				</div>

				{/* Profile Picture Section */}
				<div className='profile-picture-section'>
					<div className='profile-picture-container'>
						<img
							src={getProfilePictureUrl()}
							alt='Profile'
							className={clsx('profile-picture', isUpdatingPicture && 'uploading')}
							onClick={handleProfilePictureClick}
							tabIndex={0}
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									handleProfilePictureClick();
								}
							}}
						/>
						<div
							className='camera-overlay'
							onClick={handleProfilePictureClick}
							tabIndex={0}
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									handleProfilePictureClick();
								}
							}}
						>
							<FaCamera size={14} />
						</div>
					</div>
					<p className='text-muted mt-2 mb-0'>Click to change profile picture</p>
				</div>

				{/* Profile Picture Upload Form */}
				<form action={updatePictureAction} className='d-none'>
					<input
						ref={profilePictureRef}
						type='file'
						name='profilePicture'
						accept='image/*'
						onChange={(e) => {
							if (e.target.files?.[0]) {
								// Auto-submit the form when file is selected
								e.target.closest('form')?.requestSubmit();
							}
						}}
					/>
				</form>

				{/* Profile Information */}
				<div className='profile-info-section'>
					<h5 className='profile-info-title mb-3'>
						<FaUser className='text-secondary' />
						Profile Information
					</h5>

					<div className='profile-field'>
						<div className='row'>
							<div className='col-sm-3'>
								<label className='profile-field-label'>Username:</label>
							</div>
							<div className='col-sm-9'>
								<div className='profile-field-value'>{profileData.username}</div>
							</div>
						</div>
					</div>

					<div className='profile-field'>
						<div className='row'>
							<div className='col-sm-3'>
								<label className='profile-field-label'>Role:</label>
							</div>
							<div className='col-sm-9'>
								<div className='profile-field-value'>{profileData.role}</div>
							</div>
						</div>
					</div>

					{/* Role-specific fields */}
					{user.info?.role === accountHelper.role.VENDOR && (
						<>
							<div className='profile-field'>
								<div className='row'>
									<div className='col-sm-3'>
										<label className='profile-field-label'>Business Name:</label>
									</div>
									<div className='col-sm-9'>
										<div className='profile-field-value'>{profileData.businessName}</div>
									</div>
								</div>
							</div>
							<div className='profile-field'>
								<div className='row'>
									<div className='col-sm-3'>
										<label className='profile-field-label'>Business Address:</label>
									</div>
									<div className='col-sm-9'>
										<div className='profile-field-value'>{profileData.businessAddress}</div>
									</div>
								</div>
							</div>
						</>
					)}

					{user.info?.role === accountHelper.role.CUSTOMER && (
						<>
							<div className='profile-field'>
								<div className='row'>
									<div className='col-sm-3'>
										<label className='profile-field-label'>Name:</label>
									</div>
									<div className='col-sm-9'>
										<div className='profile-field-value'>{profileData.name}</div>
									</div>
								</div>
							</div>
							<div className='profile-field'>
								<div className='row'>
									<div className='col-sm-3'>
										<label className='profile-field-label'>Address:</label>
									</div>
									<div className='col-sm-9'>
										<div className='profile-field-value'>{profileData.address}</div>
									</div>
								</div>
							</div>
						</>
					)}

					{user.info?.role === accountHelper.role.SHIPPER && (
						<div className='profile-field'>
							<div className='row'>
								<div className='col-sm-3'>
									<label className='profile-field-label'>Distribution Hub:</label>
								</div>
								<div className='col-sm-9'>
									<div className='profile-field-value'>
										{profileData.hub ? `${profileData.hub.name} - ${profileData.hub.address}` : 'No hub assigned'}
									</div>
								</div>
							</div>
						</div>
					)}

					<div className='profile-field'>
						<div className='row'>
							<div className='col-sm-3'>
								<label className='profile-field-label'>Member Since:</label>
							</div>
							<div className='col-sm-9'>
								<div className='profile-field-value'>
									{new Date(profileData.createdAt).toLocaleDateString()}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Update Picture Error Display */}
				{!isUpdatingPicture && Object.keys(updatePictureState.error).length > 0 && (
					<div className='alert alert-danger mt-3' role='alert'>
						{Object.values(updatePictureState.error).flat().map((error, index) => (
							<div key={index}>{error}</div>
						))}
					</div>
				)}
			</div>
		</div>

		{/* Success Toast */}
		{createPortal(
			<div className='toast-container position-fixed top-0 end-0 p-3'>
				<div ref={updateToastRef} className='toast' role='alert' aria-live='assertive' aria-atomic='true'>
					<div className='toast-header bg-success text-white'>
						<strong className='me-auto'>Success</strong>
						<button type='button' className='btn-close btn-close-white' data-bs-dismiss='toast' aria-label='Close'></button>
					</div>
					<div className='toast-body'>
						Profile picture updated successfully!
					</div>
				</div>
			</div>,
			document.body,
		)}
	</>);
};
