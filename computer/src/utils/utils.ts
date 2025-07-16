import path from 'path';
import fs from 'fs';
import { getMainWindow } from '../models/mainWindow';

function safeParseJSON(input: any): any {
    if (typeof input === 'string') {
        try {
            return JSON.parse(input);
        } catch (e) {
            console.error("JSON parse error:", e);
            return null;
        }
    }
    return input;
}

function getTemplate(name: string): string {
  return path.join(__dirname, '..', '..', 'web', 'template', `${name}.html`);
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============ debug ============
function debugLog(msg: string): void {
  const now = new Date();
  const time = now.toLocaleTimeString();
  
  console.log(`[${time}] ${msg}`);
}

export { safeParseJSON, getTemplate, delay, debugLog };