const ShoppingCart = {};
ShoppingCart.products = [];

ShoppingCart.addProduct = function(product) {
    var storedProduct = ShoppingCart.products.reduce(
        function(acc, element, index, array) {
            return (element.id === product.id)? element : acc;
        }, null);
    
    if (storedProduct) {
        storedProduct.amount += 1;
    } else {
        ShoppingCart.products.push({
            id: product.id,
            title: product.title,
            unit_price: product.variants[0].price,
            amount: 1,
            image: product.image.src
        });
    }
};

ShoppingCart.getTotal = function() {
    var total = 0;
    ShoppingCart.products.forEach(function(product){
        total += (product.unit_price * product.amount);
    });
    return total;
}

ShoppingCart.clearProducts = function() {
    ShoppingCart.products = [];
};

ShoppingCart.updateBasket = function(headerBar)
{
    if (ShoppingCart.products.length > 0) 
    {
        var count = 0;
        ShoppingCart.products.forEach(function(product) {
           count += product.amount; 
        });
        
        if(count > 10)
        {
            headerBar.count.text = "9+";
        }else
        {
            headerBar.count.text = count;
        }
    }else
    {
        headerBar.count.text = ""
    }
}

module.exports = ShoppingCart;