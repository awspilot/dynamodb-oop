<div class="content">

	<h1>Handling Empty Strings</h1>
	<br>
		AWS DynamoDB does not currently support empty strings,
		trying to insert / update attributes with empty an string value will fail
		<pre>
			One or more parameter values were invalid: An AttributeValue may not contain an empty string
		</pre>

	<br><br>
		By default ( for compatibility with previous versions reasons ),
		@awspilot/dynamodb will leave empty strings untouched <br>
		( you will need to implement your own logic to replace empty strings ) <br>
		<br>
		As of @1.2.4 you can have empty strings replaced with your custom defined value: <br>

		<br>

		<div class="code">

	const DynamodbFactory = require('@awspilot/dynamodb')
	DynamodbFactory.config( {empty_string_replace_as: YOUR_VALUE } );

	var DynamoDB = new DynamodbFactory(credentials)
		</div>

		<br><br>

		Notes:<br>

		Setting 'empty_string_replace_as' to null will return as null, not empty string<br>
		Eg: { attribute: '' }, converted to { attribute: null }, returned as { attribute: null }<br>

		<br>
		Setting 'empty_string_replace_as' to undefined will loose the attribute<br>
		Eg: { attribute: '' } converted to {}, returned as {} <br>

		<br>
		Setting 'empty_string_replace_as' to 'STRING' will insert/update as 'STRING'
		and convert back to empty string at get/query/scan.<br>
		Eg. { empty_string_replace_as: "\0" }<br>
		{ attribute: '' }, converted to { attribute: "\0" }, returned as { attribute: '' }<br>





</div>
