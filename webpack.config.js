const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const dev = process.env.NODE_ENV === 'dev'

const styleLoaders = [
    {
        loader: MiniCssExtractPlugin.loader,
        options: {
            hmr: process.env.NODE_ENV === 'development'
        }
    },
    'css-loader'
]

const config = {
    entry: {
        app: ['./assets/scss/app.scss', './assets/js/app.js']
    },
    resolve: {
        alias: {
            '@': path.resolve('./assets/js/'),
            '@css': path.resolve('./assets/css/'),
            '@scss': path.resolve('./assets/scss/')
        }
    },
    watch: dev,
    mode: dev ? 'development' : 'production',
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.bundle.css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: ['eslint-loader']
            },
            {
                test: /\.css$/,
                use: styleLoaders
            },
            {
                test: /\.scss$/,
                use: [...styleLoaders, 'sass-loader']
            },
        ]
    },
    output: {
        path: path.resolve(__dirname, 'public/assets'),
        filename: '[name].bundle.js'
    }

}

module.exports = config
