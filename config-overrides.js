const {
    override,
    addBabelPlugin,
    addBabelPreset,
    babelInclude,
    disableEsLint,
    addWebpackAlias,
    addWebpackModuleRule,
    addWebpackPlugin,
    removeModuleScopePlugin,
} = require("customize-cra");
const { TamaguiPlugin } = require('tamagui-loader')
const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");
const isProduction = process.env.NODE_ENV === "production";

module.exports = override(
    disableEsLint(),

    addBabelPreset(["@babel/preset-typescript"]),
    addBabelPreset(["module:@react-native/babel-preset", {"runtime": "automatic"}]),

    addBabelPlugin("@babel/plugin-transform-flow-strip-types"),
    addBabelPlugin("babel-plugin-transform-typescript-metadata"),
    addBabelPlugin(["@babel/plugin-proposal-decorators", { "legacy": true }]),
    addBabelPlugin(['@babel/plugin-transform-private-property-in-object', { "loose": true }]),
    addBabelPlugin(["@babel/plugin-proposal-class-properties", { "loose" : true }]),
    addBabelPlugin(['@babel/plugin-proposal-private-methods', { "loose": true }]),
    addBabelPlugin(["react-native-web", { commonjs: true }]),

    babelInclude([
        path.resolve(__dirname, 'node_modules/react-native-vector-icons'),
        path.resolve(__dirname, 'node_modules/react-native-ratings'),
        path.resolve(__dirname, 'src'),
    ]),
    removeModuleScopePlugin(),
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
    addWebpackModuleRule({
        test: /\.m?js/,
        resolve: {
            fullySpecified: false,
        }
    }),
    addWebpackPlugin(new TamaguiPlugin({
        config: './src/tamagui.config.ts',
        components: ['tamagui'], // matching the yarn add you chose above
        importsWhitelist: ['constants.js', 'colors.js'],
        logTimings: true,
        disableExtraction: process.env.NODE_ENV === 'development',
    })),
    // addWebpackPlugin(new CompressionPlugin({
    //     test: /\.js(\?.*)?$/i,
    // })),
);
