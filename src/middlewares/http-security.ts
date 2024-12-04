/** The http security middleware */

import helmet from 'helmet';
import config from "config";

const crossOriginResourcePolicy = config.get<boolean>("http-security.cross-origin");

export const HTTPSecurity = helmet({ crossOriginResourcePolicy});
