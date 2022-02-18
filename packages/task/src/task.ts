import { createRequire } from "module"
import { join } from "path"

import { Task } from "@phyla/core"
import expect from "expect"

const require = createRequire(import.meta.url)
const meta = require("../package.json")

export type Options = {
  package: string
}

export const task: Task<Options> = options => ({
  name: meta.name,
  version: meta.version,

  pre: function ({ describe, it }, ctx) {
    return [
      describe(`the package.json file`)
        .setup(async () => ({
          packageJson: JSON.parse(
            await ctx.fs.promises.readFile(join(ctx.cwd, "package.json"), "utf8")
          ),
        }))
        .assert(({ packageJson }) => [
          it(`exists`, async () => {
            expect(packageJson).toMatchObject({})
          }),
        ]),
    ]
  },

  run: async function (ctx) {
    const packageJson = JSON.parse(
      await ctx.fs.promises.readFile(join(ctx.cwd, "package.json"), "utf8")
    )

    packageJson.name = options.package

    await ctx.fs.promises.writeFile(
      join(ctx.cwd, "package.json"),
      JSON.stringify(packageJson, null, 2) + "\n"
    )
  },

  post: function ({ describe, it }, ctx) {
    return [
      describe(`the package.json file`)
        .setup(async () => ({
          packageJson: JSON.parse(
            await ctx.fs.promises.readFile(join(ctx.cwd, "package.json"), "utf8")
          ),
        }))
        .assert(({ packageJson }) => [
          it(`records the expected package name`, async () => {
            expect(packageJson.name).toBe(options.package)
          }),
        ]),
    ]
  },
})
