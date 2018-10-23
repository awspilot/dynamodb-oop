

<div class="content">
	<h1>DynamoDB-UI</h1>

	<span class="octicon octicon-link">
		dynamodb-ui is a web graphical user interface for Amazon DynamoDB<br>
		It's functionality is currently limited to table and index creation and deletion.
	</span>


	<h3>Running with Docker</h3>

	<p>
		The docker version is based on Amazon Linux 2 and includes:
		<li> <a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html" target="_blank">DynamoDB local</a>
		<li> NodeJS and a basic NodeJS http server to serve static files and proxy dynamodb calls
		<li> dynamodb-ui
	</p>

	<div class="code console iplastic">
	docker run -p 8000:8000 -p 8080:80 -d  awspilotcom/dynamodb-ui
	</div>
	<br>
	Dynamodb server will then be available on port 8000 and web ui on http://localhost:8080/<br>
	<br>
	For persistent storage use:<br>
	<div class="code console iplastic">
	docker run -p 8000:8000 -p 80:80 -v storage-volume:/var/dynamo -d  awspilotcom/dynamodb-ui
	</div>
</div>
