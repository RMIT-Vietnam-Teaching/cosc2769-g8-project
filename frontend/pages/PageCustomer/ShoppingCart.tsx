import {useDispatch, useSelector} from "react-redux";
import {productsActions, productsSelectors} from "#/redux/slices/productSlice";
import ProductCard from "#/pages/PageCustomer/ProductCard";
import { useEffect } from "react";
import cartSocket from "#/services/cartSocket";

const ShoppingCart = () => {
	const dispatch = useDispatch();
	const products = useSelector(productsSelectors.products);
	const cartCount = products.length;

	useEffect(() => {
		const socket = cartSocket.connect();
		const onUpdated = (evt: any) => {
			if (evt?.type === 'add' && evt.item) {
				const item = { ...evt.item, image: Array.isArray(evt.item.image) ? evt.item.image : [evt.item.image] };
				dispatch(productsActions.addToCard(item));
			} else if (evt?.type === 'remove' && evt.itemId) {
				dispatch(productsActions.removeToCard(evt.itemId));
			}
		};
		cartSocket.on('cart:updated', onUpdated);
		return () => {
			cartSocket.off('cart:updated', onUpdated);
		};
	}, [dispatch]);

	const handleDelete = (id: string) => {
		dispatch(productsActions.removeToCard(id));
		cartSocket.remove(id);
	};


	return (
		<div className='container py-4'>
			<h2 className='mb-4'>Your Cart {cartCount > 0 ? `(${cartCount})` : ''}</h2>
			{cartCount > 0 ? (
				<div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3'>
					{products.map(p => (
						<ProductCard
							key={String(p.id)}
							product={p}
							showDelete
							onDelete={(id) => handleDelete(id)}
						/>
					))}
				</div>
			) : (
				<div className='alert alert-info mb-0'>Your cart is empty.</div>
			)}
		</div>

	)
}

export default ShoppingCart;