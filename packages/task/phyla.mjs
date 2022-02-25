import { pipeline } from "@phyla/core"

export default pipeline({
  tasks: [
    import("@zioroboco/phyla-task")
  ],
})
