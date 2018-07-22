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





</div>