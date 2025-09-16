import { Link } from 'react-router';

import shopIcon from '../../../public/rmit-icon.png';

import { NavItems } from './NavItems/NavItems';

export const Nav = () => (<>
	<nav className='layout__nav navbar navbar-expand d-none d-md-flex shadow'>
		<div className='container-fluid'>
			<Link className='navbar-brand d-flex align-items-center gap-2' to='/'>
				<img src={shopIcon} alt='Shop icon' width='28' height='28' />
				<span>Shop</span>
			</Link>
			<ul className='navbar-nav'>
				<NavItems />
			</ul>
		</div>
	</nav>

	<nav className='layout__nav navbar d-md-none shadow'>
		<div className='container-fluid'>
			<Link className='navbar-brand d-flex align-items-center gap-2' to='/'>
				<img src={shopIcon} alt='Shop icon' width='24' height='24' />
				<span>Shop</span>
			</Link>
			<button className='navbar-toggler' type='button' data-bs-toggle='offcanvas' data-bs-target='#offcanvasNavbar' data-bs-theme='dark' aria-controls='offcanvasNavbar' aria-label='Toggle navigation'>
				<span className='navbar-toggler-icon'></span>
			</button>
			<div className='offcanvas offcanvas-end' tabIndex={-1} id='offcanvasNavbar' aria-labelledby='offcanvasNavbarLabel'>
				<div className='offcanvas-header'>
					<h5 className='offcanvas-title d-flex align-items-center gap-2' id='offcanvasNavbarLabel'>
						<img src={shopIcon} alt='Shop icon' width='24' height='24' />
						<span>Shop</span>
					</h5>
					<button type='button' className='btn-close' data-bs-dismiss='offcanvas' aria-label='Close'></button>
				</div>
				<div className='offcanvas-body'>
					<ul className='navbar-nav justify-content-end flex-grow-1 pe-3'>
						<NavItems />
					</ul>
				</div>
			</div>
		</div>
	</nav>
</>);
