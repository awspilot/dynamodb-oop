
browserify \
	-x async\
	-x assert\
	-x dynalite\
	-x memdown\
	-x mocha\
	-x browserify\
	-x browserify-shim\
	-x aws-sdk\
	-x promise\
	browserify.js -o ./dist/dynamodbjs.js
