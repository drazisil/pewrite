import { PathLike } from "fs";
import { FileHandle } from "fs/promises";
import { open } from "fs/promises";
import { DOS_STUB } from "./constants";
import { diffBuffer } from "./util";

class DosStub {
  _buffer: Buffer;
  _peOffset: number;

  constructor(inputBuffer: Buffer) {
    this._buffer = inputBuffer;

    this._peOffset = this._buffer.readInt16LE(0x3c);

    console.info(`The PE offset is ${this._peOffset}`);
  }
}

class PEWrite {
  CHUNK_SIZE = 16384;
  _buffer: Buffer | undefined;
  _fileHandle: FileHandle | undefined;
  _offset = 0;
  _dosStub: DosStub | undefined;

  constructor() {}

  static async parse(filePath: PathLike): Promise<PEWrite | void> {
    const self = new PEWrite();

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

    self._dosStub = new DosStub(self._buffer.slice(0, 0x40));

    if (!self._dosStub._buffer.equals(DOS_STUB)) {
      return console.error(
        `DOS stub does not match!: ${diffBuffer(self._dosStub._buffer, DOS_STUB)}`
      );
    }

    const peSig = self._buffer.slice(
      self._dosStub._peOffset,
      self._dosStub._peOffset + 4
    );

    if (!self.peSigValid(peSig)) {
      return console.error(
        `${Buffer.from(peSig).toString("hex")} does not match!`
      );
    }

    return self;
  }

  peSigValid(inputBytes: Buffer): boolean {
    return inputBytes.toString("hex") === "50450000"; // PE\n\n
  }
}

export const parse = PEWrite.parse;
