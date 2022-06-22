export type Contract = [clause: boolean | Clause, litigation?: string | Error][]

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

// TODO: this part of code looks like shit
export const checkContract = (c: Contract | boolean, message?: string | Error): void => {
    if (typeof c === 'boolean') {
        if (!c) {
            if (typeof message === 'string') throw Error(message)
            else if (message instanceof Error) throw message
        }
    } else {
        c.forEach((condition) => {
            if (typeof condition[0] === 'boolean') {
                if (condition[0] === false) {
                    if (typeof condition[1] === 'string') throw Error(condition[1])
                    else if (condition[1] instanceof Error) throw condition[1]
                }
            } else if (isClause(condition[0]) && condition[0].evaluate() === false) {
                if (typeof condition[1] === 'string') throw Error(condition[1])
                else if (condition[1] instanceof Error) throw condition[1]
            }
        })
    }
}

export function notNullContract<T>(obj: T | undefined | null, message: string | Error): T {
    checkContract(obj !== null && obj !== undefined, message)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return obj!
}
