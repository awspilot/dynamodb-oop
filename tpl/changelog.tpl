<div class="content">

<h1>@1.2.5</h1>
basic arithmetic operations supported anywhere in SQL, instead of Number or String<br>
uuid() function in SQL<br>
Eg.:<br>
  UPDATE tbl SET width = 100 + 20 WHERE `hash` = 'foo' + 'bar' AND `range` = ... ;<br>
  INSERT INTO tbl SET accountId = uuid('acct-############'), created_at = new Date().getTime()<br>

<h1>@1.2.4</h1>
@awspilot/dynamodb can now replace empty strings with custom values and convert back to empty strings when fetching data.

<h1>@1.2.3</h1>
You can now use Javascript Math object in SQL queries as well as basic arithmetic operations as parameters for Date and Math Object<br>
 Eg.:<br>
  UPDATE tbl SET x = Math.round( Math.random() * 1000  ) WHERE ... ;<br>
  UPDATE tbl SET x = Math.round( new Date().getTime() / 1000 )   WHERE ... ;<br>
  UPDATE tbl SET x = new Date( new Date().getTime() - 1000*60*60*24 ).toISOString()   WHERE ... ;<br>

<h1>@1.2.2</h1>
Support for SELECT without HAVING ( FilterExpression )<br>
Eg.:<br>
  SELECT attr1, attr2 FROM tbl WHERE partition_key = 'value';<br>
  SELECT * FROM tbl WHERE partition_key = 'value' AND sort_key LIKE 'word%'; <br>
  SELECT * FROM tbl WHERE partition_key = 'value' AND sort_key >= 5; <br>
  SELECT * FROM tbl WHERE partition_key = 'value' AND sort_key BETWEEN 'aaa' AND 'zzz'; <br>

<h1>@1.2.1</h1>
Basic support for SCAN sql statement<br>
Eg.:<br>
  SCAN attr1,attr2 FROM tbl


<h1>@1.1.7</h1>
Support for javascript Date object in SQL queries<br>
Eg.:<br>
  UPDATE tbl SET updated_at = new Date().getTime() WHERE ... ;<br>


</div>
