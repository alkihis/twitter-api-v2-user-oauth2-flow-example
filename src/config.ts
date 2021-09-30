import fs from 'fs';
import dotenv from 'dotenv';
import { TwitterApi } from 'twitter-api-v2-local';

export const CONFIG = dotenv.parse(fs.readFileSync(__dirname + '/../.env'));

export const CLIENT_ID = { clientId: CONFIG.CLIENT_ID! };

// Create client used to generate auth links only
export const requestClient = new TwitterApi(CLIENT_ID);

export default CONFIG;
