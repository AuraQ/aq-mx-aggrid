/** Signature of a logging function */
export interface LogFunction {
  (message?: any, ...optionalParams: any[]): void;
}

/** Basic logger interface */
export interface Logger {
  debug: LogFunction;
  log: LogFunction;
  warn: LogFunction;
  error: LogFunction;
}

export type LogLevel = 'debug' | 'log' | 'warn' | 'error';

const NO_OUTPUT: LogFunction = (_message?: any, ..._optionalParams: any[]) => {};

export class ConsoleLogger implements Logger {
  readonly debug: LogFunction;
  readonly log: LogFunction;
  readonly warn: LogFunction;
  readonly error: LogFunction;

  constructor(options?: { level : LogLevel }) {
    const { level } = options || {};

    this.error = console.error.bind(console);
    if (level === 'error') {
      this.warn = NO_OUTPUT;
      this.log = NO_OUTPUT;
      this.debug = NO_OUTPUT;

      return;
    }

    this.warn = console.warn.bind(console);
    if (level === 'warn') {
      this.log = NO_OUTPUT;
      this.debug = NO_OUTPUT;

      return;
    }

    this.log = console.log.bind(console);
    if (level === 'log') {
      this.debug = NO_OUTPUT;

      return;
    }

    this.debug = console.debug.bind(console);
  }
}

