export default function () {
  return {
    files: [
      "./package.json",
      "./packages/**/*.{ts,json}",
      "!./packages/**/*.spec.ts",
    ],
    tests: ["./packages/**/*.spec.ts"],
    runMode: "onsave",
    testFramework: "jest",
    workers: { restart: true },
    env: {
      type: "node",
      runner: "node",
      params: {
        runner: "--experimental-vm-modules",
      },
    },
  }
}
