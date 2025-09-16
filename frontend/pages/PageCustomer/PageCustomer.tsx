import React, { useEffect, useState } from 'react';
import './PageCustomer.css';
import ProductCard from "./ProductCard";
import productService from "#/services/productService";
import { useDispatch } from 'react-redux';
import { productsActions } from "#/redux/slices/productSlice";
import cartSocket from "#/services/cartSocket";

interface ProductType {
	id: string;
	name: string;
	price: number;
	description: string;
	image: string[];
}

const PageCustomer = () => {
	const dispatch = useDispatch();
	const [products, setProducts] = useState<ProductType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				setLoading(true);
				const list = await productService.getAll();
				const mapped = list.map((p: any) => ({
					id: p._id ?? p.id,
					name: p.name,
					price: p.price,
					description: p.description,
					image: Array.isArray(p.image) ? p.image : [p.image],
				}));
				if (mounted) setProducts(mapped);
				setError(null);
			} catch (e: any) {
				setError(e?.message ?? 'Failed to fetch products');
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => { mounted = false };
	}, []);

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
		return <div className='container py-5'><div className='alert alert-info mb-0'>Loading products...</div></div>;
	}
	if (error) {
		return <div className='container py-5'><div className='alert alert-danger mb-0'>{error}</div></div>;
	}

	return (
		<div className='d-flex justify-content-center align-items-center flex-wrap'>
			<div className='row'>
				{
					products.map((product: ProductType) => (
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
