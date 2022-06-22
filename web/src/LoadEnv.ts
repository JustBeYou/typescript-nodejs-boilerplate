import dotenv from 'dotenv'

export function loadConfig(): void {
    const result2 = dotenv.config({
        path: `.env`,
    })

    if (result2.error) {
        throw result2.error
    }
}
