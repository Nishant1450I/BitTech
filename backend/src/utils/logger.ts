type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function sanitizeMessage(message: string): string {
  // Strip out potential secret patterns like tokens, passwords, database credentials
  return message
    .replace(/(hf_[A-Za-z0-9]+)/gi, '***HF_TOKEN***')
    .replace(/(:)([^:@/]+)(@)/gi, '$1***PASSWORD***$3')
    .replace(/(bearer\s+)([A-Za-z0-9._-]+)/gi, '$1***BEARER_TOKEN***');
}

export const logger = {
  info: (message: string, meta?: unknown) => {
    const timestamp = new Date().toISOString();
    const cleanMsg = sanitizeMessage(message);
    if (meta) {
      console.log(`[${timestamp}] [INFO] ${cleanMsg}`, meta);
    } else {
      console.log(`[${timestamp}] [INFO] ${cleanMsg}`);
    }
  },
  warn: (message: string, meta?: unknown) => {
    const timestamp = new Date().toISOString();
    const cleanMsg = sanitizeMessage(message);
    if (meta) {
      console.warn(`[${timestamp}] [WARN] ${cleanMsg}`, meta);
    } else {
      console.warn(`[${timestamp}] [WARN] ${cleanMsg}`);
    }
  },
  error: (message: string, error?: unknown) => {
    const timestamp = new Date().toISOString();
    const cleanMsg = sanitizeMessage(message);
    if (error) {
      console.error(`[${timestamp}] [ERROR] ${cleanMsg}`, error);
    } else {
      console.error(`[${timestamp}] [ERROR] ${cleanMsg}`);
    }
  },
  debug: (message: string, meta?: unknown) => {
    if (process.env.NODE_ENV !== 'production') {
      const timestamp = new Date().toISOString();
      const cleanMsg = sanitizeMessage(message);
      if (meta) {
        console.debug(`[${timestamp}] [DEBUG] ${cleanMsg}`, meta);
      } else {
        console.debug(`[${timestamp}] [DEBUG] ${cleanMsg}`);
      }
    }
  },
};
