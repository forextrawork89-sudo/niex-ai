import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export async function loadOntologyFiles(): Promise<Record<string, unknown>> {
  const root = resolve(__dirname, '..', 'ontology');
  const files = ['safety-ontology.json', 'domain-mappings.json', 'domain-knowledge.json'];
  const data: Record<string, unknown> = {};
  for (const file of files) {
    const content = await readFile(resolve(root, file), 'utf8');
    data[file] = JSON.parse(content);
  }
  return data;
}
