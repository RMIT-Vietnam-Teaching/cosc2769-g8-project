/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Đoàn Đắc Nguyên
# ID: s4131473
*/
export default function PageAbout() {
	return (
		<div className='container py-5' id='top'>
			<div className='row justify-content-center'>
				<div className='col-12 col-lg-10 col-xxl-8'>
					<header className='mb-4'>
						<h1 className='display-6'>About This Project</h1>
						<p className='text-secondary m-0'>RMIT COSC2769 E-Commerce — a learning project demonstrating a simple multi-role e‑commerce workflow.</p>
					</header>

					<section className='mb-4'>
						<h2 className='h4 mb-2'>What is inside</h2>
						<ul className='list-group list-group-flush'>
							<li className='list-group-item'>Customer can browse products, view details, add to cart, and place orders.</li>
							<li className='list-group-item'>Real-time cart synchronization across tabs using WebSocket (Socket.IO).</li>
							<li className='list-group-item'>Vendor can manage products.</li>
							<li className='list-group-item'>Shipper has a simple dashboard to track orders.</li>
						</ul>
					</section>

					<section className='mb-4'>
						<h2 className='h4 mb-2'>Tech stack</h2>
						<div className='row g-3'>
							<div className='col-12 col-md-6'>
								<div className='card h-100'>
									<div className='card-body'>
										<h3 className='h5'>Frontend</h3>
										<ul className='m-0 ps-3'>
											<li>React, React Router</li>
											<li>Redux Toolkit</li>
											<li>Bootstrap 5</li>
										</ul>
									</div>
								</div>
							</div>
							<div className='col-12 col-md-6'>
								<div className='card h-100'>
									<div className='card-body'>
										<h3 className='h5'>Backend</h3>
										<ul className='m-0 ps-3'>
											<li>Express, MongoDB (Mongoose)</li>
											<li>Session-based auth</li>
											<li>Socket.IO for cart events</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section className='mb-4'>
						<h2 className='h4 mb-2'>Project goals</h2>
						<p className='m-0'>This app showcases core full‑stack concepts: API design, model validation, state management, routing, and real‑time updates. It is intended for educational purposes and can be extended for assignments or demos.</p>
					</section>

					<section>
						<h2 className='h4 mb-2'>Contact</h2>
						<p className='m-0'>For questions related to this project, please contact the teaching staff of COSC2769 or your group repository maintainers.</p>
					</section>
				</div>
			</div>
		</div>
	);
}
