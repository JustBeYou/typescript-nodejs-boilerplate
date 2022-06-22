export class ControllerError extends Error {
    errorCode: number
    constructor(m: string, errorCode: number) {
        super(m)
        this.errorCode = errorCode
    }
}

export function isControllerError(err: Error | ControllerError): err is ControllerError {
    return (<ControllerError>err).errorCode !== undefined
}
