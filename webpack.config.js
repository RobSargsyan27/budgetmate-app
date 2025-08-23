const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const PurgecssPlugin = require('purgecss-webpack-plugin').PurgeCSSPlugin
const glob = require('glob-all')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    devtool: 'source-map',
    entry: {
        index: './src/assets/js/index.js',
        login: './src/assets/js/login.js',
        register: './src/assets/js/register.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].bundle.js',
        publicPath: '/',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ]
            },
            {
                test: /\.css$/i,
                use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'img/[name].[contenthash][ext]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name].[ext]'
                }
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: 'css/[name].css' }),
        new PurgecssPlugin({ paths: glob.sync(path.join(__dirname, 'src/**/*'), { nodir: true }) }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            chunks: [ 'index' ],
            inject: true
        }),
        new HtmlWebpackPlugin({
            template: './src/login.html',
            filename: 'login.html',
            chunks: [ 'login' ],
            inject: true
        }),
        new HtmlWebpackPlugin({
            template: './src/register.html',
            filename: 'register.html',
            chunks: [ 'register' ],
            inject: true
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/assets/components'),
                    to: path.resolve(__dirname, 'dist/components')
                },
                {
                    from: path.resolve(__dirname, 'src/assets/img'),
                    to: path.resolve(__dirname, 'dist/img')
                }
            ],
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [ new CssMinimizerPlugin() ],
        splitChunks: { chunks: 'all' }
    },
    devServer: {
        static: { directory: path.resolve('dist') },
        hot: false,
        liveReload: true,
        open: true
    }
}
