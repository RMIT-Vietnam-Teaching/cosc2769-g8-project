import { IoMdArrowRoundBack } from 'react-icons/io';
import { Link } from 'react-router';

export const PageSignup = () => {
	return (<>
		<title>Sign Up</title>
		<div className='container-fluid h-100'>
			<div className='row justify-content-center h-100'>
				<div className='col-12 col-sm-9 col-md-8 col-lg-6 col-xl-5 col-xxl-4 d-flex flex-column justify-content-xs-start justify-content-md-center'>
					<div className='my-4 d-flex flex-column gap-4 p-5 rounded-5 shadow bg-body'>
						<Link to='/login' className='btn btn-outline-secondary border-0 d-flex flex-row gap-3 align-items-center px-3'>
							<IoMdArrowRoundBack className='fs-5' />
							<span>Log In</span>
						</Link>
						<h4 className='align-self-start mb-4 px-3'>Who you want to become?</h4>
						<Link
							to='/signup/customer'
							className='btn btn-outline-dark border-secondary-subtle shadow py-2 rounded-pill'
						>
							Customer
						</Link>
						<Link
							to='/signup/shipper'
							className='btn btn-outline-dark border-secondary-subtle shadow py-2 rounded-pill'
						>
							Shipper
						</Link>
						<Link
							to='/signup/vendor'
							className='btn btn-outline-dark border-secondary-subtle shadow py-2 rounded-pill'
						>
							Vendor
						</Link>
					</div>
				</div>
			</div>
		</div>
	</>);
};
