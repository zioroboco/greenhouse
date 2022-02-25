import * as path from "path"
import { createRequire } from "module"

import { mergeDeepLeft } from "ramda"
import { task } from "@phyla/core"

const require = createRequire(import.meta.url)
const meta = require("../package.json")

export default task(() => ({
  name: meta.name,
  version: meta.version,

  run: async function (ctx) {
    const template = require("@zioroboco/phyla-task/package.json") //?
    const packageJson = mergeDeepLeft(
      template,
      JSON.parse(
        await ctx.fs.promises.readFile(
          path.join(ctx.cwd, "package.json"),
          "utf8"
        )
      )
    )

    const dirname = path.basename(ctx.cwd)
    packageJson.name = `@zioroboco/phyla-${dirname}`
    packageJson.repository.directory = `packages/${dirname}`

    await ctx.fs.promises.writeFile(
      path.join(ctx.cwd, "package.json"),
      JSON.stringify(packageJson, null, 2) + "\n"
    )
  },
}))
