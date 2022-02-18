import { Volume, createFsFromVolume } from "memfs"
import { expect, test } from "@jest/globals"
import { run } from "@phyla/core"

import { Options, task } from "./task.js"

const cwd = "/my-project"

test(`the happy path`, async () => {
  const volume = Volume.fromJSON(
    {
      "package.json": JSON.stringify({
        name: "test",
        version: "1.0.0",
      }),
    },
    cwd
  )

  const options: Options = {
    package: "my-package",
  }

  await run(task(options), {
    // @ts-ignore
    fs: createFsFromVolume(volume),
    cwd,
    pipeline: { next: [], prev: [] },
  })

  const output = volume.toJSON()

  const renderedPackageJson = JSON.parse(String(output[`${cwd}/package.json`]))

  expect(renderedPackageJson).toMatchObject({
    name: "my-package",
    version: "1.0.0",
  })
})
