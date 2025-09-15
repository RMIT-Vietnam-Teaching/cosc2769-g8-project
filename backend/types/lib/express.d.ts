import "express";

declare global {
    namespace Express {
        interface Response {
			jsonOk: () => void;
			jsonData: (data: any) => void;
			jsonRedirect: (url: string) => void;
			jsonError: (error: {[k: string]: string[]}) => void;
			jsonErrorMsg: (errorMsgs: string[]) => void;
			jsonInternalErrorMsg: (errorMsgs: string[]) => void;
		}
	}
}
