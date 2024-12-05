import morgan from "morgan";

import logger from "@/libs/logger";

const stream = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf("\n")));
  },
};

export const HTTPLogger =  morgan(":method :url :status :res[content-length] - :response-time ms", {
  stream,
//   skip: () => env("NODE_ENV") === "test",
});
