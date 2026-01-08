export function compressIndices(indices: number[]): string {
    if (indices.length === 0) return "";
    
    indices.sort((a: number, b: number) => a - b);

    let result: string = indices[0].toString(36); 
    let i = 1;

    while (i < indices.length) {
        let diff = indices[i] - indices[i - 1];
        let count = 1;

        while (i + count < indices.length && (indices[i + count] - indices[i + count - 1]) === diff) {
            count++;
        }

        const marker = (diff < 36) ? "." : "_"; 
        const diffStr = diff.toString(36);

        if (count > 1) {
            result += marker + diffStr + "*" + count.toString(36);
            i += count;
        } else {
            result += marker + diffStr;
            i++;
        }
    }
    
    return result;
}