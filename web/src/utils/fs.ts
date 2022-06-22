import { unlink } from 'fs/promises'

export async function deleteIfFails(f: () => Promise<void>, file: Express.Multer.File): Promise<void> {
    try {
        await f()
    } catch (e) {
        await unlink(file.path)
        throw e
    }
}
