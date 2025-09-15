// @ts-nocheck
import React, { useEffect, useState } from 'react';

import orderService from '../../services/orderService.js';

import './PageShipper.css';

const PageShipper = () => {
	const [orders, setOrders] = useState([]);
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [confirmationModal, setConfirmationModal] = useState({ show: false, action: null, orderId: null });
	const [wasDetailModalOpen, setWasDetailModalOpen] = useState(false);
	// Sorting and pagination states
	const [sortStatus, setSortStatus] = useState('all');
	const [currentPage, setCurrentPage] = useState(1);
	const [ordersPerPage, setOrdersPerPage] = useState(6); // default for desktop

	// Responsive orders per page
	useEffect(() => {
		const updateOrdersPerPage = () => {
			const width = window.innerWidth;
			const height = window.innerHeight;
			// If device is in landscape and is a tablet, show more orders
			if (width < 600) {
				setOrdersPerPage(7); // phone
			} else if (width < 900) {
				if (width > height) {
					setOrdersPerPage(6); // tablet landscape
				} else {
					setOrdersPerPage(10); // tablet portrait
				}
			} else {
				setOrdersPerPage(8); // large desktop or landscape tablet
			}
		};
		updateOrdersPerPage();
		window.addEventListener('resize', updateOrdersPerPage);
		window.addEventListener('orientationchange', updateOrdersPerPage);
		return () => {
			window.removeEventListener('resize', updateOrdersPerPage);
			window.removeEventListener('orientationchange', updateOrdersPerPage);
		};
	}, []);

	// Load orders on component mount
	useEffect(() => {
		loadOrders();
	}, []);

	const loadOrders = async () => {
		try {
			setLoading(true);
			setError(null);
			console.log('Attempting to fetch orders...'); // Debug log
			const ordersData = await orderService.getAllOrders();
			console.log('Fetched orders:', ordersData); // Debug log
			console.log('Orders data type:', typeof ordersData); // Debug log
			console.log('Is orders data an array?', Array.isArray(ordersData)); // Debug log
			setOrders(Array.isArray(ordersData) ? ordersData : []);
		} catch (err) {
			console.error('Failed to load orders:', err); // This should show the actual error
			console.error('Error details:', {
				message: err.message,
				stack: err.stack,
				name: err.name,
			}); // More detailed error logging
			setError(err.message);
			setOrders([]);
		} finally {
			setLoading(false);
		}
	};

	const handleViewDetails = async (order) => {
		try {
			const detailedOrder = await orderService.getOrderById(order._id);
			setSelectedOrder(detailedOrder);
			setShowModal(true);
		} catch (err) {
			console.error('Failed to load order details:', err);
			alert('Failed to load order details: ' + err.message);
		}
	};

	const updateOrderStatus = (orderId, newStatus) => {
		setOrders(prev => prev.map(order =>
			order._id === orderId ? { ...order, status: newStatus } : order,
		));
	};

	const handleDelivered = async (orderId) => {
		try {
			await orderService.markAsDelivered(orderId);
			updateOrderStatus(orderId, 'delivered');
		} catch (err) {
			console.error('Failed to mark order as delivered:', err);
			alert('Failed to mark order as delivered: ' + err.message);
		}
	};

	const handleCancel = async (orderId) => {
		try {
			await orderService.cancelOrder(orderId);
			updateOrderStatus(orderId, 'canceled');
		} catch (err) {
			console.error('Failed to cancel order:', err);
			alert('Failed to cancel order: ' + err.message);
		}
	};

	const closeModal = () => {
		setShowModal(false);
		setSelectedOrder(null);
	};

	const openConfirmationModal = (action, orderId) => {
		setWasDetailModalOpen(showModal); // Track if details modal was open
		setConfirmationModal({ show: true, action, orderId });
		setShowModal(false); // Hide details modal when showing confirmation
	};

	const closeConfirmationModal = () => {
		setConfirmationModal({ show: false, action: null, orderId: null });
		// Restore details modal only if it was open before
		if (wasDetailModalOpen) {
			setShowModal(true);
		}
		setWasDetailModalOpen(false);
	};

	const confirmAction = async () => {
		const { action, orderId } = confirmationModal;
		if (action === 'delivered') {
			await handleDelivered(orderId);
		} else if (action === 'cancel') {
			await handleCancel(orderId);
		}
		closeConfirmationModal();
	};

	const getStatusBadgeClass = (status) => {
		const statusClasses = {
			delivered: 'badge bg-success',
			canceled: 'badge bg-danger',
			active: 'badge bg-warning',
		};
		return statusClasses[status] || 'badge bg-secondary';
	};

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat('en-AU', {
			style: 'currency',
			currency: 'AUD',
		}).format(amount || 0);
	};

	// Sorting and pagination logic
	const filteredOrders = sortStatus === 'all' ? orders : orders.filter(order => order.status === sortStatus);

	// Sort by status alphabetically (optional, can be changed)
	const sortedOrders = [...filteredOrders].sort((a, b) => {
		if (a.status < b.status) return -1;
		if (a.status > b.status) return 1;
		return 0;
	});

	// Pagination
	const indexOfLastOrder = currentPage * ordersPerPage;
	const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
	const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
	const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);

	const handlePageChange = (pageNum) => {
		setCurrentPage(pageNum);
	};

	const handleSortChange = (e) => {
		setSortStatus(e.target.value);
		setCurrentPage(1); // Reset to first page on sort
	};

	return (
		<>
			<div className='album py-5 bg-body-tertiary'>
				<div className='container'>
					<div className='d-flex justify-content-between align-items-center mb-4'>
						<h2>Shipper Dashboard</h2>
						<div className='d-flex gap-2'>
							<select className='form-select' style={{ width: 160 }} value={sortStatus} onChange={handleSortChange}>
								<option value='all'>All Statuses</option>
								<option value='active'>Active</option>
								<option value='delivered'>Delivered</option>
								<option value='canceled'>Canceled</option>
							</select>
							<button className='btn btn-outline-primary' onClick={loadOrders}>
								Refresh Orders
							</button>
						</div>
					</div>
					{!sortedOrders.length ? (
						<div className='text-center py-5'>
							<h5>No orders found</h5>
							<p>There are currently no orders to display.</p>
						</div>
					) : (
						<>
							<div className='table-responsive'>
								<table className='table table-bordered align-middle'>
									<thead className='table-light'>
										<tr>
											<th>Order ID</th>
											<th>Status</th>
											<th>Customer</th>
											<th>Created Date</th>
											<th>Total</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										{currentOrders.map(order => (
											<tr key={order._id}>
												<td>#{order._id?.slice(-6).toUpperCase()}</td>
												<td><span className={getStatusBadgeClass(order.status)}>{order.status?.toUpperCase()}</span></td>
												<td>{order.customer?.name || 'N/A'}</td>
												<td>{order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</td>
												<td>{formatCurrency(order.totalPrice)}</td>
												<td>
													<div className='btn-group'>
														<button
															type='button'
															className='btn btn-sm btn-outline-primary'
															onClick={() => handleViewDetails(order)}
														>
															Details
														</button>
														{order.status === 'active' && (
															<>
																<button
																	type='button'
																	className='btn btn-sm btn-outline-success'
																	onClick={() => openConfirmationModal('delivered', order._id)}
																>
																	Delivered
																</button>
																<button
																	type='button'
																	className='btn btn-sm btn-outline-danger'
																	onClick={() => openConfirmationModal('cancel', order._id)}
																>
																	Cancel
																</button>
															</>
														)}
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							{/* Pagination Controls */}
							<nav className='mt-4 d-flex justify-content-center'>
								<ul className='pagination'>
									<li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
										<button className='page-link' onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>&laquo;</button>
									</li>
									{Array.from({ length: totalPages }, (_, i) => (
										<li key={i + 1} className={`page-item${currentPage === i + 1 ? ' active' : ''}`}>
											<button className='page-link' onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
										</li>
									))}
									<li className={`page-item${currentPage === totalPages ? ' disabled' : ''}`}>
										<button className='page-link' onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>&raquo;</button>
									</li>
								</ul>
							</nav>
						</>
					)}
				</div>
			</div>

			{/* Redesigned Order Details Modal */}
			{showModal && selectedOrder && (
				<div className='modal fade show d-block' tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
					<div className='modal-dialog modal-lg'>
						<div className='modal-content border-0 shadow-lg'>
							<div className='modal-header bg-primary text-white'>
								<h5 className='modal-title d-flex align-items-center gap-2'>
									<span role='img' aria-label='package'>📦</span>
									Order #{selectedOrder._id?.slice(-6).toUpperCase()}
								</h5>
								<button type='button' className='btn-close btn-close-white' onClick={closeModal} aria-label='Close'></button>
							</div>
							<div className='modal-body p-4'>
								<div className='row g-4'>
									<div className='col-md-4'>
										<div className='border rounded p-3 h-100 bg-light'>
											<h6 className='mb-3 d-flex align-items-center gap-2'><span role='img' aria-label='user'>👤</span> Customer</h6>
											<div><strong>Name:</strong> {selectedOrder.customer?.name || 'N/A'}</div>
											<div><strong>Username:</strong> {selectedOrder.customer?.username || 'N/A'}</div>
											<div><strong>Address:</strong> {selectedOrder.customer?.address || 'N/A'}</div>
										</div>
									</div>
									<div className='col-md-4'>
										<div className='border rounded p-3 h-100 bg-light'>
											<h6 className='mb-3 d-flex align-items-center gap-2'><span role='img' aria-label='info'>📝</span> Order Info</h6>
											<div><strong>Status:</strong> <span className={getStatusBadgeClass(selectedOrder.status) + ' ms-2'}>{selectedOrder.status?.toUpperCase()}</span></div>
											<div><strong>Total:</strong> {formatCurrency(selectedOrder.totalPrice)}</div>
											<div><strong>Order ID:</strong> #{selectedOrder._id?.slice(-6).toUpperCase()}</div>
										</div>
									</div>
									<div className='col-md-4'>
										<div className='border rounded p-3 h-100 bg-light'>
											<h6 className='mb-3 d-flex align-items-center gap-2'><span role='img' aria-label='hub'>🏢</span> Distribution Hub</h6>
											<div><strong>Name:</strong> {selectedOrder.hub?.name || 'N/A'}</div>
											<div><strong>Address:</strong> {selectedOrder.hub?.address || 'N/A'}</div>
										</div>
									</div>
								</div>
								<div className='row mt-4'>
									<div className='col-12'>
										<h6 className='mb-3 d-flex align-items-center gap-2'><span role='img' aria-label='items'>🛒</span> Order Items</h6>
										<div className='table-responsive'>
											<table className='table table-bordered table-striped'>
												<thead className='table-secondary'>
													<tr>
														<th>Product</th>
														<th>Description</th>
														<th>Quantity</th>
														<th>Price</th>
														<th>Total</th>
													</tr>
												</thead>
												<tbody>
													{selectedOrder.items?.map((item, index) => (
														<tr key={index}>
															<td>{item.product?.name || 'N/A'}</td>
															<td>{item.product?.description || 'N/A'}</td>
															<td>{item.quantity}</td>
															<td>{formatCurrency(item.price)}</td>
															<td>{formatCurrency(item.quantity * item.price)}</td>
														</tr>
													))}
												</tbody>
												<tfoot>
													<tr>
														<th colSpan={4} className='text-end'>Total Order Value:</th>
														<th>{formatCurrency(selectedOrder.totalPrice)}</th>
													</tr>
												</tfoot>
											</table>
										</div>
									</div>
								</div>
							</div>
							<div className='modal-footer bg-light'>
								{selectedOrder.status === 'active' && (
									<>
										<button
											type='button'
											className='btn btn-success'
											onClick={() => {
												openConfirmationModal('delivered', selectedOrder._id);
												closeModal();
											}}
										>
											<span role='img' aria-label='check'>✅</span> Mark as Delivered
										</button>
										<button
											type='button'
											className='btn btn-danger'
											onClick={() => {
												openConfirmationModal('cancel', selectedOrder._id);
												closeModal();
											}}
										>
											<span role='img' aria-label='cancel'>❌</span> Cancel Order
										</button>
									</>
								)}
								<button type='button' className='btn btn-secondary' onClick={closeModal}>
									Close
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Confirmation Modal */}
			{confirmationModal.show && (
				<div className='modal fade show d-block' tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
					<div className='modal-dialog'>
						<div className='modal-content'>
							<div className='modal-header'>
								<h5 className='modal-title'>Confirm Action</h5>
								<button type='button' className='btn-close' onClick={closeConfirmationModal} aria-label='Close'></button>
							</div>
							<div className='modal-body'>
								<p>Are you sure you want to mark this order as {confirmationModal.action}?</p>
							</div>
							<div className='modal-footer'>
								<button type='button' className='btn btn-secondary' onClick={closeConfirmationModal}>Cancel</button>
								<button type='button' className='btn btn-primary' onClick={confirmAction}>Confirm</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default PageShipper;

