const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin').PurgeCSSPlugin;
const glob = require('glob-all');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    mode: 'development',
    entry: {
        index: './src/assets/js/dashboard.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[contenthash].bundle.js',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader',],
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({filename: 'css/[name].[contenthash].css' }),
        new PurgecssPlugin({ paths: glob.sync(path.join(__dirname, 'src/**/*'), {nodir: true}) }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['index'],
        })
    ],
    optimization: {
        minimize: true,
        minimizer: [new CssMinimizerPlugin()]
    },
    devServer: {
        static: {directory: path.resolve('dist')},
        hot: false,
        liveReload: true,
        open: true
    }
};
