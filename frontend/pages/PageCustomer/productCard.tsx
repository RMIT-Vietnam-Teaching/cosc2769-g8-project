import React from 'react';
import { useNavigate } from 'react-router';
import './PageCustomer.css';

interface productType {
	id: string;
    name: string;
    price: number;
    description: string;
    image: string;
}

export const displayPrice = (price: number) : string => {
	return price.toLocaleString('vi-VN', {
		style: 'currency',
		currency: 'VND',
	})
}

const ProductCard = ({product} : {product: productType}) => {
    const navigate = useNavigate();

	return (
		<div className='col link-underline link-underline-opacity-0' onClick={() => {navigate(`/product/${product.id}`)}}>
			<div className='card product-card shadow-sm'>
				<img src={product.image} className='card-img-top product-image' alt='' />
				<div className='card-body'>
					<h5 className='card-title'>{product.name}</h5>
					<p className='card-title'>{displayPrice(product.price)}</p>
				</div>
			</div>
		</div>
    )
}

export default ProductCard;
