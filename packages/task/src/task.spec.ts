import { Volume, createFsFromVolume } from "memfs"
import { expect, it } from "@jest/globals"
import { run } from "@phyla/core"

import { task } from "./task.js"

const cwd = "/somewhere/project"

it(`clones its own package.json`, async () => {
  const volume = Volume.fromJSON(
    {
      "package.json": JSON.stringify({
        name: "test",
        version: "1.0.0",
        dependencies: {
          "dep-one": "1.0.0",
          "dep-two": "2.0.0",
        },
      }),
    },
    cwd
  )

  await run(task({}), {
    // @ts-ignore
    fs: createFsFromVolume(volume),
    cwd,
    pipeline: { next: [], prev: [] },
  })

  const output = volume.toJSON()

  const renderedPackageJson = JSON.parse(String(output[`${cwd}/package.json`]))

  expect(renderedPackageJson).toMatchObject({
    name: "@zioroboco/phyla-project",
    version: "0.0.0",
    dependencies: {
      "expect": expect.any(String),
      "dep-one": "1.0.0",
      "dep-two": "2.0.0",
    },
  })
})
