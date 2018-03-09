var RestControllerModule = (function () {

    /* PRIVATE */
    
    var DEFAULT_ADDRESS = 'http://localhost:8080'; // XXX
    var server_url = DEFAULT_ADDRESS + '/orders';
    
    var getProductPrices = function () {
	return axios.get(server_url + '/products');
    };

    var getOrdersFromServer = function () {
	return axios.get(server_url);
    };

    /**
     * Construct an order in the javascript format
     */
    var constructOrder = function (order, products) {
	var ord = {order_id:null, table_id:null, products:[]};
	ord.order_id = order.tableNumber;
	ord.table_id = order.tableNumber;

	for(p in order.orderAmountsMap) {
	    var prod = {product: p, quantity: order.orderAmountsMap[p], price:null};
	    prod.price = '$' + products.filter(function (e) {
		return e.name === p;
	    })[0].price;

	    ord.products.push(prod);
	}

	return ord;
    };

    var constructOrders = function (orders, products) {
	var res = [];
	
	for(i in orders) {
	    ord = constructOrder(orders[i], products);
	    res.push(ord);
	}
	
	return res;
    };

    /* PUBLIC */

    /**
     * Gets the data from the server and calls the callback 
     * methods onSuccess and onFailed respectively.
     */
    var getOrders = function (callback) {
	axios.all([getProductPrices(), getOrdersFromServer()])
	    .then(axios.spread( function (prices, orders) {
		// console.log(products);
		// console.log(orders.data);
		products = prices.data;
		var ords = constructOrders(orders.data, products);
		callback.onSuccess(ords);
	    }))
	    .catch(function (error) {
		console.log('ERROR: failed to get server data');
		callback.onFailed(error);
	    });
    };

    var updateOrder = function (order, callback) {
	// todo implement
    };

    var deleteOrder = function (orderId, callback) {
	// todo implement
    };

    var createOrder = function (order, callback) {
	// todo implement
    };

    return {
	getOrders: getOrders,
	updateOrder: updateOrder,
	deleteOrder: deleteOrder,
	createOrder: createOrder
    };

})();
