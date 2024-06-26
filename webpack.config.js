const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: './public/ts/server/index.ts', // Remplacez par le chemin de votre fichier JavaScript principal,
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
