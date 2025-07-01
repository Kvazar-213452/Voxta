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
  return path.join(__dirname, '..', '..', '..', 'web', 'template', `${name}.html`);
}

function loadIndexTemplate(): void {
  let templates: Record<string, string> = {};
  let names = ["settings", "addChat"];

  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const filePath = getTemplate(name);

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      templates[name] = content;
    } catch (err) {
      console.error(`Error reading template ${name}:`, err);
      templates[name] = "";
    }
  }
  
  getMainWindow().webContents.send('reply', { type: "load_template", templates: templates });
}

export { safeParseJSON, getTemplate, loadIndexTemplate };