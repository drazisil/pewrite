export interface CoffFileHeaderJson {
    length: number,
    machine: string | undefined
    numberOfSections: number | undefined
    timeDateStamp: number | undefined
    pointerToSymbolTable: number | undefined
    numberOfSymbols: number | undefined
    sizeOfOptionalHeader: number | undefined
    characteristics: string | undefined
    
  }
  
  export class CoffFileHeader {
    private _buffer: Buffer;
    private _isValid = false;
    // https://docs.microsoft.com/en-us/windows/win32/debug/pe-format#machine-types
    private _machine: number | undefined
    private _numberOfSections: number | undefined
    private _timeDateStamp: number | undefined
    private _pointerToSymbolTable: number | undefined
    private _numberOfSymbols: number | undefined
    // https://docs.microsoft.com/en-us/windows/win32/debug/pe-format#optional-header-image-only
    private _sizeOfOptionalHeader = 0
    // https://docs.microsoft.com/en-us/windows/win32/debug/pe-format#characteristics
    private _characteristics: number | undefined
  
    constructor(inputBuffer: Buffer) {
      this._buffer = inputBuffer;
      if (this._buffer.byteLength !== 20) {
        return
      }
  
      this._machine = this._buffer.readInt16LE(0)

      this._numberOfSections = this._buffer.readInt16LE(2)

      this._timeDateStamp = this._buffer.readInt32LE(4)

      this._pointerToSymbolTable = this._buffer.readInt32LE(8)

      this._numberOfSymbols = this._buffer.readInt32LE(12)

      this._sizeOfOptionalHeader = this._buffer.readInt16LE(16)

      this._characteristics = this._buffer.readInt16LE(18)
  
      this._isValid = true
    }
  
    public get length(): number {
      return this._buffer.length;
    }
  
    public isValid(): boolean {
      return this._isValid;
    }

    public get sizeOfOptionalHeader(): number {
      return this._sizeOfOptionalHeader
    }
  
    public toJSON(): CoffFileHeaderJson {
      return {
        length: this._buffer.byteLength,
        machine: (this._machine || 0).toString(16),
        numberOfSections: this._numberOfSections,
        timeDateStamp: this._timeDateStamp,
        pointerToSymbolTable: this._pointerToSymbolTable,
        numberOfSymbols: this._numberOfSymbols,
        sizeOfOptionalHeader: this._sizeOfOptionalHeader,
        characteristics: (this._characteristics || 0).toString(16),
      }
    }
  }