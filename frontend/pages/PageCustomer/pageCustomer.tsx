import React from 'react';
import './PageCustomer.css';
import seedProductData from "./seedProductData";
import ProductCard from "./productCard";

const PageCustomer = () => {

	return (
		//TODO: Add one container,
		<div className='d-flex justify-content-center align-items-center flex-wrap'>
			<div className='row'>
				{
					seedProductData.map(product => (
						<ProductCard
							key={product.name}
							product={product}
						/>
					))
				}
			</div>
		</div>

	);
};

export default PageCustomer;
