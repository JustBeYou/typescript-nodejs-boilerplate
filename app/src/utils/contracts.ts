import { type } from 'os'

export type Contract = [clause: boolean | Clause, litigation?: string][]

export interface Clause {
  evaluate(): boolean
}

function isClause(object: any): object is Clause {
  return 'evaluate' in object
}

export class Implication implements Clause {
  constructor(private p: boolean, private q: boolean) {}
  evaluate() {
    return !this.p || this.q
  }
}

export const checkContract = (c: Contract | boolean, message?: string) => {
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
