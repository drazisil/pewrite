export class CoffOptionalHeader {
    private _buffer: Buffer
    private _headerSize: number
    constructor(inputBuffer: Buffer, headerSize: number) {
        this._buffer = inputBuffer
        this._headerSize = headerSize
    }
}