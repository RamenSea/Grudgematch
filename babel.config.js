module.exports = {
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose" : true }],
    "babel-plugin-parameter-decorator",
  ],
  "presets": [["module:metro-react-native-babel-preset", { "onlyRemoveTypeImports": true }]]
};
