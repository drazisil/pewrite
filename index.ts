import { parse } from "./lib/index";

async function main() {
  await parse("./testFiles/hh6d.golden.exe");
  await parse("./testFiles/unpnp.exe-mz.exe");
}

Promise.all([main()]);
