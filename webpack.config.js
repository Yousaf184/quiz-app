const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    // devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                          publicPath: path.resolve(__dirname, 'dist'),
                          hmr: process.env.NODE_ENV === 'development'
                        },
                    },
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif|mp3)$/,
                loader: 'file-loader',
                options: {
                    name: '[folder]/[name].[ext]',
                    outputPath: 'assets',
                }
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({ignoreOrder: false}),
        new HtmlWebpackPlugin({
            title: 'Quiz',
            template: './index.html',
        }),
        new CleanWebpackPlugin()
    ],
    optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    }
};