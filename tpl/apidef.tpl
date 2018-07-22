<div class="content">

<a name="insert"></a>
<h1>.insert()</h1>
Insert Item ( no update )<br>

Insert is handled as <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html" target="_blank">putItem</a> with an extra condition to make sure item does not already exist.<br>
<br>
Insert does not replace existing items. Use <a href="../insert-or-replace/">.insert_or_replace()</a> or <a href="../insert-or-update/">.insert_or_update()</a> instead.<br>
<br>
WARNING: insert() will do an extra call (describeTable) to get the table schema and prevent item overwrite,<br>
If an item with the same key exists, 'ConditionalCheckFailedException' error is returned<br>


<h1>.insert_or_update()</h1>

Insert on Duplicate Item Update<br>
Handled as <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html" target="_blank">updateItem</a>.<br>


<h1>.insert_or_replace()</h1>
Insert on Duplicate Item Replace<br>
<br>
Handled as <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html" target="_blank">putItem</a>.<br>



<h1>.update()</h1>
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

<h1>.replace()</h1>
Replace Item<br>
<p>
	<b>.replace()</b> does not create the item if item does not exist, use <a href='/pages/insert/'><b>insert_or_replace()</b></a> instead
</p>


<h1>.delete()</h1>
Delete Item<br>
<br>
Delete is handled as <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html" target="_blank">deleteItem</a>.<br>
<br>
Does not fail if the item does not exist.<br>
<br>
Deletes a single item in a table by primary key.<br>

<h1>.get()</h1>
Get Item<br>



<h1>.query()</h1>
The Query operation finds items based on primary key values.<br>


<h1>.scan()</h1>
The Scan operation returns one or more items and item attributes by accessing every item in a table or a secondary index.<br>
</div>