import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Recursively collects markdown file paths under a directory.
 *
 * @param rootDirectory - Absolute path of the directory to scan.
 * @returns Absolute paths of markdown files.
 */
async function getMarkdownFilePaths(rootDirectory: string): Promise<string[]> {
  const entries = await readdir(rootDirectory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const resolvedPath = path.join(rootDirectory, entry.name);
      if (entry.isDirectory()) {
        return getMarkdownFilePaths(resolvedPath);
      }
      if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
        return [resolvedPath];
      }
      return [];
    }),
  );

  return files.flat();
}

/**
 * Loads markdown knowledge files and returns file path with text content.
 *
 * @param directoryFromProjectRoot - Relative directory from project root.
 * @returns Knowledge documents with relative source and content.
 */
export async function loadMarkdownKnowledge(
  directoryFromProjectRoot: string,
): Promise<Array<{ source: string; content: string }>> {
  const projectRoot = process.cwd();
  const absoluteRoot = path.resolve(projectRoot, directoryFromProjectRoot);
  const markdownFiles = await getMarkdownFilePaths(absoluteRoot);

  const documents = await Promise.all(
    markdownFiles.map(async (filePath) => {
      const content = await readFile(filePath, "utf8");
      return {
        source: path.relative(projectRoot, filePath).replaceAll("\\", "/"),
        content,
      };
    }),
  );

  return documents;
}
