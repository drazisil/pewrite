import { PathLike, read } from "fs"
import { FileHandle, open } from "fs/promises"
import { promisify } from "util"

const readPromise = promisify(read)

class PEWrite {
    CHUNK_SIZE = 16384
    _buffer: Buffer | undefined
    _fd: FileHandle | undefined
    _offset = 0

    constructor() {
        
    }

    static async parse(filePath: PathLike): Promise<PEWrite | void> {
        const self = new PEWrite

        self._fd = await open(filePath, 'r')
        .catch(err => {
            console.error(`Error opening ${filePath}: ${err}`)
            return undefined
        })

        if(!self._fd) {
            return console.error(`Unable to parse ${filePath}`)
        }

        console.log('Hi!')

        const readResults = await 

        self._fd.close()

        return self
    }
}

export const parse = PEWrite.parse
