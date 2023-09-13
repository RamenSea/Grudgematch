const {
    override,
    addBabelPlugin,
    addBabelPresets,
    disableEsLint,

} = require("customize-cra");
// const path = require("path");

module.exports = override(
    disableEsLint(),

    addBabelPresets(["@babel/preset-typescript"]),
    addBabelPlugin("@babel/plugin-transform-flow-strip-types"),
    addBabelPlugin("babel-plugin-transform-typescript-metadata"),
    addBabelPlugin(["@babel/plugin-proposal-decorators", { "legacy": true }]),
    addBabelPlugin(['@babel/plugin-transform-private-property-in-object', { "loose": true }]),
    addBabelPlugin(["@babel/plugin-proposal-class-properties", { "loose" : true }]),
    addBabelPlugin(['@babel/plugin-proposal-private-methods', { "loose": true }]),
    addBabelPlugin(["react-native-web", { commonjs: true }]),
);
