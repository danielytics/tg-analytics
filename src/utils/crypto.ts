/**
 * Creates a SHA-256 hash from an input string.
 * @param input The string to hash.
 * @returns A promise that resolves to the hash as an ArrayBuffer.
 */
export async function sha256(input: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    return await crypto.subtle.digest('SHA-256', data);
}

/**
 * Generates a safe integer from a number by hashing it and "folding" the
 * 256-bit result into a single 32-bit value using XOR. This method uses
 * information from the entire hash.
 *
 * @param input The number to hash.
 * @returns A promise that resolves to a 32-bit integer number.
 */
export async function sha256number(input: number): Promise<number> {
    // 1. Get the 32-byte (256-bit) hash buffer
    const hashBuffer = await sha256(String(input));
    const view = new DataView(hashBuffer);

    // 2. Initialize a 32-bit integer to hold the folded result.
    let foldedResult = 0;

    // 3. A SHA-256 hash is 32 bytes long. We read it in 4-byte (32-bit) chunks.
    //    So, we will loop 32 / 4 = 8 times.
    const numChunks = hashBuffer.byteLength / 4;
    for (let i = 0; i < numChunks; i++) {
        // Read the next 32-bit chunk. The offset is i * 4 bytes.
        const chunk = view.getUint32(i * 4, false);
        // Fold the chunk into the result using the XOR operator.
        foldedResult ^= chunk;
    }

    // 4. The result is a 32-bit number, which is guaranteed to be a safe integer.
    return foldedResult;
}
