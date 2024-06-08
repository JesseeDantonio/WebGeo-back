const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: './public/ts/client/index.ts', // Remplacez par le chemin de votre fichier JavaScript principal
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.ts'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
        ],
    },
};
