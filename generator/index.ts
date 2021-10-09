import { clone } from "begat/std/clone"
import { dirname } from "path"
import { fileURLToPath } from "url"
import { fsFromVolume } from "begat/core/volume"
import type { Generator } from "begat/core/api"

const __dirname = dirname(fileURLToPath(import.meta.url))

type Options = {
  generatorName: string
}

export const generatorGenerator: Generator<Options> = function (options) {
  return async context => {
    // TODO clone should take ignore patterns (e.g. for compiler outputs)
    await clone({ clonePath: __dirname })(context)

    const fs = fsFromVolume(context.volume).promises

    const packageJson = JSON.parse(
      await fs.readFile("/package.json", "utf8")
    )

    packageJson.name = `@zioroboco/generator-${options.generatorName}`
    packageJson.repository.directory = `packages/${options.generatorName}`
    packageJson.version = "0.0.0"

    await fs.writeFile(
      "/package.json",
      JSON.stringify(packageJson, null, 2) + "\n", // TODO format with prettier
    )

    // TODO output a simpler template generator
    // (Using clone for the package.json etc. is fine...)
    return context
  }
}
