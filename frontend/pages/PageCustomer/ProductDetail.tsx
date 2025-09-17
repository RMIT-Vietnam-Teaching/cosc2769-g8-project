/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Đoàn Đắc Nguyên
# ID: s4131473
*/
import { useEffect, useMemo, useState } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router';
import { clsx } from 'clsx';

import { productHelper } from '#/helpers/product';
import { productsActions, productsSelectors } from '#/redux/slices/productSlice';
import cartSocket from '#/services/cartSocket';
import productService from '#/services/productService';

interface ProductType {
	id: string;
	name: string;
	price: number;
	description: string;
	image: string | string[];
}

const ProductDetail = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const currentState = useSelector(productsSelectors.products);
	const isNotAvailable = useMemo(() => currentState.find((p: ProductType) => String(p.id) === String(id)) === undefined, [currentState, id]);

	const [product, setProduct] = useState<ProductType | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id) return;
		let mounted = true;
		(async () => {
			try {
				setLoading(true);
				const data = await productService.getById(id);
				const mapped: ProductType = {
					id: data._id ?? data.id,
					name: data.name,
					price: data.price,
					description: data.description,
					image: Array.isArray(data.image) ? data.image : [data.image],
				};
				if (mounted) setProduct(mapped);
				setError(null);
			} catch (e) {
				setError(e?.message ?? 'Failed to load product');
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => {
			mounted = false;
		};
	}, [id]);

	useEffect(() => {
		cartSocket.connect();
		const onUpdated = (evt: any) => {
			if (evt?.type === 'add' && evt.item) {
				const item = { ...evt.item, image: Array.isArray(evt.item.image) ? evt.item.image : [evt.item.image] };
				dispatch(productsActions.addToCard(item));
			} else if (evt?.type === 'remove' && evt.itemId) {
				dispatch(productsActions.removeToCard(evt.itemId));
			} else if (evt?.type === 'clear') {
				dispatch(productsActions.clearCard());
			}
		};
		cartSocket.on('cart:updated', onUpdated);
		return () => {
			cartSocket.off('cart:updated', onUpdated);
		};
	}, [dispatch]);

	if (loading) {
		return (
			<div className='container py-5'>
				<div className='alert alert-info mb-0'>Loading product...</div>
			</div>
		);
	}

	if (error || !product) {
		return (
			<div className='container py-5'>
				<div className='alert alert-warning mb-0'>{error ?? 'Product not found.'}</div>
			</div>
		);
	}

	const images = Array.isArray(product.image) ? product.image : [product.image];

	const handleAddToCard = () => {
		dispatch(productsActions.addToCard(product));
		cartSocket.add(product);
	};

	return (
		<div className='container my-4 d-flex flex-column gap-3'>

			<div className='row'>
				<div className='col d-flex flex-row justify-content-start'>
					<Link
						to='/customer'
						className='align-items-center border-0 btn btn-outline-secondary d-flex flex-row gap-3 pe-3 ps-2 py-2'
					>
						<IoMdArrowRoundBack className='fs-5' />
						<span className='position-relative'>View Products</span>
					</Link>
				</div>
			</div>

			<div className='row g-4 align-items-start'>
				<div className='col-12 col-lg-6'>
					<div id='productCarousel' className='carousel slide'>
						<div className='carousel-indicators'>
							{images.map((_, i) => (
								<button
									key={i}
									type='button'
									data-bs-target='#productCarousel'
									data-bs-slide-to={i}
									className={i === 0 ? 'active' : ''}
									aria-current={i === 0 ? 'true' : undefined}
									aria-label={`Slide ${i + 1}`}
								/>
							))}
						</div>

						<div className='carousel-inner'>
							{images.map((src, i) => (
								<div className={`carousel-item ${i === 0 ? 'active' : ''}`} key={i}>
									<img className='d-block w-100 rounded-4' style={{ height: '520px', objectFit: 'cover' }} src={src} alt={`slide-${i}`} />
								</div>
							))}
						</div>

						<button className='carousel-control-prev' type='button' data-bs-target='#productCarousel' data-bs-slide='prev'>
							<span className='carousel-control-prev-icon' aria-hidden='true' />
							<span className='visually-hidden'>Previous</span>
						</button>
						<button className='carousel-control-next' type='button' data-bs-target='#productCarousel' data-bs-slide='next'>
							<span className='carousel-control-next-icon' aria-hidden='true' />
							<span className='visually-hidden'>Next</span>
						</button>
					</div>
				</div>
				<div className='col-12 col-lg-6'>
					<h1 className='display-10 mb-3'>{product.name}</h1>
					<div className='h3 text-secondary mb-4'>{productHelper.displayPrice(product.price)}</div>
					<p className='fs-5 text-muted mb-4'>{product.description}</p>
					<button
						type='button'
						className={clsx(
							'btn btn-lg rounded-5 w-50',
							isNotAvailable ? 'btn-dark' : 'btn-outline-dark opacity-100',
						)}
						onClick={handleAddToCard}
						disabled={!isNotAvailable}
					>
						{isNotAvailable ? 'Add to cart' : 'Added'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProductDetail;
