export class DosStub {
  private _buffer: Buffer;
  private _peOffset: number;
  private _isValid = false;

  constructor(inputBuffer: Buffer) {
    this._buffer = inputBuffer;

    this._peOffset = this._buffer.readInt16LE(0x3c);

    console.info(`The PE offset is ${this._peOffset}`);

    this._isValid = true;
  }

  public isValid(): boolean {
    return this._isValid;
  }

  public get peOffset(): number {
    return this._peOffset;
  }
}
