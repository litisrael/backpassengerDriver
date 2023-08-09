import { initRouterDriver } from "./api/app.js";

async function main() {
  const app = await  initRouterDriver();
  app.listen(4000);
}

main();
