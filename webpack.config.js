const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: 'quiz.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist');
    },
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
                test: /\.(png|svg|jpg|gif)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'assets',
                }
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({ignoreOrder: false}),
        new HtmlWebpackPlugin({title: 'Quiz'}),
    ],
    optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    }
};