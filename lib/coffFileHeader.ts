export interface CoffFileHeaderJson {
    length: number,
    machine: string | undefined
  }
  
  export class CoffFileHeader {
    private _buffer: Buffer;
    private _isValid = false;
    private _machine: number | undefined
  
    constructor(inputBuffer: Buffer) {
      this._buffer = inputBuffer;
      if (this._buffer.byteLength !== 20) {
        return
      }
  
      this._machine = this._buffer.readInt16LE(0)
  
      this._isValid = true
    }
  
    public get length(): number {
      return this._buffer.length;
    }
  
    public isValid(): boolean {
      return this._isValid;
    }
  
    public toJSON(): CoffFileHeaderJson {
      return {
        length: this._buffer.byteLength,
        machine: (this._machine || 0).toString(16)
      }
    }
  }