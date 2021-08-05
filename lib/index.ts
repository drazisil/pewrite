import { PathLike } from "fs";
import { FileHandle } from "fs/promises";
import { open } from "fs/promises";
import { DosStub } from "./dosStub";

export interface CoffFileHeaderJson {
  length: number,
  machine: string | undefined
}

class CoffFileHeader {
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

class PEWrite {
  private _buffer: Buffer | undefined;
  private _fileHandle: FileHandle | undefined;
  private _dosStub: DosStub | undefined;
  private _peSig: Buffer | undefined;
  private _coffFileHeader: CoffFileHeader | undefined;

  constructor() {}

  public static async parse(filePath: PathLike): Promise<PEWrite | void> {
    const self = new PEWrite();

    let cursor = 0

    self._fileHandle = await open(filePath, "r").catch((err) => {
      console.error(`Error opening ${filePath}: ${err}`);
      return undefined;
    });

    if (!self._fileHandle) {
      return console.error(`Unable to parse ${filePath}`);
    }

    console.log("Hi!");

    self._buffer = await self._fileHandle.readFile();

    self._fileHandle.close();

    console.log(`Read ${self._buffer.byteLength} bytes`);

    self._dosStub = new DosStub(self._buffer.slice(cursor, 0x40));

    self._dosStub.isValid();

    cursor = self._dosStub.peOffset

    self._peSig = self._buffer.slice(
      cursor,
      cursor + 4
    );

    if (!self.peSigValid(self._peSig)) {
      return console.error(
        `${Buffer.from(self._peSig).toString("hex")} does not match!`
      );
    }

    cursor = cursor + 4

    self._coffFileHeader = new CoffFileHeader(self._buffer.slice(cursor,
      cursor + 20));

    if (!self._coffFileHeader.isValid()) {
      return console.error(`PE File Header is not valid!`);
    }

    console.log(self._coffFileHeader.toJSON())

    return self;
  }

  public peSigValid(inputBytes: Buffer): boolean {
    return inputBytes.toString("hex") === "50450000"; // PE\n\n
  }
}

export const parse = PEWrite.parse;
