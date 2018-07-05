
<a name="scan"></a>
<h1>Full table scan</h1>
<p> </p>
<div class="code">
// optionally you can limit the returned attributes with .select()
// and the number of results with .limit()

DynamoDB
    .table('messages')
    .select('from','subject','object.attribute','string_set[0]','array[1]')
    .having('somkey').eq('somevalue')
    .limit(10)
    .scan(function( err, data ) {

    });

// continous scan until end of table
(function recursive_call( $lastKey ) {
    DynamoDB
        .table('messages')
        .resume($lastKey)
        .scan(function( err, data ) {
            // handle error, process data ...

            if (this.LastEvaluatedKey === null) {
                // reached end, do a callback() maybe
                return;
            }

            var $this = this
            setTimeout(function() {
                recursive_call($this.LastEvaluatedKey);
            },1000);

        })
})(null)
</div>





<a name="scanindex"></a>
<h1>GSI scan</h1>
<p> </p>
<div class="code">
	DynamoDB
		.table('messages')
		.index('GSI_Index_Name')
		.scan(function( err, data ) {

		});
</div>

