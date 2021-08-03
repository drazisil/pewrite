import { PathLike } from "fs"
import { FileHandle } from "fs/promises"
import { open } from "fs/promises"



class PEWrite {
    CHUNK_SIZE = 16384
    _buffer = Buffer.alloc(this.CHUNK_SIZE)
    _fileHandle: FileHandle | undefined
    _offset = 0

    constructor() {
        
    }

    static async parse(filePath: PathLike): Promise<PEWrite | void> {
        const self = new PEWrite

        self._fileHandle = await open(filePath, 'r')
        .catch(err => {
            console.error(`Error opening ${filePath}: ${err}`)
            return undefined
        })

        if(!self._fileHandle) {
            return console.error(`Unable to parse ${filePath}`)
        }

        console.log('Hi!')

        const readResults = await self._fileHandle.read(self._buffer)

        self._fileHandle.close()

        return self
    }
}

export const parse = PEWrite.parse
