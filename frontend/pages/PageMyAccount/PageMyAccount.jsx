import { useActionState, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaCamera, FaEdit, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { clsx } from 'clsx';

import { accountHelper } from '#/helpers/account';
import { fetchHelper } from '#/helpers/fetch';
import { useAppSelector } from '#/hooks/redux';

export const PageMyAccount = () => {
	const navigate = useNavigate();
	const user = useAppSelector(state => state.user);
	const [profileData, setProfileData] = useState(/** @type {any} */(null));
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [updatePictureState, updatePictureAction, isUpdatingPicture] = useActionState(
		accountHelper.updateProfilePicture, 
		{ success: false, error: {} }
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
				const response = await fetchHelper.get('/api/account/profile').json();
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

	const handleLogout = async () => {
		try {
			await fetchHelper.post('/api/logout').json();
			navigate('/login');
		} catch (err) {
			console.error('Logout error:', err);
		}
	};

	const handleProfilePictureClick = () => {
		profilePictureRef.current?.click();
	};

	if (loading) {
		return (
			<div className="container-fluid h-100 d-flex justify-content-center align-items-center">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container-fluid h-100 d-flex justify-content-center align-items-center">
				<div className="alert alert-danger" role="alert">
					{error}
				</div>
			</div>
		);
	}

	if (!profileData) {
		return null;
	}

	const getProfilePictureUrl = () => {
		if (profileData.profilePicture) {
			return `/uploads/${profileData.profilePicture}`;
		}
		return '/vite.svg'; // Default image
	};

	const renderRoleSpecificFields = () => {
		switch (user.info?.role) {
			case accountHelper.role.VENDOR:
				return (
					<>
						<div className="row mb-3">
							<label className="col-sm-3 col-form-label fw-medium">Business Name:</label>
							<div className="col-sm-9">
								<input type="text" className="form-control-plaintext" readOnly value={profileData.businessName} />
							</div>
						</div>
						<div className="row mb-3">
							<label className="col-sm-3 col-form-label fw-medium">Business Address:</label>
							<div className="col-sm-9">
								<input type="text" className="form-control-plaintext" readOnly value={profileData.businessAddress} />
							</div>
						</div>
					</>
				);
			case accountHelper.role.CUSTOMER:
				return (
					<>
						<div className="row mb-3">
							<label className="col-sm-3 col-form-label fw-medium">Name:</label>
							<div className="col-sm-9">
								<input type="text" className="form-control-plaintext" readOnly value={profileData.name} />
							</div>
						</div>
						<div className="row mb-3">
							<label className="col-sm-3 col-form-label fw-medium">Address:</label>
							<div className="col-sm-9">
								<input type="text" className="form-control-plaintext" readOnly value={profileData.address} />
							</div>
						</div>
					</>
				);
			case accountHelper.role.SHIPPER:
				return (
					<div className="row mb-3">
						<label className="col-sm-3 col-form-label fw-medium">Distribution Hub:</label>
						<div className="col-sm-9">
							<input 
								type="text" 
								className="form-control-plaintext" 
								readOnly 
								value={profileData.hub ? `${profileData.hub.name} - ${profileData.hub.address}` : 'No hub assigned'} 
							/>
						</div>
					</div>
				);
			default:
				return null;
		}
	};

	return (<>
		<title>My Account</title>
		<div className="container-fluid h-100">
			<div className="row justify-content-center h-100">
				<div className="col-12 col-md-10 col-lg-8 col-xl-6 d-flex flex-column justify-content-center">
					<div className="my-4 p-4 rounded-2 shadow bg-body">
						{/* Header */}
						<div className="d-flex justify-content-between align-items-center mb-4">
							<h3 className="mb-0 d-flex align-items-center gap-2">
								<FaUser className="text-primary" />
								My Account
							</h3>
							<span className="badge bg-primary fs-6">{user.info?.role}</span>
						</div>

						{/* Profile Picture Section */}
						<div className="text-center mb-4">
							<div className="position-relative d-inline-block">
								<img
									src={getProfilePictureUrl()}
									alt="Profile"
									className="rounded-circle border border-3 border-primary"
									style={{ width: '120px', height: '120px', objectFit: 'cover', cursor: 'pointer' }}
									onClick={handleProfilePictureClick}
								/>
								<div 
									className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
									style={{ width: '32px', height: '32px', cursor: 'pointer' }}
									onClick={handleProfilePictureClick}
								>
									<FaCamera size={14} />
								</div>
							</div>
							<p className="text-muted mt-2 mb-0">Click to change profile picture</p>
						</div>

						{/* Profile Picture Upload Form */}
						<form action={updatePictureAction} className="d-none">
							<input
								ref={profilePictureRef}
								type="file"
								name="profilePicture"
								accept="image/*"
								onChange={(e) => {
									if (e.target.files?.[0]) {
										// Auto-submit the form when file is selected
										e.target.closest('form')?.requestSubmit();
									}
								}}
							/>
						</form>

						{/* Profile Information */}
						<div className="border-top pt-4">
							<h5 className="mb-3 d-flex align-items-center gap-2">
								<FaEdit className="text-secondary" />
								Profile Information
							</h5>
							
							<div className="row mb-3">
								<label className="col-sm-3 col-form-label fw-medium">Username:</label>
								<div className="col-sm-9">
									<input type="text" className="form-control-plaintext" readOnly value={profileData.username} />
								</div>
							</div>

							<div className="row mb-3">
								<label className="col-sm-3 col-form-label fw-medium">Role:</label>
								<div className="col-sm-9">
									<input type="text" className="form-control-plaintext" readOnly value={profileData.role} />
								</div>
							</div>

							{renderRoleSpecificFields()}

							<div className="row mb-3">
								<label className="col-sm-3 col-form-label fw-medium">Member Since:</label>
								<div className="col-sm-9">
									<input 
										type="text" 
										className="form-control-plaintext" 
										readOnly 
										value={new Date(profileData.createdAt).toLocaleDateString()} 
									/>
								</div>
							</div>
						</div>

						{/* Actions */}
						<div className="border-top pt-4 d-flex justify-content-between">
							<button type="button" className="btn btn-outline-secondary">
								<FaEdit className="me-2" />
								Edit Profile
							</button>
							<button 
								type="button" 
								className="btn btn-danger"
								onClick={handleLogout}
							>
								<FaSignOutAlt className="me-2" />
								Logout
							</button>
						</div>

						{/* Update Picture Error Display */}
						{!isUpdatingPicture && Object.keys(updatePictureState.error).length > 0 && (
							<div className="alert alert-danger mt-3" role="alert">
								{Object.values(updatePictureState.error).flat().map((error, index) => (
									<div key={index}>{error}</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>

		{/* Success Toast */}
		{createPortal(
			<div className="toast-container position-fixed top-0 end-0 p-3">
				<div ref={updateToastRef} className="toast" role="alert" aria-live="assertive" aria-atomic="true">
					<div className="toast-header bg-success text-white">
						<strong className="me-auto">Success</strong>
						<button type="button" className="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
					</div>
					<div className="toast-body">
						Profile picture updated successfully!
					</div>
				</div>
			</div>,
			document.body
		)}
	</>);
};
