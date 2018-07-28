import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

export enum LoggingLevel {
  TRACE,
  DEBUG,
  INFO,
  WARNING,
  ERROR
}

let currentLoggingLevel = LoggingLevel.INFO;

export function setLoggingLevel(loggingLevel: LoggingLevel) {
  currentLoggingLevel = loggingLevel;
}

export const debug = (level: number, message: string) =>
  (source: Observable<any>) => source
    .pipe(
      tap(value => {
        if (level >= currentLoggingLevel) {
          console.log(message + ': ' + value);
        }
      })
    );
