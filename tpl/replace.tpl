

<!--
	<div class="chrome-tabs">
		<div class="chrome-tabs-content">

			<div class="chrome-tab chrome-tab-current">
				<div class="chrome-tab-background">
					<svg version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><symbol id="chrome-tab-geometry-left" viewBox="0 0 214 29" ><path d="M14.3 0.1L214 0.1 214 29 0 29C0 29 12.2 2.6 13.2 1.1 14.3-0.4 14.3 0.1 14.3 0.1Z"/></symbol><symbol id="chrome-tab-geometry-right" viewBox="0 0 214 29"><use xlink:href="#chrome-tab-geometry-left"/></symbol><clipPath id="crop"><rect class="mask" width="100%" height="100%" x="0"/></clipPath></defs><svg width="50%" height="100%"><use xlink:href="#chrome-tab-geometry-left" width="214" height="29" class="chrome-tab-background"/><use xlink:href="#chrome-tab-geometry-left" width="214" height="29" class="chrome-tab-shadow"/></svg><g transform="scale(-1, 1)"><svg width="50%" height="100%" x="-100%" y="0"><use xlink:href="#chrome-tab-geometry-right" width="214" height="29" class="chrome-tab-background"/><use xlink:href="#chrome-tab-geometry-right" width="214" height="29" class="chrome-tab-shadow"/></svg></g></svg>
				</div>
				<div class="chrome-tab-favicon"></div>
				<div class="chrome-tab-title">replace.js</div>
				<div class="chrome-tab-close"></div>
			</div>

			<!--			<div class="chrome-tab chrome-tab-current">
				<div class="chrome-tab-background">
					<svg version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><symbol id="chrome-tab-geometry-left" viewBox="0 0 214 29" ><path d="M14.3 0.1L214 0.1 214 29 0 29C0 29 12.2 2.6 13.2 1.1 14.3-0.4 14.3 0.1 14.3 0.1Z"/></symbol><symbol id="chrome-tab-geometry-right" viewBox="0 0 214 29"><use xlink:href="#chrome-tab-geometry-left"/></symbol><clipPath id="crop"><rect class="mask" width="100%" height="100%" x="0"/></clipPath></defs><svg width="50%" height="100%"><use xlink:href="#chrome-tab-geometry-left" width="214" height="29" class="chrome-tab-background"/><use xlink:href="#chrome-tab-geometry-left" width="214" height="29" class="chrome-tab-shadow"/></svg><g transform="scale(-1, 1)"><svg width="50%" height="100%" x="-100%" y="0"><use xlink:href="#chrome-tab-geometry-right" width="214" height="29" class="chrome-tab-background"/><use xlink:href="#chrome-tab-geometry-right" width="214" height="29" class="chrome-tab-shadow"/></svg></g></svg>
				</div>
				<div class="chrome-tab-favicon"></div>
				<div class="chrome-tab-title">Another tab</div>
				<div class="chrome-tab-close"></div>
			</div>

		</div>
		<div class="chrome-tabs-bottom-bar"></div>

	</div>

    <br>

	<script>
      var el = document.querySelector('.chrome-tabs')
      var chromeTabs = new ChromeTabs()

      chromeTabs.init(el, {
        tabOverlapDistance: 14,
        minWidth: 45,
        maxWidth: 243
      })

		document.querySelector('.chrome-tabs').addEventListener('activeTabChange', function ( event ) { 
			console.log('Active tab changed', event.detail.tabEl ) 
		} )
      document.querySelector('.chrome-tabs').addEventListener('tabAdd', ({ detail }) => console.log('Tab added', detail.tabEl))
      document.querySelector('.chrome-tabs').addEventListener('tabRemove', ({ detail }) => console.log('Tab removed', detail.tabEl))




	</script>

-->
<!--
	chromeTabs.addTab({
		title: 'New Tab',
		favicon: 'demo/images/default-favicon.png'
	})
	chromeTabs.removeTab(el.querySelector('.chrome-tab-current'))
-->



<div class="content">

<a name="replace"></a>
<h1>Replace Item</h1>
<p>
	<b>.replace()</b> does not create the item if item does not exist, use <a href='/pages/insert/'><b>insert_or_replace()</b></a> instead
</p>
<div class="code">

	// completely replaces the item, new item will only contain specified attributes
	DynamoDB
		.table('users')
		.return(DynamoDB.UPDATED_OLD)
		.replace({
			email: 'test@test.com',
			password: 'qwert',

			// inserted as datatype SS
			string_set1: DynamoDB.SS(['sss','bbb','ccc']), 
			string_set2: new Set(['sss','bbb','ccc']), 

			// inserted as datatype NS
			number_set1: DynamoDB.NS([111,222,333]), 
			number_set2: new Set([[111,222,333]]),

			// inserted as datatype L
			list1: [7,9,15], 
			list2: new Set([]),
			list3: new Set([ 'a', 1 ]),

			created_at: new Date().getTime()
		}, function(err,data) {

		});

</div>
<br><br>
</div>

