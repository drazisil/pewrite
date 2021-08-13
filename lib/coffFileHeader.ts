export interface IMachineTypeEntry {
  constant: string
  value: string
  description: string
}

// https://docs.microsoft.com/en-us/windows/win32/debug/pe-format?utm_source=pocket_mylist#machine-types
const machineTypes: IMachineTypeEntry[] = [
  {
    constant: 'IMAGE_FILE_MACHINE_UNKNOWN',
    value: '0',
    description: 'The content of this field is assumed to be applicable to any machine type'
  },
  {
    constant: 'IMAGE_FILE_MACHINE_AM33',
    value: '1d3',
    description: 'Matsushita AM33'
  },
  {
    constant: 'IMAGE_FILE_MACHINE_AMD64',
    value: '8664',
    description: 'x64'
  },
  {
    constant: 'IMAGE_FILE_MACHINE_I386',
    value: '14c',
    description: 'Intel 386 or later processors and compatible processors'
  }
]

export interface CoffFileHeaderJson {
  length: number;
  machine: string | undefined;
  numberOfSections: number | undefined;
  timeDateStamp: number | undefined;
  pointerToSymbolTable: number | undefined;
  numberOfSymbols: number | undefined;
  sizeOfOptionalHeader: number | undefined;
  characteristics: string | undefined;
}

export class CoffFileHeader {
  private _buffer: Buffer;
  private _isValid = false;
  // https://docs.microsoft.com/en-us/windows/win32/debug/pe-format#machine-types
  private _machine: number | undefined;
  private _numberOfSections: number | undefined;
  private _timeDateStamp: number | undefined;
  private _pointerToSymbolTable: number | undefined;
  private _numberOfSymbols: number | undefined;
  // https://docs.microsoft.com/en-us/windows/win32/debug/pe-format#optional-header-image-only
  private _sizeOfOptionalHeader = 0;
  // https://docs.microsoft.com/en-us/windows/win32/debug/pe-format#characteristics
  private _characteristics: number | undefined;

  constructor(inputBuffer: Buffer) {
    this._buffer = inputBuffer;
    if (this._buffer.byteLength !== 20) {
      return;
    }

    this._machine = this._buffer.readInt16LE(0);

    this._numberOfSections = this._buffer.readInt16LE(2);

    this._timeDateStamp = this._buffer.readInt32LE(4);

    this._pointerToSymbolTable = this._buffer.readInt32LE(8);

    this._numberOfSymbols = this._buffer.readInt32LE(12);

    this._sizeOfOptionalHeader = this._buffer.readInt16LE(16);

    this._characteristics = this._buffer.readInt16LE(18);

    this._isValid = true;
  }

  public getLength(): number {
    return this._buffer.length;
  }

  public getMachineType(): IMachineTypeEntry {
    const needle = (this._machine || 0).toString(16)
    const result = machineTypes.find(entry => {
      return entry.value === needle
    })
    if (!result) {
      return { constant: 'IMAGE_FILE_MACHINE_INVALID', value: needle, description: 'Unable to match'}
    }
    return result
  }

  public isValid(): boolean {
    return this._isValid;
  }

  public get sizeOfOptionalHeader(): number {
    return this._sizeOfOptionalHeader;
  }

  public toJSON(): CoffFileHeaderJson {
    const machineType = this.getMachineType()
    return {
      length: this._buffer.byteLength,
      machine: `${machineType.constant}(${machineType.value}): ${machineType.description}`,
      numberOfSections: this._numberOfSections,
      timeDateStamp: this._timeDateStamp,
      pointerToSymbolTable: this._pointerToSymbolTable,
      numberOfSymbols: this._numberOfSymbols,
      sizeOfOptionalHeader: this._sizeOfOptionalHeader,
      characteristics: (this._characteristics || 0).toString(16)
    };
  }
}
