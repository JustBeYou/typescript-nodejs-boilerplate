export type Contract = [clause: boolean | Clause, litigation?: string][]

export interface Clause {
    evaluate(): boolean
}

function isClause(object: any): object is Clause {
    return 'evaluate' in object
}

export class Implication implements Clause {
    constructor(private p: boolean, private q: boolean) {}
    evaluate(): boolean {
        return !this.p || this.q
    }
}

export const checkContract = (c: Contract | boolean, message?: string): void => {
    if (typeof c === 'boolean') {
        if (!c) throw Error(message)
    } else {
        c.forEach((condition) => {
            if (typeof condition[0] === 'boolean') {
                if (condition[0] === false) throw Error(condition[1])
            } else if (isClause(condition[0]) && condition[0].evaluate() === false) {
                throw Error(condition[1])
            }
        })
    }
}

export function notNullContract<T>(obj: T | undefined | null, message: string): T {
    checkContract(obj !== null && obj !== undefined, message)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return obj!
}
