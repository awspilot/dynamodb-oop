<div class="split-code">
	<div class="chrome-tabs">
		<div class="chrome-tabs-content">

			<div class="chrome-tab chrome-tab-current" tabid="tab1">
				<div class="chrome-tab-background">
					<svg version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><symbol id="chrome-tab-geometry-left" viewBox="0 0 214 29" ><path d="M14.3 0.1L214 0.1 214 29 0 29C0 29 12.2 2.6 13.2 1.1 14.3-0.4 14.3 0.1 14.3 0.1Z"/></symbol><symbol id="chrome-tab-geometry-right" viewBox="0 0 214 29"><use xlink:href="#chrome-tab-geometry-left"/></symbol><clipPath id="crop"><rect class="mask" width="100%" height="100%" x="0"/></clipPath></defs><svg width="50%" height="100%"><use xlink:href="#chrome-tab-geometry-left" width="214" height="29" class="chrome-tab-background"/><use xlink:href="#chrome-tab-geometry-left" width="214" height="29" class="chrome-tab-shadow"/></svg><g transform="scale(-1, 1)"><svg width="50%" height="100%" x="-100%" y="0"><use xlink:href="#chrome-tab-geometry-right" width="214" height="29" class="chrome-tab-background"/><use xlink:href="#chrome-tab-geometry-right" width="214" height="29" class="chrome-tab-shadow"/></svg></g></svg>
				</div>
				<div class="chrome-tab-favicon"></div>
				<div class="chrome-tab-title">create_table.js</div>
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
			$('.code').css('z-index', 1).removeClass('activeTab')
			$('#'  +  $( event.detail.tabEl ).attr('tabid') ).css('z-index', 99).addClass('activeTab')
		})


	</script>





<div class="code rw wide textmate activeTab" id="tab1" style="position: absolute;top: 49px;left: 0px;right: 0px;bottom: 0px;z-index: 100;">
	// LSI does not support THROUGHPUT, it uses table's THROUGHPUT
	// for BillingMode you can use either PROVISIONED or PAY_PER_REQUEST
	// THROUGHPUT is optional, defaults to 1 1
	// if PAY_PER_REQUEST is used, THROUGHPUT is ignored by AWS
	DynamoDB.query(`
		CREATE PROVISIONED TABLE tbl_name (
			pKey STRING,
			altKey STRING,
			sKey NUMBER,
			sBin BINARY,
			PRIMARY KEY ( pKey, sKey ) THROUGHPUT 999 99 ,
			INDEX table      GSI ( altKey ) PROJECTION ALL THROUGHPUT 1 1 ,
			INDEX mykeys     GSI ( altKey, sKey ) PROJECTION KEYS_ONLY THROUGHPUT 2 2,
			INDEX myinclude  GSI ( altKey, sBin ) PROJECTION INCLUDE ( hash, range ) THROUGHPUT 3 3,
			INDEX lsiall     LSI ( pKey, sKey ) PROJECTION ALL,
			INDEX lsikeys    LSI ( pKey, sKey ) PROJECTION KEYS_ONLY,
			INDEX lsiinclude LSI ( pKey, sBin ) PROJECTION INCLUDE ( attr1, attr2 )
		)
	`, function(err,data) {

	});
</div>



</div> <!-- split code -->

<div class="split-result">
	<div class="" style="position: absolute;top: 0px;left: 0px;right: 0px;height: 40px;background-color: #f0f0f0;padding: 0px 50px;">
		<a class='btn btn-describe'> Describe </a>
		<a class='btn disabled'> Execute </a>
	</div>
	<div class="" style="position: absolute;top: 40px;left: 0px;right: 0px;bottom: 0px;border-top: 1px solid #ccc;">
		<div id="result-out" class="code wide textmate" style="position: absolute;top: 0px;left: 0px;right: 0px;bottom: 0px;"></div>
	</div>
</div>
