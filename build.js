({
  baseUrl: ".",
  paths: {
    ko: "node_modules/knockout/build/output/knockout-latest.js",
    text: "node_modules/text/text",
    components: 'src/components',
  },
  name: "src/main",
  out: "nm.bundle.js",
  generateSourceMaps: true
})
