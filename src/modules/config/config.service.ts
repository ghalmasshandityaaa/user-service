import { Injectable, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
dotenv.config();

@Injectable()
export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor(filePath: string) {
    try {
      this.envConfig = dotenv.parse(fs.readFileSync(filePath));
    } catch (e) {
      Logger.warn(`File ${filePath} not found, app will use process.env`);
    }
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  getInt(key: string): number {
    return parseInt(this.envConfig[key], 10);
  }

  getBoolean(key: string): boolean {
    return this.envConfig[key] === 'true';
  }

  getObject<T>(key: string): T {
    try {
      return JSON.parse(this.envConfig[key]) as T;
    } catch (e) {
      return null;
    }
  }

  getArray(key: string): string[] {
    if (!this.envConfig[key]) {
      return [];
    }

    try {
      return this.envConfig[key].split(',');
    } catch (e) {
      return [];
    }
  }
}
