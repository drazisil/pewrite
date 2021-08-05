import { DOS_STUB } from "./constants";
import { diffBuffer } from "./util";

export class DosStub {
    private _buffer: Buffer;
    private _peOffset: number;
    private _isValid = false;
  
    constructor(inputBuffer: Buffer) {
      this._buffer = inputBuffer;
  
      this._peOffset = this._buffer.readInt16LE(0x3c);
  
      console.info(`The PE offset is ${this._peOffset}`);
  
      if (!this._buffer.equals(DOS_STUB)) {
        console.error(
          `DOS stub does not match!: ${diffBuffer(this._buffer, DOS_STUB)}`
        );
      } else {
        this._isValid = true;
      }
    }
  
    public isValid(): boolean {
      return this._isValid;
    }
  
    public get peOffset(): number {
      return this._peOffset;
    }
  }