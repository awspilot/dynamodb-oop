
<!--

    <div class="chrome-tabs">
      <div class="chrome-tabs-content">

        <div class="chrome-tab">
          <div class="chrome-tab-background">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><symbol id="chrome-tab-geometry-left" viewBox="0 0 214 29" ><path d="M14.3 0.1L214 0.1 214 29 0 29C0 29 12.2 2.6 13.2 1.1 14.3-0.4 14.3 0.1 14.3 0.1Z"/></symbol><symbol id="chrome-tab-geometry-right" viewBox="0 0 214 29"><use xlink:href="#chrome-tab-geometry-left"/></symbol><clipPath id="crop"><rect class="mask" width="100%" height="100%" x="0"/></clipPath></defs><svg width="50%" height="100%"><use xlink:href="#chrome-tab-geometry-left" width="214" height="29" class="chrome-tab-background"/><use xlink:href="#chrome-tab-geometry-left" width="214" height="29" class="chrome-tab-shadow"/></svg><g transform="scale(-1, 1)"><svg width="50%" height="100%" x="-100%" y="0"><use xlink:href="#chrome-tab-geometry-right" width="214" height="29" class="chrome-tab-background"/><use xlink:href="#chrome-tab-geometry-right" width="214" height="29" class="chrome-tab-shadow"/></svg></g></svg>
          </div>
          <div class="chrome-tab-favicon" style="background-image: url('demo/images/google-favicon.png')"></div>
          <div class="chrome-tab-title">Google</div>
          <div class="chrome-tab-close"></div>
        </div>

        <div class="chrome-tab chrome-tab-current">
          <div class="chrome-tab-background">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><symbol id="chrome-tab-geometry-left" viewBox="0 0 214 29" ><path d="M14.3 0.1L214 0.1 214 29 0 29C0 29 12.2 2.6 13.2 1.1 14.3-0.4 14.3 0.1 14.3 0.1Z"/></symbol><symbol id="chrome-tab-geometry-right" viewBox="0 0 214 29"><use xlink:href="#chrome-tab-geometry-left"/></symbol><clipPath id="crop"><rect class="mask" width="100%" height="100%" x="0"/></clipPath></defs><svg width="50%" height="100%"><use xlink:href="#chrome-tab-geometry-left" width="214" height="29" class="chrome-tab-background"/><use xlink:href="#chrome-tab-geometry-left" width="214" height="29" class="chrome-tab-shadow"/></svg><g transform="scale(-1, 1)"><svg width="50%" height="100%" x="-100%" y="0"><use xlink:href="#chrome-tab-geometry-right" width="214" height="29" class="chrome-tab-background"/><use xlink:href="#chrome-tab-geometry-right" width="214" height="29" class="chrome-tab-shadow"/></svg></g></svg>
          </div>
          <div class="chrome-tab-favicon" style="background-image: url('demo/images/facebook-favicon.ico')"></div>
          <div class="chrome-tab-title">Facebook</div>
          <div class="chrome-tab-close"></div>
        </div>

      </div>
      <div class="chrome-tabs-bottom-bar"></div>


    </div>

    <br>

    <p>
      <button data-add-tab>Add new tab</button> &nbsp;
      <button data-remove-tab>Remove current tab</button>
    </p>


    <script src="https://unpkg.com/draggabilly@2.1.1/dist/draggabilly.pkgd.min.js"></script>
    <script src="js/chrome-tabs.js"></script>
    <script>
      var el = document.querySelector('.chrome-tabs')
      var chromeTabs = new ChromeTabs()

      chromeTabs.init(el, {
        tabOverlapDistance: 14,
        minWidth: 45,
        maxWidth: 243
      })

      el.addEventListener('activeTabChange', ({ detail }) => console.log('Active tab changed', detail.tabEl))
      el.addEventListener('tabAdd', ({ detail }) => console.log('Tab added', detail.tabEl))
      el.addEventListener('tabRemove', ({ detail }) => console.log('Tab removed', detail.tabEl))

      document.querySelector('button[data-add-tab]').addEventListener('click', function(){
        chromeTabs.addTab({
          title: 'New Tab',
          favicon: 'demo/images/default-favicon.png'
        })
      });

      document.querySelector('button[data-remove-tab]').addEventListener('click', function(){
        chromeTabs.removeTab(el.querySelector('.chrome-tab-current'))
      });


    </script>

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

