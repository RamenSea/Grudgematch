const {
    override,
    addBabelPlugin,
    addBabelPreset,
    babelInclude,
    disableEsLint,
    addWebpackAlias,
    addWebpackModuleRule
} = require("customize-cra");
const path = require("path");

module.exports = override(
    disableEsLint(),

    addBabelPreset(["@babel/preset-typescript"]),
    addBabelPreset(["@babel/preset-react", {"runtime": "automatic"}]),

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
    ]),

    addWebpackAlias({
        "react-native$": "react-native-web",
        "react-native-linear-gradient": "react-native-web-linear-gradient",
    }),

    addWebpackModuleRule({
        test: /\.svg$/,
        exclude: /node_modules/,
        use: [
            {
                loader: '@svgr/webpack',
            },
        ],
    }),
);


//
// ...addBabelPlugins([
//     "@babel/plugin-transform-flow-strip-types",
//     "babel-plugin-transform-typescript-metadata"
//         ["@babel/plugin-proposal-decorators", { "legacy": true }],
//     ['@babel/plugin-transform-private-property-in-object', { "loose": true }],
//     ["@babel/plugin-proposal-class-properties", { "loose" : true }],
//     ['@babel/plugin-proposal-private-methods', { "loose": true }],
//     "babel-plugin-parameter-decorator",
//     ["react-native-web", { commonjs: true }]
// ]),
// ...addBabelPresets([
//
//     "@babel/preset-typescript",
//     ["@babel/preset-react", {"runtime": "automatic"}]
// ]),
//     babelInclude([
//         path.resolve(__dirname, 'node_modules/@rneui/base'),
//         path.resolve(__dirname, 'node_modules/@rneui/themed'),
//         path.resolve(__dirname, 'node_modules/react-native-vector-icons'),
//         path.resolve(__dirname, 'node_modules/react-native-ratings'),
//         path.resolve(__dirname, 'src'),
//     ]),
//     addWebpackAlias({
//         "react-native$": "react-native-web",
//         "react-native-linear-gradient": "react-native-web-linear-gradient",
//     })