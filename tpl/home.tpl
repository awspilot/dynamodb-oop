
<h1>@Awspilot's DynamoDB</h1>

<span class="octicon octicon-link">Speak fluent DynamoDB, write code with fashion, I Promise() 😃</span>

<p style='color: #666666;'>

	<br>

	<a href='https://travis-ci.org/awspilot/dynamodb-oop' target="_blank"><img src='https://travis-ci.org/awspilot/dynamodb-oop.svg?branch=master'/></a>
	<a href='https://badge.fury.io/js/%40awspilot%2Fdynamodb' target="_blank"><img src='https://badge.fury.io/js/%40awspilot%2Fdynamodb.svg' /></a>

	<a href='https://www.npmjs.com/package/@awspilot/dynamodb' target="_blank"><img src='https://img.shields.io/npm/dm/@awspilot/dynamodb.svg?maxAge=2592000' /></a>
	<a href='https://www.npmjs.com/package/@awspilot/dynamodb' target="_blank"><img src='https://img.shields.io/npm/dy/@awspilot/dynamodb.svg?maxAge=2592000' /></a>
	<a href='https://www.npmjs.com/package/@awspilot/dynamodb' target="_blank"><img src='https://img.shields.io/npm/dt/@awspilot/dynamodb.svg?maxAge=2592000' /></a>

	<a href='https://github.com/awspilot/dynamodb-oop' target="_blank"><img src='https://img.shields.io/github/license/awspilot/dynamodb-oop.svg' /></a>


	<a href='https://david-dm.org/awspilot/dynamodb-oop' target="_blank"><img src='https://david-dm.org/awspilot/dynamodb-oop.svg' /></a>

</p>

<p>
	@awspilot/dynamodb is a NodeJS and Browser utility to access Amazon DynamoDB databases<br>
	
	Main library goals are:<br>
	<li> Compatible with all NodeJS versions ( no ES6+ )
	<li> Backword compatible with all previous versions
	<li> Lightweight ( depends only on aws-sdk and promise )
	<li> Good readability of the code

</p>



<h1>Install in NodeJS</h1>

<div class="code bash">

	npm install @awspilot/dynamodb

	// check for new versions
	npm outdated

	// upgrade if necessary
	npm update @awspilot/dynamodb

</div>

<h1>Install in Browser</h1>

<p> 
	Please use <a href="https://rawgit.com/ ">rawgit</a> CDN, to get the latest version paste the url:<br>
	https://github.com/awspilot/dynamodb-oop/blob/master/dist/dynamodbjs.js
</p>
<div class="code html">

	&lt;!DOCTYPE html>
	&lt;html>
		&lt;head>
			&lt;script src="https://sdk.amazonaws.com/js/aws-sdk-2.247.1.min.js">&lt;/script>
			&lt;script src="https://rawgit.com/awspilot/dynamodb-oop/master/dist/dynamodbjs.js">&lt;/script>
		&lt;/head>
		&lt;body>
		&lt;/body>
	&lt;/html>

</div>