
<h1>Tests</h1>
<p>Tests will run in a in-memory implementation of DynamoDB server <a href="https://www.npmjs.com/package/dynalite" target="_blank">dynalite</a>
<div class="code bash">
	npm test
</div>
<br><br>
<p>If you want to test against your own DynamoDB database, add AWS credentials to your environment first
<div class="code bash">
	source test/credentials

	npm test
</div>