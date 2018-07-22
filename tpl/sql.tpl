<h1>SQL</h1>

Notes:<br>
<br>
SQL keywords must be enclosed ex. SET `set` = true <br>
<br>
Keys in json that are keywords must be enclosed too:<br>
<pre>
	SET myobject = { 
			'number'  : 1,
			"keyword2": "value",
			'keyword3': 'value',
		}
</pre><br>
<br>
Keys in json must be enclosed in the same way as in JavaScript<br>
<pre>
	SET `object` = {
			splitme   : 'value',
			"split-me": 'value',
		} 
</pre><br>
<br>
Values for partition_key and sort_key can be of type String  or Number<br>
<br>


<div class="code html iplastic">

	INSERT INTO
		tbl_name
	SET
		partition_key = &lt;VALUE&gt;,
		sort_key =&lt;VALUE&gt;
		[, other_key = &lt;VALUE&gt;, ... ]

	/*
		NOTES:
		 - values for non key attributes can be:
				string: "foo", 'bar'
				number: 3.14, -1
				boolean: true or false
				null	
				list: ["string", 1, true, null, [ 1,2,3], {} ]
				map: { 'number': 1, "string": "text", 'bool': true, arr: [] }
				stringset: new Set(['a','b','c'])
				numberset: new Set([ 1 , 2 , 3 ])
				expression (currently only JavaScript Date supported): 
					new Date( string_or_number_parameter ).getTime()
	*/

</div>


<br><br>

<div class="code html iplastic">

	INSERT INTO 
		tbl_name 
	VALUES
			( &lt;JSON&gt; )
			[ , ( &lt;JSON&gt; ) ]

</div>

<br><br>

<div class="code html iplastic">

	UPDATE
		tbl_name
	SET
		key1 OP &lt;VALUE&gt; [, key2 OP &lt;VALUE&gt;, ... ]
	WHERE
		partition_key = &lt;VALUE&gt; AND sort_key = &lt;VALUE&gt;


	/*
	NOTES:
	- UPDATE statement will update exacly one Item indicated by WHERE

	- VALUE for partition_key and sort_key can be string or number

	- Delete an item attribute by setting its value to undefined ( not "undefined" )

	- OP can be "=" or "+="

	- Increment an item's value by using attribute += value, 
	  attribute = attribute + value is not supported yet

	*/
</div>

<br><br>

<div class="code html iplastic">

	REPLACE INTO
		tbl_name
	SET
		partition_key = <VALUE>, sort_key = <VALUE> [, other_key = <VALUE>, ... ]

</div>