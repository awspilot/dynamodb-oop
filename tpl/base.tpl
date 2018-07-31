<!DOCTYPE html>
<html>
  <head>
	<meta charset='utf-8'>
	<meta http-equiv="X-UA-Compatible" content="chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	<link href='//fonts.googleapis.com/css?family=Raleway:400,100,200,300,500,600' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
	<link rel="stylesheet" type="text/css" href="/dynamodb-oop/stylesheets/stylesheet.css" media="screen">
	<link rel="stylesheet" type="text/css" href="/dynamodb-oop/stylesheets/print.css" media="print">
	<link rel="stylesheet" type="text/css" href="/dynamodb-oop/stylesheets/tree.css">
	<link rel="stylesheet" type="text/css" href="/dynamodb-oop/css/tabs.css">






	<script src="/dynamodb-oop/js/libs/aws-sdk-2.282.1.min.js"></script>
	<script src="/dynamodb-oop/js/libs/dynamodbjs.js"></script>




	<script src="/dynamodb-oop/js/libs/jquery/2.1.3/jquery.min.js"></script>
	<script src="/dynamodb-oop/js/tabs.js"></script>
	<script src="/dynamodb-oop/js/libs/ace/1.2.6/ace.js"></script>
	<script src="/dynamodb-oop/js/libs/ace/1.2.6/mode-javascript.js"></script>
	<script src="/dynamodb-oop/js/libs/ace/1.2.6/mode-sql.js"></script>
	<script src="/dynamodb-oop/js/libs/ace/1.2.6/mode-html.js"></script>
	<script src="/dynamodb-oop/js/libs/ace/1.2.6/theme-twilight.js"></script>
	<script src="/dynamodb-oop/js/libs/ace/1.2.6/theme-monokai.js"></script>
	<script src="/dynamodb-oop/js/libs/ace/1.2.6/theme-textmate.js"></script>
	<script src="/dynamodb-oop/js/libs/ace/1.2.6/theme-iplastic.js"></script>
	<!-- <script src="https://rawgit.com/databank/ui-dynamodb/master/public/js/bundle.js"></script> -->


	<title>Amazon DynamoDB npm module for nodejs - AWSPilot </title>
  </head>

<body>
	<header>

			<h1><b>@AwsPilot</b>'s DynamoDB</h1>

			<!--
				<a href="https://www.npmjs.com/package/@awspilot/dynamodb" class="button"><img src="https://nodei.co/npm/@awspilot/dynamodb.png?downloads=true" alt="npm page"></a>
			-->

	</header>

    <div id="content-wrapper">




        <aside id="sidebar">






<!--
<li>
	<input type="checkbox" id="treeops" />



	<label class="tree_label sub" for="treeops">Operations</label>
	<ul>
		<li><span class="tree_label"><a href="/dynamodb-oop/pages/insert/">Insert</a>
		<li><span class="tree_label"><a href="/dynamodb-oop/pages/update/">Update</a>
		<li><span class="tree_label"><a href="/dynamodb-oop/pages/replace/">Replace</a>
		<li><span class="tree_label"><a href="/dynamodb-oop/pages/delete/">Delete</a>
		<li><span class="tree_label"><a href="/dynamodb-oop/pages/get/">Get</a>
		<li><span class="tree_label"><a href="/dynamodb-oop/pages/query/">Query</a>
		<li><span class="tree_label"><a href="/dynamodb-oop/pages/scan/">Scan</a>
	</ul>
-->




<ul class="tree">
	<li>
		<input type="checkbox" id="awspilot" checked />
		<label class="tree_label sub" for="awspilot"><img src="/dynamodb-oop/images/folder_flat.png"/> @awspilot</label>
		<ul>
			<li>
				<input type="checkbox" id="dynamodb" checked />
				<label class="tree_label sub" for="dynamodb"><img src="/dynamodb-oop/images/folder_flat.png"/> dynamodb</label>
				<ul>
					<li><span class="tree_label"><a href="/dynamodb-oop/"> <img src="/dynamodb-oop/images/text.png"/> README.md</a></span>
					<li><span class="tree_label"><a href="/dynamodb-oop/pages/apidef/"> <img src="/dynamodb-oop/images/text.png"/> APIDEF.md</a></span>
					<li><span class="tree_label"><a href="/dynamodb-oop/pages/sql/"> <img src="/dynamodb-oop/images/text.png"/> SQL.md </a>

					<li><span class="tree_label"><a href="/dynamodb-oop/pages/insert/"> <img src="/dynamodb-oop/images/code.png"/> insert.js</a>
					<li><span class="tree_label"><a href="/dynamodb-oop/pages/insert-or-update/"> <img src="/dynamodb-oop/images/code.png"/> insert_or_update.js</a>
					<li><span class="tree_label"><a href="/dynamodb-oop/pages/insert-or-replace/"> <img src="/dynamodb-oop/images/code.png"/> insert_or_replace.js</a>
					<li><span class="tree_label"><a href="/dynamodb-oop/pages/batch-insert/"> <img src="/dynamodb-oop/images/code.png"/> batch_insert.js</a>
					<li><span class="tree_label"><a href="/dynamodb-oop/pages/update/"> <img src="/dynamodb-oop/images/code.png"/> update.js </a>
					<li><span class="tree_label"><a href="/dynamodb-oop/pages/replace/"> <img src="/dynamodb-oop/images/code.png"/> replace.js</a>
					<li><span class="tree_label"><a href="/dynamodb-oop/pages/delete/"> <img src="/dynamodb-oop/images/code.png"/> delete.js</a>
					<li><span class="tree_label"><a href="/dynamodb-oop/pages/get/"> <img src="/dynamodb-oop/images/code.png"/> get.js</a>
					<li><span class="tree_label"><a href="/dynamodb-oop/pages/query/"> <img src="/dynamodb-oop/images/code.png"/> query.js </a>
					<li><span class="tree_label"><a href="/dynamodb-oop/pages/scan/"> <img src="/dynamodb-oop/images/code.png"/> scan.js </a>




					<li>
						<input type="checkbox" id="misc" checked />
						<label class="tree_label sub" for="misc"><img src="/dynamodb-oop/images/folder_flat.png"/> Misc</label>
						<ul>
							<li><span class="tree_label"><a href="/dynamodb-oop/pages/datatypes/"> <img src="/dynamodb-oop/images/text.png"/> data_types</a>
							<li><span class="tree_label"><a href="/dynamodb-oop/pages/deprecated/"> <img src="/dynamodb-oop/images/text.png"/> deprecated</a>
							<li><span class="tree_label"><a href="/dynamodb-oop/pages/test/"> <img src="/dynamodb-oop/images/text.png"/> test</a><span>
						</ul>
					<li><span class="tree_label"><a href="/dynamodb-oop/pages/disqus/"> <img src="/dynamodb-oop/images/text.png"/> Disqus.md</a></span>
				</ul>

		</ul>
	</li>













</ul>

        </aside>




        <section id="main-content">{{{content}}}</section>
		<!-- sidebar -->


    </div>

<!--
<a href="https://github.com/awspilot/dynamodb-oop"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/652c5b9acfaddf3a9c326fa6bde407b87f7be0f4/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6f72616e67655f6666373630302e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_orange_ff7600.png"></a>
-->

<script>
$(function() {




	$('.code').each(function() {
		var $newid = 'ace-' + Math.random()

		if ($(this).attr('id'))
			$newid = $(this).attr('id')

		$(this).attr('id', $newid)
		if (! $(this).hasClass('wide') )
			$(this).height( $(this).height() + 24 )

		var $e = ace.edit($newid)
		if ($(this).hasClass('bash')) {

		} else if ($(this).hasClass('sql')) {
			$e.getSession().setMode("ace/mode/sql")
		} else if ($(this).hasClass('html')) {
			$e.getSession().setMode("ace/mode/html")
		} else {
			$e.getSession().setMode("ace/mode/javascript")
		}

		if ($(this).hasClass('iplastic'))
			$e.setTheme("ace/theme/iplastic")
		else if ($(this).hasClass('textmate'))
			$e.setTheme("ace/theme/textmate")
		else
			$e.setTheme("ace/theme/monokai")

		if ($(this).hasClass('rw'))
			$e.setReadOnly(false)
		else
			$e.setReadOnly(true)

		$e.setShowPrintMargin(false)
		$e.setOption("highlightActiveLine", false)
		$e.setOption("showInvisibles", false)
		$e.setOption("displayIndentGuides", false)
		$e.getSession().setUseWorker(false)
	})
	$('.btn-describe').on('click', function() {
		if ($(this).hasClass('disabled'))
			return;
		describe_code(ace.edit($('.activeTab').attr('id')).getValue())
	})
});
</script>


<script>


describe_code = function(code) {
	var editor = ace.edit('result-out')
	editor.setValue('')
	setTimeout(function() {

		(function(code) {

			var fakedynamo = {
				config: {dynamoDbCrc32: true,},
				describeTable: function( params ,callback) {
					editor.setValue( editor.getValue() + "\n\tdescribeTable\n" + JSON.stringify(params, null, "\t" ).split("\n").map(function(l) { return "\t"+l}).join("\n"),-1)
					callback(null, {
						Table: {
							KeySchema: [
								{AttributeName: 'partition_key', KeyType: 'HASH' },
								{AttributeName: 'sort_key', KeyType: 'RANGE' }
							]
						}
					})
				},


				putItem: function( params ,callback) {
					editor.setValue(editor.getValue() + "\n\tputItem\n" + JSON.stringify(params, null, "\t" ).split("\n").map(function(l) { return "\t"+l}).join("\n"),-1)
				},
				updateItem: function( params ,callback) {
					editor.setValue(editor.getValue() + "\n\tupdateItem\n" + JSON.stringify(params, null, "\t" ).split("\n").map(function(l) { return "\t"+l}).join("\n"),-1)
				},
				batchWriteItem: function( params ,callback) {
					editor.setValue(editor.getValue() + "\n\tbatchWriteItem\n" + JSON.stringify(params, null, "\t" ).split("\n").map(function(l) { return "\t"+l}).join("\n"),-1)
				},
				deleteItem: function( params ,callback) {
					editor.setValue(editor.getValue() + "\n\tdeleteItem\n" + JSON.stringify(params, null, "\t" ).split("\n").map(function(l) { return "\t"+l}).join("\n"),-1)
				},
				getItem: function( params ,callback) {
					editor.setValue(editor.getValue() + "\n\tgetItem\n" + JSON.stringify(params, null, "\t" ).split("\n").map(function(l) { return "\t"+l}).join("\n"),-1)
				},
				query: function( params ,callback) {
					editor.setValue(editor.getValue() + "\n\tquery\n" + JSON.stringify(params, null, "\t" ).split("\n").map(function(l) { return "\t"+l}).join("\n"),-1)
				},
				scan: function( params ,callback) {
					editor.setValue(editor.getValue() + "\n\tscan\n" + JSON.stringify(params, null, "\t" ).split("\n").map(function(l) { return "\t"+l}).join("\n"),-1)
				},
			}
			DynamoDB = new window['@awspilot/dynamodb'](fakedynamo)
			eval(code)

		})(code)

	}, 500)

}

// describe_code(ace.edit($('.activeTab').attr('id')).getValue())
</script>












<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-119179002-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-119179002-1');
</script>

  </body>
</html>
