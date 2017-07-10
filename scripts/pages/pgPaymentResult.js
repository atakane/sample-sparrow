const extend = require('js-base/core/extend');
const Page = require('sf-core/ui/page');
const Color = require('sf-core/ui/color');
const PageDesign = require("../ui/ui_pgPaymentResult");
const Router = require("sf-core/ui/router")
const PageConstants = require('pages/PageConstants');
const Image          = require('sf-core/ui/image');
const StatusBarStyle    = require('sf-core/ui/statusbarstyle');

const Page_ = extend(PageDesign)(
	// Constructor
	function(_super){
		_super(this);
		Router.sliderDrawer.enabled = false;
		this.resultText.text = lang["pgPaymentResult.accepted"];
		this.customHeaderBar.headerTitle.text = lang["pgPaymentResult.title"];

		this.btnContinueShopping.button1.text = lang["pgPaymentResult.continue"];

		this.btnContinueShopping.button1.onPress = function(){
		    Router.go(PageConstants.PAGE_CATEGORIES,undefined,true);
        }
        
        this.onShow = onShow.bind(this, this.onShow.bind(this));
		this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
});

function onLoad(parentOnShow) {
    parentOnShow();
}

function onShow(parentOnLoad) {
    parentOnLoad();
    this.statusBar.ios.style = StatusBarStyle.LIGHTCONTENT;
}

module && (module.exports = Page_);