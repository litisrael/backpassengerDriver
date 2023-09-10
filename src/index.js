import { initRouterDriver } from "./api/app.js";

async function main() {
  const app = await  initRouterDriver();
  const port = process.env.PORT || 3000;


    app.listen(port, () => {
      console.log(`La aplicación está ____________----------______________________-----------------------------
       escuchando en el puerto ${port}`);
    });
}

main();
