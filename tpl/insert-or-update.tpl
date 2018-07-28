<div class="split-code">
	<div class="chrome-tabs">
		<div class="chrome-tabs-content">

			<div class="chrome-tab chrome-tab-current">
				<div class="chrome-tab-background">
					<svg version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><symbol id="chrome-tab-geometry-left" viewBox="0 0 214 29" ><path d="M14.3 0.1L214 0.1 214 29 0 29C0 29 12.2 2.6 13.2 1.1 14.3-0.4 14.3 0.1 14.3 0.1Z"/></symbol><symbol id="chrome-tab-geometry-right" viewBox="0 0 214 29"><use xlink:href="#chrome-tab-geometry-left"/></symbol><clipPath id="crop"><rect class="mask" width="100%" height="100%" x="0"/></clipPath></defs><svg width="50%" height="100%"><use xlink:href="#chrome-tab-geometry-left" width="214" height="29" class="chrome-tab-background"/><use xlink:href="#chrome-tab-geometry-left" width="214" height="29" class="chrome-tab-shadow"/></svg><g transform="scale(-1, 1)"><svg width="50%" height="100%" x="-100%" y="0"><use xlink:href="#chrome-tab-geometry-right" width="214" height="29" class="chrome-tab-background"/><use xlink:href="#chrome-tab-geometry-right" width="214" height="29" class="chrome-tab-shadow"/></svg></g></svg>
				</div>
				<div class="chrome-tab-favicon"></div>
				<div class="chrome-tab-title">insert_or_update.js</div>
				<div class="chrome-tab-close"></div>
			</div>
		</div>
		<div class="chrome-tabs-bottom-bar"></div>

	</div>




<div class="code wide textmate" style="position: absolute;top: 49px;left: 0px;right: 0px;bottom: 0px;">

	// Insert on Duplicate Item Update
	DynamoDB
		.table('users')
		.where('email').eq('test@test.com')
		.return(DynamoDB.UPDATED_OLD)
		.insert_or_update({
			password: 'qwert',
			firstname: 'Smith',
			number: 5,

			// increment by 5
			page_views: DynamoDB.add(5),

			// nested attributes
			list: [5,'a', {}, [] ],

			// push these elements at the end of the list (L)
			phones: DynamoDB.add([5,'a']),

			// add to SS,
			string_set: DynamoDB.add(DynamoDB.SS(['ddd','eee'])),

			// add to NS,
			number_set: DynamoDB.add(DynamoDB.NS([444,555])),

			unneeded_attribute: DynamoDB.del(),

			// remove elements from stringSet
			unneeded_ss_items: DynamoDB.del(DynamoDB.SS(['ccc','ddd'])),

			// remove elements from numberSet
			unneeded_ns_items: DynamoDB.del(DynamoDB.NS([111,444])),
		}, function( err, data ) {

		});

</div>
</div>
