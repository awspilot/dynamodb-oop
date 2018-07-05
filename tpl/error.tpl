<a name="errorfeed"></a>
<h1>Global error feed</h1>
<div class="code">

	// every call to Amazon DynamoDB that fails will
	// call this function before the operation's callback
	DynamoDB.on('error', function( operation, error, payload ) {
	    // you could use this to log fails into LogWatch for
	    // later analysis or SQS queue lazy processing
	})

</div>