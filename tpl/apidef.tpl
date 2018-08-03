<div class="content">

<h1>.table( tbl_name )</h1>

<div style="margin-left: 100px">
	<h2>.insert()</h2>
	Insert Item ( no update )<br>

	Insert is handled as <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html" target="_blank">putItem</a> with an extra condition to make sure item does not already exist.<br>
	<br>
	Insert does not replace existing items. Use <a href="../insert-or-replace/">.insert_or_replace()</a> or <a href="../insert-or-update/">.insert_or_update()</a> instead.<br>
	<br>
	WARNING: insert() will do an extra call (describeTable) to get the table schema and prevent item overwrite,<br>
	If an item with the same key exists, 'ConditionalCheckFailedException' error is returned<br>


	<h2>.insert_or_update()</h2>

	Insert on Duplicate Item Update<br>
	Handled as <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html" target="_blank">updateItem</a>.<br>


	<h2>.insert_or_replace()</h2>
	Insert on Duplicate Item Replace<br>
	<br>
	Handled as <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html" target="_blank">putItem</a>.<br>


	<h2>.update()</h2>
	Update Existing Item<br>
	<br>
	Update is handled as <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html" target="_blank">updateItem</a> with an extra condition to make sure item exists.<br>
	<br>
	Update does not insert a new item if it does not already exist. Use <a href="../insert-or-update/">.insert_or_update()</a> instead.<br>
	<br>
	Update can only update one item specified in WHERE (AWS DynamoDB limitation).<br>
	<br>
	WARNING: update() will do an extra call (describeTable) to get the table schema and prevent item creation,<br>
	If an item with the same key does not exist, 'ConditionalCheckFailedException' error is returned<br>

	<h2>.replace()</h2>
	Replace Item<br>
	<p>
		<b>.replace()</b> does not create the item if item does not exist, use <a href='/pages/insert/'><b>insert_or_replace()</b></a> instead
	</p>


	<h2>.delete()</h2>
	Delete Item<br>
	<br>
	Delete is handled as <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html" target="_blank">deleteItem</a>.<br>
	<br>
	Does not fail if the item does not exist.<br>
	<br>
	Deletes a single item in a table by primary key.<br>

	<h2>.get()</h2>
	Get Item<br>



	<h2>.query()</h2>
	The Query operation finds items based on primary key values.<br>


	<h2>.scan()</h2>
	The Scan operation returns one or more items and item attributes by accessing every item in a table or a secondary index.<br>
	</div>


<h1>.query( sql_statement )</h1>


</div>






<!--
<h1>Batch Insert</h1>
Insert with multiple items in "VALUES" is handled as <a href='https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html' target='_blank'>batchWriteItem</a>.<br>
-->
