const webpack = require('webpack');
const path = require('path');

module.exports = {
	entry: './app/index.js',
	output: {
		path: path.resolve(__dirname, 'assets/js'),
		publicPath: '/assets/js/',
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loaders: ['react-hot-loader', 'babel-loader?presets[]=react,presets[]=es2015']
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader'
			},
			{
				test: /(\.eot|\.woff2|\.woff|\.ttf|\.svg)/,
				loader: 'file-loader'
			},
			{
				test: /\.(png|jpg)$/,
				loader: 'url-loader?limit=8192'
			}
		]	
	},
	devServer: {
		inline: true
	},
	resolve: {
		extensions: ['.js', '.css']
	}
};

