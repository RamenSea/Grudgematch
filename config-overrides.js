const {
    override,
    addBabelPlugin,
    addBabelPresets,
    babelInclude,
    disableEsLint,

} = require("customize-cra");
const path = require("path");

module.exports = override(
    disableEsLint(),

    addBabelPresets(["@babel/preset-typescript"]),
    addBabelPresets(["@babel/preset-react"]),
    addBabelPlugin("@babel/plugin-transform-flow-strip-types"),
    addBabelPlugin("babel-plugin-transform-typescript-metadata"),
    addBabelPlugin(["@babel/plugin-proposal-decorators", { "legacy": true }]),
    addBabelPlugin(['@babel/plugin-transform-private-property-in-object', { "loose": true }]),
    addBabelPlugin(["@babel/plugin-proposal-class-properties", { "loose" : true }]),
    addBabelPlugin(['@babel/plugin-proposal-private-methods', { "loose": true }]),
    addBabelPlugin(["react-native-web", { commonjs: true }]),
    babelInclude([
        path.resolve(__dirname, 'node_modules/@rneui/base'),
        path.resolve(__dirname, 'node_modules/@rneui/themed'),
        path.resolve(__dirname, 'node_modules/react-native-vector-icons'),
        path.resolve(__dirname, 'node_modules/react-native-ratings'),
        path.resolve(__dirname, 'src'),
    ])
);
