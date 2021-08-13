import { parse } from "./lib/index";

async function main() {
  if (!process.argv[2]) {
    console.error('Please supply a file path')
    process.exitCode = -1
    return
  }
  await parse(process.argv[2]);
}

Promise.all([main()]);
