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
 * Resolves a user-provided knowledge directory and enforces project-root bounds.
 *
 * @param projectRoot - Absolute project root path.
 * @param directoryFromProjectRoot - Relative input directory from request/options.
 * @returns Absolute directory path constrained to the current project root.
 * @throws Error when path is empty, absolute, or escapes project root.
 */
function resolveSafeKnowledgeDirectory(
  projectRoot: string,
  directoryFromProjectRoot: string,
): string {
  const trimmedDirectory = directoryFromProjectRoot.trim();
  if (!trimmedDirectory) {
    throw new Error("Knowledge directory must not be empty.");
  }

  if (path.isAbsolute(trimmedDirectory)) {
    throw new Error("Knowledge directory must be a project-relative path.");
  }

  const absoluteRoot = path.resolve(projectRoot, trimmedDirectory);
  const dataRoot = path.resolve(projectRoot, "data");
  const relativeToDataRoot = path.relative(dataRoot, absoluteRoot);
  const relativeToRoot = path.relative(projectRoot, absoluteRoot);
  const escapesProjectRoot =
    relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot);
  const escapesDataRoot =
    relativeToDataRoot.startsWith("..") || path.isAbsolute(relativeToDataRoot);

  if (escapesProjectRoot) {
    throw new Error("Knowledge directory cannot escape the project root.");
  }

  if (escapesDataRoot) {
    throw new Error("Knowledge directory must stay inside the data directory.");
  }

  return absoluteRoot;
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
  const absoluteRoot = resolveSafeKnowledgeDirectory(
    projectRoot,
    directoryFromProjectRoot,
  );
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
