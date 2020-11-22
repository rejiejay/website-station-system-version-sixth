import { PathLike } from 'fs';
import * as path from 'path';

const __dirname = path.resolve(path.dirname(''));

export const projectRelativePath = (relativePath): PathLike => path.join(__dirname, path.relative(__dirname, relativePath));
