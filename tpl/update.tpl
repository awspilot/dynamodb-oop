<div class="split-code">
	<div class="chrome-tabs">
		<div class="chrome-tabs-content">

			<div class="chrome-tab chrome-tab-current" tabid="tab1">
				<div class="chrome-tab-background">
					<svg version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><symbol id="chrome-tab-geometry-left" viewBox="0 0 214 29" ><path d="M14.3 0.1L214 0.1 214 29 0 29C0 29 12.2 2.6 13.2 1.1 14.3-0.4 14.3 0.1 14.3 0.1Z"/></symbol><symbol id="chrome-tab-geometry-right" viewBox="0 0 214 29"><use xlink:href="#chrome-tab-geometry-left"/></symbol><clipPath id="crop"><rect class="mask" width="100%" height="100%" x="0"/></clipPath></defs><svg width="50%" height="100%"><use xlink:href="#chrome-tab-geometry-left" width="214" height="29" class="chrome-tab-background"/><use xlink:href="#chrome-tab-geometry-left" width="214" height="29" class="chrome-tab-shadow"/></svg><g transform="scale(-1, 1)"><svg width="50%" height="100%" x="-100%" y="0"><use xlink:href="#chrome-tab-geometry-right" width="214" height="29" class="chrome-tab-background"/><use xlink:href="#chrome-tab-geometry-right" width="214" height="29" class="chrome-tab-shadow"/></svg></g></svg>
				</div>
				<div class="chrome-tab-favicon"></div>
				<div class="chrome-tab-title">update.js</div>
				<div class="chrome-tab-close"></div>
			</div>

			<div class="chrome-tab" tabid="tab2">
				<div class="chrome-tab-background" >
					<svg version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><symbol id="chrome-tab-geometry-left" viewBox="0 0 214 29" ><path d="M14.3 0.1L214 0.1 214 29 0 29C0 29 12.2 2.6 13.2 1.1 14.3-0.4 14.3 0.1 14.3 0.1Z"/></symbol><symbol id="chrome-tab-geometry-right" viewBox="0 0 214 29"><use xlink:href="#chrome-tab-geometry-left"/></symbol><clipPath id="crop"><rect class="mask" width="100%" height="100%" x="0"/></clipPath></defs><svg width="50%" height="100%"><use xlink:href="#chrome-tab-geometry-left" width="214" height="29" class="chrome-tab-background"/><use xlink:href="#chrome-tab-geometry-left" width="214" height="29" class="chrome-tab-shadow"/></svg><g transform="scale(-1, 1)"><svg width="50%" height="100%" x="-100%" y="0"><use xlink:href="#chrome-tab-geometry-right" width="214" height="29" class="chrome-tab-background"/><use xlink:href="#chrome-tab-geometry-right" width="214" height="29" class="chrome-tab-shadow"/></svg></g></svg>
				</div>
				<div class="chrome-tab-favicon"></div>
				<div class="chrome-tab-title">update_sql.js</div>
				<div class="chrome-tab-close"></div>
			</div>

		</div>
		<div class="chrome-tabs-bottom-bar"></div>

	</div>

	<script>
		var el = document.querySelector('.chrome-tabs')
		var chromeTabs = new ChromeTabs()

		chromeTabs.init(el, { tabOverlapDistance: 14, minWidth: 45, maxWidth: 243 })

		document.querySelector('.chrome-tabs').addEventListener('activeTabChange', function ( event ) {
			$('.code').css('z-index', 1)
			$('#'  +  $( event.detail.tabEl ).attr('tabid') ).css('z-index', 99)
		})

		//document.querySelector('.chrome-tabs').addEventListener('tabAdd', ({ detail }) => console.log('Tab added', detail.tabEl))
		//document.querySelector('.chrome-tabs').addEventListener('tabRemove', ({ detail }) => console.log('Tab removed', detail.tabEl))




	</script>

<div class="code wide textmate" id="tab1" style="position: absolute;top: 49px;left: 0px;right: 0px;bottom: 0px;z-index: 100;">
	// Update Existing Item
	// update multiple attributes in a HASH table
	DynamoDB
		.table('users')
		.where('email').eq('test@test.com')
		.return(DynamoDB.ALL_OLD)
		.update({
			password: 'qwert',
			name: 'Smith',
			active: true,
			subscription: null,

			// increment
			page_views: DynamoDB.add(5),

			list: [5,'a', {}, [] ],

			// ADD to array (L) - not documented by AWS
			arr:  DynamoDB.add( ['x','y', false, null, {}] ),

			// updated as datatype SS
			string_set1: DynamoDB.SS(['sss','bbb','ccc']),
			string_set2: new Set(['sss','bbb','ccc']),

			// updated as datatype NS
			number_set1: DynamoDB.NS([111,222,333]),
			number_set2: new Set([[111,222,333]]),

			// updated as datatype L
			list1: [7,9,15],
			list2: new Set([]),
			list3: new Set([ 'a', 1 ]),


			// ADD to StringSet and NumberSet, will only keep unique values
			ss1:  DynamoDB.add( DynamoDB.SS(['aaa','ddd']) ),
			ns1:  DynamoDB.add( DynamoDB.NS([11,44]) ),

			// delete from StringSet and NumberSet
			ss2:  DynamoDB.del( DynamoDB.SS(['bbb']) ),
			ns2:  DynamoDB.del( DynamoDB.NS([22]) ),

			// delete from Array (L) not supported by Amazon

			// delete attribute
			unneeded_attribute: DynamoDB.del(),

		}, function( err, data ) {

		});

</div>


<div class="code wide textmate" id="tab2" style="position: absolute;top: 49px;left: 0px;right: 0px;bottom: 0px;z-index: 1;">

	// Update Existing Item
	// SQL version does not currently support adding / removing from StringSet or NumberSet. (Awspilot limitation).
	DynamoDB.query(`

		UPDATE
			users
		SET
			active          = true,
			nulled          = null,
			updated_at      = 1468137844,

			/* delete attribute */
			activation_code = undefined,

			/* increment attribute */
			login_count    += 1,

			/* decrement attribute */
			days_left    += -1,

			list            = ['a',1,true, null, {}, [] ],
			map             = {
				nonkeyword = 'value1',
				"sqlkeyword1" = 'value2',
				'sqlkeyword2' = 'value3'
			},
			tags            = new StringSet(['dev','nodejs']),
			lucky_numbers   = new NumberSet([ 12, 23 ]),

			/* evaluated to String or Number when parsed  */
			expire_at       =  new Date( 1530723266352 ).getTime()

		WHERE
			domain = 'test.com' AND user = 'testuser'

	`, function(err) {

	});

</div>
</div>
