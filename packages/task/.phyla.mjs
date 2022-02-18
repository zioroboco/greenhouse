import { config } from "@phyla/core"
import { task } from "@zioroboco/phyla-task"

export default config({
  pipeline: [task],
  options: {
    package: "@zioroboco/phyla-task"
  }
})
