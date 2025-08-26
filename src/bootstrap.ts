import 'reflect-metadata';
import WinstonLogger from '@rosen-bridge/winston-logger';
import { CallbackLoggerFactory } from '@rosen-bridge/callback-logger';
import { getConfig } from './configs';

CallbackLoggerFactory.init(new WinstonLogger(getConfig().logger.transports));
