const webpack = require('webpack');
const path = require('path');

const browserConfig = {
	node: false,
	performance: {
		hints: false,
	},
	mode: 'production',
	// devtool:
	target: 'web',
	context: path.resolve(__dirname, 'src'),
	optimization: {
		minimize: true,
		// minimizer: [
		// 	new TerserPlugin({
		// 		cache: false,
		// 		//test: /\.js(\?.*)?$/i,
		// 		test: /\.min\.js$/
		// 	}),
		// ],
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
		globalObject: 'this',   // default=window
	},

	externals: {
		"aws-sdk": {
				commonjs: 'aws-sdk',
				commonjs2: 'aws-sdk',
				root: 'AWS'
		},
	},
	resolve: {
		fallback: {
			fs: false, // do not include a polyfill for fs
			tls: false,
			net: false,
			path: false,
			zlib: false,
			http: false,
			https: false,
			stream: false,
			crypto: false,
		}
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
