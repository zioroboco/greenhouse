#!/usr/bin/env node

import * as begat from "begat"
import { basename, dirname } from "path"
import { diff } from "begat/std/diff"
import { fileURLToPath } from "url"
import { generatorGenerator } from "@zioroboco/generator-generator"

const directoryBasename = basename(dirname(fileURLToPath(import.meta.url)))

begat
  .pipeline([generatorGenerator])
  .withOptions({ generatorName: directoryBasename })
  .then(diff)
