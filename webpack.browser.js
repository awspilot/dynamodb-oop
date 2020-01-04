const webpack = require('webpack');
const path = require('path');
//const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // no support for ES6+
const TerserPlugin = require('terser-webpack-plugin'); // support for ES6+ (succesor of uglify-es)



const browserConfig = {
	node: false,
	node: {
		fs: "empty",
		Buffer: false, // still embeds Buffer
	},
	mode: 'production',
	// devtool:
	target: 'web',
	context: path.resolve(__dirname, 'src'),
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				cache: false,
				//test: /\.js(\?.*)?$/i,
				test: /\.min\.js$/
			}),
		],
	},
	plugins: [
	],
	entry: {
		'dynamodbjs': path.resolve(__dirname, './lib/dynamodb.js'),
		'dynamodbjs.min': path.resolve(__dirname, './lib/dynamodb.js')
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
		library: '@awspilot/dynamodb',


		libraryTarget: 'umd',
		umdNamedDefine: true,   // Important
		globalObject: 'this',
	},

	externals: {
		"aws-sdk": {
				commonjs: 'AWS',
				commonjs2: 'AWS',
				amd: 'AWS',
				root: 'AWS'
		},
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "ifdef-loader",
						options: {
							BROWSER: true,
							//BUNDLE_AWS_SDK: false,
							BUILD_WITH_SQL: true,
						}
					},
					{loader: 'babel-loader'},
				]
			}
		]
	}
}

module.exports = [ browserConfig ];
