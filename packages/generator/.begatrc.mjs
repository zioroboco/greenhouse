#!/usr/bin/env node --experimental-specifier-resolution=node

import { basename, dirname } from "path"
import { begat } from "begat"
import { diff } from "begat/std/diff"
import { fileURLToPath } from "url"
import { generatorGenerator } from "./index"

const directoryBasename = basename(dirname(fileURLToPath(import.meta.url)))

begat
  .compose([generatorGenerator])
  .withOptions({ generatorName: directoryBasename })
  .then(diff)
