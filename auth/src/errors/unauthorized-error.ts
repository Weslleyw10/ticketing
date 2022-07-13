import { CustomError } from './custom-error'


export class UnAuthorizedError extends CustomError {
    statusCode = 401;

    constructor() {
        super('Unauthorized');

        Object.setPrototypeOf(this, UnAuthorizedError.prototype)
    }

    serializeErrors() {
        return [{ message: 'Unauthorized'}]
    }

}