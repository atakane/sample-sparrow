const extend				= require('js-base/core/extend');
const PageDesign			= require("../ui/ui_pgShoppingCart");
const Router				= require("sf-core/ui/router");
const PageConstants 		= require('pages/PageConstants');
const Image         		= require('sf-core/ui/image');
const ItemCart				= require("../components/ItemCart");
const ListViewItem  		= require('sf-core/ui/listviewitem');
const ShoppingCart			= require("../objects/ShoppingCart");
const StatusBarStyle        = require('sf-core/ui/statusbarstyle');
const ActionKeyType         = require('sf-core/ui/actionkeytype');
const AlertUtil             = require("sf-extension-utils/alert");
const System                = require("sf-core/device/system");
const AlertView         = require('sf-core/ui/alertview');

const Page_ = extend(PageDesign)(
	// Constructor
	function(_super){
		_super(this);

		this.inputPromoCode.hint = lang["pgShoppingCart.promocode"];
		this.inputPromoCode.actionKeyType = ActionKeyType.SEND;
		this.inputPromoCode.onActionButtonPress = function() {
		    this.inputPromoCode.removeFocus();
		}.bind(this);
		this.inputPromoCode.onEditEnds = function(e1,e2) {
		    this.inputPromoCode.text = this.inputPromoCode.text.toLocaleUpperCase();
        }.bind(this);
		
		this.btnCheckout.button1.onPress = function(){
		    if(ShoppingCart.getTotal() > 0){
		        this.inputPromoCode.removeFocus();
		        Router.go(PageConstants.PAGE_SHIPPING,undefined,true);
		    }
		    else{
		        AlertUtil.showAlert(lang["pgShoppingCart.checkout.error"]);
		    }
        }.bind(this);
        this.customHeaderBar.headerTitle.text = lang["pgShoppingCart.title"]
        this.customHeaderBar.leftImage.image = Image.createFromFile("images://arrow_left.png");
		this.customHeaderBar.leftImage.onTouch = function()
		{
		    this.inputPromoCode.removeFocus();
			Router.goBack();
		}.bind(this);
		
		this.btnCheckout.button1.text = lang["pgShoppingCart.checkout"];
		Router.sliderDrawer.enabled = false;
		
		this.onShow = onShow.bind(this, this.onShow.bind(this));
		this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
		this.refreshList = refreshList.bind(this);
		this.updateFields = updateFields.bind(this);
	
		initListView(this,this.listView);
		this.updateFields();

});

function onLoad(parentOnShow) {
    parentOnShow();
}

function onShow(parentOnLoad) {
    parentOnLoad();
    var page = this;
    changeLookByCartCount(page);
    this.inputPromoCode.removeFocus();
}

function initListView(page,listView) {
    
	listView.rowHeight = 100;
    listView.refreshEnabled = false;
    listView.verticalScrollBarEnabled = false;
    if(ShoppingCart.products.length > 0){
        listView.itemCount = ShoppingCart.products.length;
        
        listView.onRowCreate = function() {
            var myListViewItem = new ListViewItem();
            var item = new ItemCart();
            item.id = 200;
            myListViewItem.item = item;
            myListViewItem.addChild(item);
            return myListViewItem;
        };
        listView.onRowBind = function(listViewItem, index) {
        	listViewItem.item.product = ShoppingCart.products[index];
    
            listViewItem.item.btnPlus.onTouchEnded = function() { // plus
                ShoppingCart.products[index].amount += 1;
                page.refreshList();
            };
            listViewItem.item.btnMinus.onTouch = function() { // minus
                // if (ShoppingCart.products[index].amount > 1) {
                if (ShoppingCart.products[index].amount > 1){
                    ShoppingCart.products[index].amount -= 1;
                    page.refreshList();
                }
                else{
                    var confirmationAlert = new AlertView({
                		title: lang["alertView.confirmation"],
                		message: lang["pgShoppingCart.delete"]
                	});
                	confirmationAlert.addButton({
                		text: lang["delete"],
                		type: AlertView.Android.ButtonType.POSITIVE,
                		onClick: function() {
                    		ShoppingCart.products.splice(index,1);
                    		page.refreshList();
                		}
                	});
                	confirmationAlert.addButton({
                		text: lang["cancel"],
                		type: AlertView.Android.ButtonType.NEGATIVE
                	});
                	confirmationAlert.show();
                }
            };
        };
    }
}

function changeLookByCartCount(page) {
    if(ShoppingCart.products.length > 0){
        hideElement(page.layoutLabel);
        showElement(page.layoutListView);
    }
    else{
        hideElement(page.layoutListView);
        showElement(page.layoutLabel);
        page.labelEmpty.text = "Your Shopping Cart is Empty";
    }
}

function refreshList() {
    var page = this;
	this.listView.itemCount = ShoppingCart.products.length;
    this.listView.refreshData();
    this.updateFields();
    if(ShoppingCart.products.length === 0){
        changeLookByCartCount(page);
    }
};

function updateFields() {
    var totalPrice = 0;
    var totalAmount = 0;

    ShoppingCart.products.forEach(function(product){
        totalPrice  += (product.amount * product.unit_price);
        totalAmount += product.amount;
    });

	this.btnCheckout.enabled = (ShoppingCart.products.length > 0);
    this.totalAmount.text = "$" + ShoppingCart.getTotal().toFixed(2);
};

function showElement(element){
    element.flexGrow = 1;
    element.minHeight = NaN;
    element.minWidth = NaN;
    element.visible = true;
    element.parent.applyLayout();
}

function hideElement(element){
    element.flexGrow = 0;
    element.minHeight = 0;
    // element.height = 0;
    element.minWidth = 0;
    element.visible = false;
    element.parent.applyLayout();
}

module && (module.exports = Page_);