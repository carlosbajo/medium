import { readlocalFile } from "utils";

export const addTextAtTheEnd = async (filePath: string, endText: string) => {
    const fileContent = await readlocalFile(filePath);
    return `${fileContent}${endText}`;
}