import { Volume, VolumeInstance, fsFromVolume } from "begat/core/volume"
import { generatorGenerator } from "./index"

const generatorName = "test"

describe(generatorGenerator.name, () => {
  let volume: VolumeInstance
  let fs: typeof import("fs").promises

  beforeAll(async () => {
    volume = new Volume()
    fs = fsFromVolume(volume).promises
    await generatorGenerator({ generatorName })({ volume })
  })

  it(`outputs the expected files`, async () => {
    const files = await fs.readdir("/")
    expect(files).toMatchObject(
      expect.arrayContaining([
        ".begatrc.mjs",
        "index.spec.ts",
        "index.ts",
        "jest.config.mjs",
        "package.json",
        "tsconfig.json",
      ])
    )
  })

  describe(`the cloned package.json file`, () => {
    let packageJson: any

    beforeAll(async () => {
      packageJson = JSON.parse(await fs.readFile("/package.json", "utf8"))
    })

    it(`includes the name of the new generator`, async () => {
      expect(packageJson.name).toEqual("@zioroboco/generator-test")
    })

    it(`includes the directory of the new generator`, async () => {
      expect(packageJson.repository.directory).toEqual("packages/test")
    })

    it(`has the package version reset`, async () => {
      expect(packageJson.version).toEqual("0.0.0")
    })
  })
})
