import React from 'react';
import {useParams} from "react-router";
import seedProductData from "./seedProductData";
import {displayPrice} from "./productCard";

interface ProductDetailProps {
	id: string;
	name: string;
	price: number;
	description: string;
	image: string | string[];
}

const ProductDetail = () => {
	const { id } = useParams();
	const product = seedProductData.find(product => product.id === id);

	if (!product) {
		return (
			<div className='container py-5'>
				<div className='alert alert-warning mb-0'>Product not found.</div>
			</div>
		);
	}
	const images = Array.isArray(product.image) ? product.image : [product.image];

	return (
		<div className='container py-5'>
			<div className='row g-4 align-items-start'>
				<div className='col-6'>
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
				<div className='col-6'>
					<h1 className='display-10 mb-3'>{product.name}</h1>
					<div className='h3 text-secondary mb-4'>{displayPrice(product.price)}</div>
					<p className='fs-5 text-muted mb-4'>{product.description}</p>
					<button type='button' className='btn btn-dark btn-lg rounded-5 w-50'>Add to cart</button>
				</div>
			</div>
		</div>
	)
}

export default ProductDetail;
