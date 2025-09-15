import {useDispatch, useSelector} from "react-redux";
import {productsActions, productsSelectors} from "#/redux/slices/productSlice";
import ProductCard from "#/pages/PageCustomer/ProductCard";

const ShoppingCart = () => {
	const dispatch = useDispatch();
	const products = useSelector(productsSelectors.products);
	const cartCount = products.length;

	const handleDelete = (id: string) => {
		dispatch(productsActions.removeToCard(id));
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