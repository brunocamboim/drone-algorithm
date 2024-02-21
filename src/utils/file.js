import fs from 'node:fs/promises';

export async function directoryExists(path) {
  try {
      const stats = await fs.stat(path);
      return stats.isDirectory();
  } catch (error) {
      if (error.code === 'ENOENT') {
          // ENOENT: no such file or directory
          return false;
      } else {
          // Other error, re-throw
          throw error;
      }
  }
}