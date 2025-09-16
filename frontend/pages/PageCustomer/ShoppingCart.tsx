import {useDispatch, useSelector} from "react-redux";
import {productsActions, productsSelectors} from "#/redux/slices/productSlice";
import ProductCard from "#/pages/PageCustomer/ProductCard";
import { useEffect } from "react";
import cartSocket from "#/services/cartSocket";
import orderService from "#/services/orderService";

const ShoppingCart = () => {
	const dispatch = useDispatch();
	const products = useSelector(productsSelectors.products);
	const cartCount = products.length;

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

	const handleDelete = (id: string) => {
		dispatch(productsActions.removeToCard(id));
		cartSocket.remove(id);
	};

	const handlePlaceOrder = async () => {
		try {
			const items = products;
			await orderService.createCustomerOrder(items);
			dispatch(productsActions.clearCard());
			cartSocket.clear();
			alert('Order placed successfully');
		} catch (e) {
			console.error(e);
			alert('Failed to place order');
		}
	};

	return (
		<div className='container py-4'>
			<div className='d-flex justify-content-between align-items-center mb-4'>
				<h2 className='mb-0'>Your Cart {cartCount > 0 ? `(${cartCount})` : ''}</h2>
				{cartCount > 0 && (
					<button className='btn btn-primary' onClick={handlePlaceOrder}>Place Order</button>
				)}
			</div>
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