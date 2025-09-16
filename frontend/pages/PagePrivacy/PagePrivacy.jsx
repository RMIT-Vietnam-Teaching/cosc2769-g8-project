export default function PagePrivacy() {
	return (
		<div className="container py-5" id='top'>
			<div className="row justify-content-center">
				<div className="col-12 col-lg-10 col-xxl-8">
					<header className="mb-4">
						<h1 className="display-6">Privacy Policy</h1>
						<p className="text-secondary m-0">This policy explains how this learning project collects and uses information.</p>
					</header>

					<section className="mb-4">
						<h2 className="h5">Information we collect</h2>
						<ul className="m-0 ps-3">
							<li>Account details you provide during signup (e.g., username, password, role-specific info).</li>
							<li>Basic order data (products you purchase and order totals).</li>
							<li>Session information to keep you signed in.</li>
						</ul>
					</section>

					<section className="mb-4">
						<h2 className="h5">How we use your information</h2>
						<ul className="m-0 ps-3">
							<li>To authenticate users and authorize access to features.</li>
							<li>To process orders and display your order history.</li>
							<li>To improve the app during the course (debugging and analytics limited to development).</li>
						</ul>
					</section>

					<section className="mb-4">
						<h2 className="h5">Cookies and storage</h2>
						<p className="m-0">We use browser cookies for session management. The cart uses localStorage to share a temporary cart room ID between tabs for real-time synchronization. No third‑party tracking cookies are used.</p>
					</section>

					<section className="mb-4">
						<h2 className="h5">Data retention</h2>
						<p className="m-0">Data is retained only for the duration of the course or as required to demonstrate features. You may request removal by contacting the project maintainers.</p>
					</section>

					<section>
						<h2 className="h5">Contact</h2>
						<p className="m-0">For privacy questions, contact your instructor or repository maintainers.</p>
					</section>
				</div>
			</div>
		</div>
	);
}
