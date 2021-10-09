import { clone } from "begat/std/clone"
import { createRequire } from "module"
import { dirname } from "path"
import { fsFromVolume } from "begat/core/volume"
import type { Generator } from "begat/core/api"

type Options = {
  generatorName: string
}

const require = createRequire(import.meta.url)
const clonePath = dirname(require.resolve("@zioroboco/generator-generator"))

export const generatorGenerator: Generator<Options> = function (options) {
  return async context => {
    // TODO clone should set ignore patterns (e.g. for compiler outputs)
    await clone({ clone: { path: clonePath } })(context)

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
