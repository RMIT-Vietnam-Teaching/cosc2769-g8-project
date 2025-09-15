import React from 'react';
import './PageCustomer.css';
import seedProductData from "./SeedProductData";
import ProductCard from "./ProductCard";

interface ProductType {
	id: string;
	name: string;
	price: number;
	description: string;
	image: string[];
}

const PageCustomer = () => {

	return (
		<div className='d-flex justify-content-center align-items-center flex-wrap'>
			<div className='row'>
				{
					seedProductData.map((product: ProductType) => (
						<ProductCard
							key={product.id}
							product={product}
						/>
					))
				}
			</div>
		</div>

	);
};

export default PageCustomer;
