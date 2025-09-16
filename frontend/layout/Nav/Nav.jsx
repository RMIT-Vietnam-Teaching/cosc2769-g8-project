import { Link } from 'react-router';

import shopIcon from '../../../public/rmit-icon.png';
import { NavItems } from './NavItems/NavItems';
import { ProductSearch } from './ProductSearch/ProductSearch';

import { accountHelper } from '#/helpers/account';
import { useAppSelector } from '#/hooks/redux';
import { userSelect } from '#/redux/slices/userSlice';

export const Nav = () => {
	const role = useAppSelector(userSelect.role);

	return (<>
		<nav className='layout__nav navbar navbar-expand d-flex shadow'>
			<div className='container-fluid gap-5'>
				<Link className='navbar-brand d-flex align-items-center gap-2 m-0' to='/'>
					<img src={shopIcon} alt='Shop icon' width='28' height='28' />
					<span>Shop</span>
				</Link>

				{role === accountHelper.role.CUSTOMER && <ProductSearch />}

				<ul className='navbar-nav align-items-center'>
					<NavItems />
				</ul>
			</div>
		</nav>
	</>);
};
