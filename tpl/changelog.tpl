<div class="content">

<h1>@1.2.10</h1>
SQL support for CREATE TABLE<br>
pass an Array as parameter to select eg. .select(['attr1','attr2'])<br>

<h1>@1.2.9</h1>
SQL support for DROP TABLE<br>
SQL support for DROP INDEX index_name ON tbl_name<br>
updated SQL parser to support keywords in attribute names, table names and index names (eg: WHERE where = 5)<br>
<h1>@1.2.8</h1>

<h1>@1.2.7</h1>
fixes a HUGE bug where float numbers may lose decimals in OOP .query(), SQL .query() do not have this bug<br>
<h1>@1.2.6</h1>
schema() : new method to supply primary key definitions for tables to avoid unnecesary describeTable calls<br>


<h1>@1.2.5</h1>
basic arithmetic operations can be used instead of String or Number, anywhere in SQL, <br>
new function in SQL: uuid()<br>
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
