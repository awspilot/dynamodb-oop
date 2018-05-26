
<a name="query"></a>
<h1>Query</h1>

<div class="code">
// for hash key comparson operator is always eq()
// for range key you can specify: le() , lt() , ge() , gt() , begins_with() , between(a,b)

// base query, return 10 records with consistent read
DynamoDB
    .table('statistics')
    .where('domain').eq('mydomain.com')
    .limit(10)
    .consistent_read()
    .query(function(err, data ) {
        console.log(err,data)
    })

// only return specified fields, in descending order
DynamoDB
    .table('statistics')
    .select('unique_visitors','unique_pageviews','object.attribute','string_set[0]','array[1]')
    .where('domain').eq('mydomain.com')
    .where('day').ge('2013-11-01')
    .descending()
    .query(function( err, data ) {
        console.log( err, data )
    })
</div>

<a name="queryindex"></a>
<h1>Query an Index with order_by()</h1>
<p></p>
<div class="code">
// suppose you have an index on messages called starredIndex
// and you want to retrieve only the messages that are starred

DynamoDB
    .table('messages')
    .where('to').eq('user1@test.com')
    .order_by('starredIndex')
    .descending()
    .query(function( err, data ) {
        console.log( err, data )
    })

// return all attributes including non-projected ( LSI only )
DynamoDB
    .table('messages')
    .select( DynamoDB.ALL )
    .where('to').eq('user1@test.com')
    .order_by('starredIndex')
    .descending()
    .query(function( err, data ) {
        console.log( err, data )
    })

// NOTE: specifying non-projected fields in select() will:
// * cost you extra reads on a LSI index
// * not be returned on a GSI index
</div>


<a name="queryfilter"></a>
<h1>Query filtering</h1>
<p></p>
<div class="code">
// A filter lets you apply conditions to the data after query
// Only the items that meet your conditions are returned
// All the conditions must evaluate to true ( conditions are ANDed together )
// You can not apply filter on HASH or RANGE key
// Comparison operators:
// The ones supported for RANGE key:
// 			eq(), le() , lt() , ge() , gt() , begins_with() , between(a,b)
// Plus:
//			ne(), defined(), undefined()
// Unsupported yet ( for type SET ):
//			contains(), not_contains(), in()
//
// WARNING: defined() and undefined() are aliases for DynamoDB's NULL and NOT_NULL
// they refer to the presence of an attribute and has nothing to do with it's value
// so   .having('attribute').null() differs from .having('attribute').eq( null )
// also .having('attribute').not_null() differs from .having('attribute').ne( null )

DynamoDB
	.table('messages')
	.where('to').eq('user1@test.com')
	.having('one_attribute').between(100,200)
	.having('object.attribute').eq(true)
	.having('deleted').undefined()      // or .null()
	.having('last_login').defined()     // or .not_null()
	.having('string').begins_with('substring')
	.having('string').contains('substring')
	.having('string_set').contains('one')
	.having('number').between(0,2)
	.having('attribute').in([3,4,'a'])
	.having('fridge.shelf[1].cookies').not_contains('sugar')
	.query(function( err, data ) {
		console.log( err, data )
	})
</div>



<a name="querycontinue"></a>
<h1>Query continue from last item</h1>
<p></p>
<div class="code">
// query a table until the end of results :)
(function recursive_call( $lastKey ) {
    DynamoDB
        .table('messages')
        .where('to').eq('user1@test.com')
        .resume($lastKey)
        .query(function( err, data ) {
            // handle error, process data ...

            if (this.LastEvaluatedKey === null) {
                // reached end, do a callback() maybe
                return
            }

            var $this = this
            setTimeout(function() {
                recursive_call($this.LastEvaluatedKey)
            },1000)

        })
})(null)
</div>