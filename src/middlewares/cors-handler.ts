/** The CORS middleware */

import type { CorsOptions } from 'cors';
import cors from 'cors';
import config from "config";

const options = config.get<CorsOptions>("cors.options");

export const CORSHandler = cors(options);
