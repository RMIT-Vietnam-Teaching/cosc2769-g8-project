import { Request, Response, NextFunction } from "express";

declare global {
	namespace app {
		type RequestHandler = (req: Request, res: Response) => void;
		type AsyncRequestHandler = (req: Request, res: Response) => Promise<void>;
		type Middleware = (req: Request, res: Response, next: NextFunction) => void;
		type AsyncMiddleware = (req: Request, res: Response, next: NextFunction) => Promise<void>;
		type ErrorMiddleware = (
			err: any,
			req: Request,
			res: Response,
			next: NextFunction,
		) => void | Promise<void>;
	}
}
