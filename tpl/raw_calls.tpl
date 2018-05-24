<a name="rawcalls"></a>
<h1>Raw Calls to aws sdk</h1>
<div class="code">
DynamoDB.client.listTables(function(err, data) {
    console.log(data.TableNames);
});
console.log( DynamoDB.client )
</div>