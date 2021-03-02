const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const nodeExternals = require('webpack-node-externals');
module.exports = {
    entry: './src/index.js',
    externals: [nodeExternals()],
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        library: '',
        libraryTarget: 'umd'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({ patterns: [{ from: 'src/index.d.ts', to: 'index.d.ts' },], })
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        "presets": ["@babel/preset-react"],
                        "plugins": ["@babel/plugin-proposal-class-properties"]
                    }
                }
            }
        ]
    }
}