<div class="split-code">


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

			<!--
			<div class="chrome-tab chrome-tab-current">
				<div class="chrome-tab-background">
					<svg version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><symbol id="chrome-tab-geometry-left" viewBox="0 0 214 29" ><path d="M14.3 0.1L214 0.1 214 29 0 29C0 29 12.2 2.6 13.2 1.1 14.3-0.4 14.3 0.1 14.3 0.1Z"/></symbol><symbol id="chrome-tab-geometry-right" viewBox="0 0 214 29"><use xlink:href="#chrome-tab-geometry-left"/></symbol><clipPath id="crop"><rect class="mask" width="100%" height="100%" x="0"/></clipPath></defs><svg width="50%" height="100%"><use xlink:href="#chrome-tab-geometry-left" width="214" height="29" class="chrome-tab-background"/><use xlink:href="#chrome-tab-geometry-left" width="214" height="29" class="chrome-tab-shadow"/></svg><g transform="scale(-1, 1)"><svg width="50%" height="100%" x="-100%" y="0"><use xlink:href="#chrome-tab-geometry-right" width="214" height="29" class="chrome-tab-background"/><use xlink:href="#chrome-tab-geometry-right" width="214" height="29" class="chrome-tab-shadow"/></svg></g></svg>
				</div>
				<div class="chrome-tab-favicon"></div>
				<div class="chrome-tab-title">Another tab</div>
				<div class="chrome-tab-close"></div>
			</div>
			-->

		</div>
		<div class="chrome-tabs-bottom-bar"></div>

	</div>



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


<!--
	chromeTabs.addTab({
		title: 'New Tab',
		favicon: 'demo/images/default-favicon.png'
	})
	chromeTabs.removeTab(el.querySelector('.chrome-tab-current'))
-->






<div class="code wide textmate" style="position: absolute;top: 49px;left: 0px;right: 0px;bottom: 0px;">

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
</div>



<div class="split-result">
	<div class="" style="position: absolute;top: 0px;left: 0px;right: 0px;height: 40px;background-color: #f0f0f0;padding: 0px 50px;">
		<a style='display: inline-block;width: 100px;height: 27px;border: 1px solid #dfdfdf;line-height: 27px;margin-top: 5px;margin-right: 10px;color: #ddd;text-shadow: 1px 1px 1px #fff;background-color: #f2f2f2;text-align: center;border-radius: 2px;'> Describe </a>
		<a style='display: inline-block;width: 100px;height: 27px;border: 1px solid #dfdfdf;line-height: 27px;margin-top: 5px;margin-right: 10px;color: #ddd;text-shadow: 1px 1px 1px #fff;background-color: #f2f2f2;text-align: center;border-radius: 2px;'> Execute </a>
	</div>
	<div class="" style="position: absolute;top: 40px;left: 0px;right: 0px;bottom: 0px;border-top: 1px solid #ccc;">
		<div class="code wide textmate" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;"></div>
	</div>
</div>
