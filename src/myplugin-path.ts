import path from "path";

export function parsemypluginPath({
  filepath,
  rootDir,
}: { filepath: string, rootDir: string }) {
  const ext = path.extname(filepath);
  const filename = path.basename(filepath, ext);
  const dirname = path.dirname(filepath);

  if (dirname.substr(0, rootDir.length) !== rootDir) {
    throw new Error(
      `received unexpected file ${filepath} that was not in root directory: ${rootDir}`
    );
  }

  const localDirnameWithScope = `${dirname.substr(rootDir.length)}/`;

  const { localDirname, scope } = localDirnameWithScope.match(
    /^(?<localDirname>.*?\/)((?<scope>__.*__)\/)?$/
  )?.groups!;

  return { filename, ext, localDirname, scope };
};
