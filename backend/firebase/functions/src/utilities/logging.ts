import * as functions from 'firebase-functions';

// eslint-disable-next-line no-shadow
export enum LogSeverity {
  'DEBUG',
  'INFO',
  'NOTICE',
  'WARNING',
  'ERROR',
  'CRITICAL',
  'ALERT',
  'EMERGENCY',
}

export const good = (res: functions.Response, ...message: any[]) => {
  log(LogSeverity.DEBUG, message);
  res.status(200).json(JSON.stringify(message)).send();
};
export const bad = (res: functions.Response, ...message: any[]) => {
  log(LogSeverity.ERROR, message);
  res.status(500).json(JSON.stringify(message)).send();
};
export const unauth = (res: functions.Response, ...message: any[]) => {
  log(LogSeverity.WARNING, message);
  res.status(401).json(JSON.stringify(message)).send();
};
export const log = (severity?: LogSeverity, ...message: any[]) => {
  switch (severity) {
    case LogSeverity.DEBUG:
      functions.logger.debug(message);
      break;
    case LogSeverity.INFO:
      functions.logger.info(message);
      break;
    case LogSeverity.NOTICE:
      functions.logger.info(message);
      break;
    case LogSeverity.WARNING:
      functions.logger.warn(message);
      break;
    case LogSeverity.ERROR:
      functions.logger.error(message);
      break;
    case LogSeverity.CRITICAL:
      functions.logger.error(message);
      break;
    case LogSeverity.ALERT:
      functions.logger.log(message);
      break;
    case LogSeverity.EMERGENCY:
      functions.logger.error(message);
      break;
    default:
      functions.logger.log(message);
      break;
  }
};
