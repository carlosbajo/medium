

import { readFile } from "fs/promises";

export const readlocalFile = (path: string) => {
    return readFile(path, { encoding: 'utf-8' })
}