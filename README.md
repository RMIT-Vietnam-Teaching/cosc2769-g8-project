<!--
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Trần Phan Anh Khoa, Doàn Đắc Nguyên
# ID: s4136776
-->
## Project
- Github Link: [Github Repo](https://github.com/RMIT-Vietnam-Teaching/cosc2769-g8-project)
- Video Link: [One Drive Video]()

## Contribution

| sId | Name | Task | Contribution Score |
|---|---|---|---|
| s4076839 | Lê Đạt Nhơn | Shipper Pages | 5.0 |
| s4133678 | Đỗ Phúc Danh | My Account Pages | 5.0 |
| s4131473 | Đoàn Đắc Nguyên | Customer Pages | 5.0 |
| s4131459 | Nguyễn Hoàng Long | Vendor Pages | 5.0 |
| s4136776 | Trần Phan Anh Khoa | Sign up/in/out Pages | 5.0 |


## Start server
1. Install dependencies
	```bash
	npm install
	```
	```

2. Run application
	```bash
	npm run dev

3. Seed Database (Optional since database should be already up with seeded data)
	```url
	/api/seed-mongodb-data
	```

## Packages
Backend:
- `dotenv`: For reading .env file

- `mongodb`: mongodb native driver (used for seeding data)
- `mongoose`: ODM for mongodb

- `express`: Express server
- `express-session`: For login session
- `connect-mongo`: Save session to mongodb
- `multer`: Upload file middleware
- `vite-express`: to use vite with express for hot module reloading
`socket.io`: socket.io on server

- `morgan`: server logger
- `winston`: error logger
- `debug`: server version of console.log

- `bcrypt`: to use for password hashing
- `date-fns`: Date manipulation
- `zod`: for json schema/validation if nescessary

Frontend:
- `react`: for react
- `react-dom`: for react
- `react-router`: for routing inside react app
- `@reduxjs/toolkit`: For redux (include redux-thunk already)
- `react-redux`: Connectiing redux store with react component along with useDispatch and useSelector hook.
- `clsx`: conditionally adding css classes
- `react-icons`: "^5.5.0",
- `react-select`: "^5.10.2",
- `socket.io-client`: "^4.7.5",

## Scripts
- `npm run dev`: Start a dev server at 3000 with HMR
- `npm run build`: To build react app for production
Type checking:
- `npm run check`: To check types for the whole project
- `npm run check:backend`: To check types for backend code
- `npm run check:frontend`: To check types for frontend code
Linting (coding style checking & fixing):
- `npm run lint`: To check if there are any problem in coding style
- `npm run check:backend`: To fix all linting problems. If there are problems that cannot be fixed then we need to manually fix those.
- `npm run check:frontend`: To check types for frontend code

## File Structure
- `frontend/`: react app
	- `assets/`: files that we want to include directly into our apps.
	- `components/`: for resuable component
	- `hooks/`: for reusable hooks
	- `layout/`: for our entire app layout
	- `pages/`: each component is for each page
	- `redux/`: storing global redux store
		- `store.js`: Init redux global store
		- `slices`: Contain data slices for redux
	- `index`.html: entry point of our react app
	- `main.jsx`: render react tree into #root element inside index.html
	- `router.jsx`: contain all the routes of our react app
- `backend/`: express backend
	- `controllers/`: implement logic for each api endpoint
	- `helpers/`: resuable function accross controllers
	- `app.js`: create and config express app
	- `middleware.js`: collection of all custom middlewares express
	- `api.router.js`: contain all api routes
	- `models.js`: contain all mongodb schemas
- `public/`: store static files
- `.env.template``: template for `.env` file. The `.env` file must look similar to this.

