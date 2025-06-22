import { PathLike, readdirSync, statSync } from "fs";
import path from "path";

export async function loadStructures<T>(dir: PathLike, recursive = true, type?: string): Promise<T[]> {
  const statDir = statSync(dir);
  if (!statDir.isDirectory()) {
    throw new Error(`'${dir}' klasör değil.`);
  }
  const files = readdirSync(dir);
  const structures: T[] = [];

  for (const file of files) {
    const fullPath = path.join(dir.toString(), file);
    const statFile = statSync(fullPath);

    if (statFile.isDirectory() && recursive) {
      structures.push(...(await loadStructures<T>(fullPath, recursive, type)));
      continue;
    }

    if (!file.endsWith(".js") && !file.endsWith(".ts")) {
      // console.error(`[${type}] ${file} atlanıyor...`);
      continue;
    }

    try {
      const structure = require(path.join(dir.toString(), file)).default;
      //  console.debug(`[${type}] ${file} yükleniyor...`);
      structures.push(structure);
    } catch (error) {
      //   console.error(`[${type}] ${file} yüklenemedi: ${error}`);
    }
  }

  return structures;
}
export async function loadMap<T extends { data: { name: string } }>(dir: PathLike, recursive = true, type?: string): Promise<Map<string, T>> {
  const items = await loadStructures<T>(dir, recursive, type);
  return items.reduce((acc, cur) => acc.set(cur.data.name, cur), new Map<string, T>());
}
export async function loadArray<T>(dir: PathLike, recursive = true, type?: string): Promise<T[]> {
  return await loadStructures<T>(dir, recursive, type);
}
