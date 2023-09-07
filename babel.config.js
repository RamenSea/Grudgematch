module.exports = {
  "plugins": [
    "@babel/plugin-transform-flow-strip-types",
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ['@babel/plugin-transform-private-property-in-object', { "loose": true }],
    ["@babel/plugin-proposal-class-properties", { "loose" : true }],
    ['@babel/plugin-proposal-private-methods', { "loose": true }],
    "babel-plugin-parameter-decorator",
  ],
  "presets": [["module:metro-react-native-babel-preset", { "onlyRemoveTypeImports": true }]],
};
