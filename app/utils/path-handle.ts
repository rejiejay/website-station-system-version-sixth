import { PathLike } from 'fs';
import * as path from 'path';

const driveName = path.resolve(path.dirname(''));

export const projectRelativePath = (relativePath): PathLike => path.join(driveName, path.relative(driveName, relativePath));
