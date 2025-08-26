import config from 'config';
import { cloneDeep } from 'lodash-es';
import { TransportOptions } from '@rosen-bridge/winston-logger';

const getRequiredString = (path: string) => {
  if (!config.has(path)) {
    throw new Error(`ImproperlyConfigured. ${path} is not defined`);
  }
  return config.get<string>(path);
};

const getOptionalString = (path: string, defaultValue = '') => {
  if (config.has(path)) {
    return config.get<string>(path);
  }
  return defaultValue;
};

interface ConfigType {
  logger: LoggerConfig;
  general: Config;
}

class Config {
  mnemonic: string;
  explorerUrl: string;
  nodeUrl: string;
  minBoxValue: string;
  fee: string;
  constructor() {
    this.mnemonic = getRequiredString('user.mnemonic');
    this.explorerUrl = getRequiredString('ergo.explorer.url');
    this.nodeUrl = getRequiredString('ergo.node.url');
    this.minBoxValue = getOptionalString('ergo.minBoxValue', '1000000');
    this.fee = getOptionalString('ergo.fee', '1000000');
  }
}
class LoggerConfig {
  transports: TransportOptions[];

  constructor() {
    const logs = config.get<TransportOptions[]>('logs');
    const clonedLogs = cloneDeep(logs);
    const wrongLogTypeIndex = clonedLogs.findIndex((log) => {
      const logTypeValidation = ['console', 'file', 'loki'].includes(log.type);
      let loggerChecks = true;
      if (log.type === 'file') {
        loggerChecks =
          log.path != undefined &&
          typeof log.path === 'string' &&
          log.level != undefined &&
          typeof log.level === 'string' &&
          log.maxSize != undefined &&
          typeof log.maxSize === 'string' &&
          log.maxFiles != undefined &&
          typeof log.maxFiles === 'string';
      }
      return !(loggerChecks && logTypeValidation);
    });
    if (wrongLogTypeIndex >= 0) {
      throw new Error(
        `unexpected config at path ${`logs[${wrongLogTypeIndex}]`}: ${JSON.stringify(
          logs[wrongLogTypeIndex],
        )}`,
      );
    }
    this.transports = clonedLogs;
  }
}
let internalConfig: ConfigType | undefined;
const getConfig = (): ConfigType => {
  const general = new Config();
  const logger = new LoggerConfig();
  internalConfig = {
    general,
    logger,
  };
  return internalConfig;
};

export { getConfig, Config };
