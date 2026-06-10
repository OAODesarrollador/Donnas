/* eslint-disable @typescript-eslint/no-require-imports */

require("ts-node").register({
  compilerOptions: {
    module: "CommonJS",
  },
});

require("./seed.ts");
