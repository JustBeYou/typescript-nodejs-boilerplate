import { UserDocument, UserODM } from '@app/models/odms/user'

let counter = 0
const defaultPassword = '1234'

export function fakeUser(name?: string): Promise<UserDocument> {
    const email = name !== undefined ? `${name}@fake.com` : undefined
    return UserODM.create({
        username: name || `USERUM${counter++}`,
        password: defaultPassword,
        email: email || `userum${counter - 1}@fake.com`,
    })
}

export function fakeUsers(n: number): Promise<UserDocument[]> {
    return Promise.all(
        Array(n)
            .fill(null)
            .map(() => fakeUser())
    )
}
