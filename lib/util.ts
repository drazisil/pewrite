export function diffBuffer(buffer1: Buffer, buffer2: Buffer): Buffer | void {
    const diff: number[] = []

    const array1 = Array.from(buffer1)
    const array2 = Array.from(buffer2)

    if (!(array1.length === array2.length)) {
        return console.error(`Buffers are not the same length: ${array1.length}, ${array2.length}`)
    }

    return Buffer.from(diff)
}