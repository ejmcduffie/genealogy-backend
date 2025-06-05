import winston from 'winston';

const { format, transports } = winston;
const { combine, timestamp, printf, colorize, errors } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, service, ...meta }) => {
  const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
  return `${timestamp} [${service}] ${level}: ${message} ${metaString}`;
});

// Create a logger instance
export const createLogger = (service: string) => {
  const isProd = process.env.NODE_ENV === 'production';
  
  return winston.createLogger({
    level: isProd ? 'info' : 'debug',
    defaultMeta: { service },
    format: combine(
      errors({ stack: true }),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      logFormat
    ),
    transports: [
      // Console transport with colors for development
      new transports.Console({
        format: combine(
          colorize(),
          timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          logFormat
        )
      }),
      // File transport for production
      ...(isProd ? [
        new transports.File({ 
          filename: 'logs/error.log', 
          level: 'error',
          maxsize: 10485760, // 10MB
          maxFiles: 5,
        }),
        new transports.File({ 
          filename: 'logs/combined.log',
          maxsize: 10485760, // 10MB
          maxFiles: 5,
        })
      ] : [])
    ]
  });
};

