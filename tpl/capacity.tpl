<a name="capacity"></a>
<h1>Consumed Capacity</h1>
<p> As of version 0.1.51, aws-dynamodb returns TOTAL consumed capacity by default </p>
<div class="code">

DynamoDB
	.table($tableName)
	.operation(parameters, function callback() {
		console.log(this.ConsumedCapacity)
	})
// you can override it using
DynamoDB
	.table($tableName)
	.return_consumed_capacity('INDEXES') // 'TOTAL' / 'INDEXES' / NONE
	.operation(parameters, function (err,data) {
		console.log(this.ConsumedCapacity)
	})
</div>