(function() {
	/* Loading namespaces. */
	var nsCommon = using('mars.common');

	/**
	 * Observable class that let the program manage internal events.
	 *
	 * @constructor
	 */
	nsCommon.Observable = function() {
		this.observers = new Object();

		/* Singleton. */
		if (arguments.callee.instance) {
			return arguments.callee.instance;
		}
		else {
			arguments.callee.instance = this;
		}
	};

	/**
	 * Generate an uuid (v4).
	 *
	 * @this {Observable}
	 * @return {string}  Generate an uuid.
	 */
	nsCommon.Observable.prototype._getUUID = function() {
		return 'xx-x-x-x-xxx'.replace(/[x]/g, function () {
			return Math.floor((1 + Math.random()) * 0x1000).toString(16);
		});
	};

	/**
	 * Retrieve a channel by his name.
	 *
	 * @this {Observable}
	 * @param  {string} name  Name of the channel to retrieve.
	 * @return {object}       Return an object of subscribers in channel defined by the token as key and callback function as value, children channels are defined by channel name as key and channel object as value.
	 */
	nsCommon.Observable.prototype.getChannel = function(name) {
		var channel = this.observers;
		var channels = name.split('.');

		for (var key in channels) {
			var channelName = channels[key];

			channel = channel[channelName] = channel[channelName] || new Object();
		}

		return channel;
	};

	/**
	 * Retrieve all subscribers of a specified channel.
	 *
	 * @this {Observable}
	 * @param  {string}  channel        A string representing the searched channel.
	 * @param  {boolean} [depth=false]  If we want subscribers of childrens channels.
	 * @return {array}                  An array of callback function.
	 */
	nsCommon.Observable.prototype.getSubscribers = function(channelName, depth) {
		channels = this.getChannel(channelName);
		var subscribers = new Array();

		for (var key in channels) {
			var children = channels[key];

			if (depth == true && typeof children == 'object') {
				subscribers.push(this.getSubscribers(children, true));
			}
			else {
				subscribers.push(children);
			}
		}

		return subscribers;
	};

	/**
	 * Retrieve the subscriber of a specified token in the given channel.
	 *
	 * @this {Observable}
	 * @param  {string} channel  A string representing the searched channel.
	 * @param  {string} token    A string representing the searched token.
	 * @return {Function|null}   Return the callback if exist; otherwise return null.
	 */
	nsCommon.Observable.prototype.getSubscriber = function(channel, token) {
		channel = this.getChannel(channel);

		if (channel.hasOwnProperty(token) && typeof channel[token] == 'function') {
			return channel[token];
		}
			
		return null;
	};

	/**
	 * Subscribe to a channel.
	 *
	 * @this {Observable}
	 * @param  {string}   channel   The channel to subscribe.
	 * @param  {Function} callback  A function that will be called when the event is published.
	 * @return {string}             A token to use when unsubscribe.
	 */
	nsCommon.Observable.prototype.subscribe = function(channel, callback) {
		channel = this.getChannel(channel);

		var uuid = this._getUUID();
		while (uuid) {
			if (!channel.hasOwnProperty(uuid)) {
				channel[uuid] = callback;

				break;
			}

			uuid = this._getUUID();
		}

		return uuid;
	};

	/**
	 * Unsubscribe to a channel and a token.
	 *
	 * @this {Observable}
	 * @param  {string} channel  Channel to unsubscribe.
	 * @param  {string} token    Token to unsubscribe.
	 */
	nsCommon.Observable.prototype.unsubscribe = function(channel, token) {
		if (this.getSubscriber(channel, token)) {
			delete this.getSubscriber(channel, token);
		}
	};

	/**
	 * Execute callback function when an event is published.
	 *
	 * @this {Observable}
	 * @param  {string} channel           Channel to publish the event.
	 * @param  {array} data               Data to pass to the callback function.
	 * @param  {integer} [depthLimit=10]  Depth limit to search for callback broadcaster. The default limit is set to 10.
	 */
	nsCommon.Observable.prototype.publish = function(channel, data, depthLimit) {
		/* Initialize subscribers as an empty array. */
		var subscribers = new Array();

		/* Define the default value of depthLimit if is not correct (not a number or less or equal to 0. */
		depthLimit = (!isNaN(parseInt(depthLimit)) && depthLimit > 0) ? depthLimit : 10;
		var depth = 0;

		/* While a channel existing.*/
		while (channel) {
			/* If this is the first iteration retrieve subscribers of the current channel; otherwise retrieve subscribers of special wildcard event. */
			if (depth == 0) {
				subscribers = this.getSubscribers(channel);
			}
			else {
				subscribers = this.getSubscribers(channel + '.*');
			}

			/* Foreach subscribers found, call the callback with this as context and data as arguments. */
			subscribers.map(function(subscriber) {
				subscriber.apply(this, data);
			}.bind(this));

			/* Search for an upper channel. */
			channel = channel.split('.');
			channel.splice(-1);
			channel = channel.join('.');

			/* If the depth limit has been reached brek the while. */
			if (depth >= depthLimit) {
				break;
			}
			depth++;
		}
	};
})();