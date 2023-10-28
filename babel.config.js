module.exports = {
  "plugins": [
    "@babel/plugin-transform-flow-strip-types",
    ["babel-plugin-transform-typescript-metadata"],
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ['@babel/plugin-transform-private-property-in-object', { "loose": true }],
    ["@babel/plugin-proposal-class-properties", { "loose" : true }],
    ['@babel/plugin-proposal-private-methods', { "loose": true }],

    "babel-plugin-parameter-decorator",
    [
      '@tamagui/babel-plugin',
      {
        components: ['tamagui'],
        config: './src/tamagui.config.ts',
        importsWhitelist: ['constants.js', 'colors.js'],
        logTimings: true,
        disableExtraction: process.env.NODE_ENV === 'development',
      }
    ],
  ],
  "presets": [["module:metro-react-native-babel-preset", { "onlyRemoveTypeImports": true }]],
};
