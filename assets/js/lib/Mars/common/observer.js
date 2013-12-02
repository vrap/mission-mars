(function() {
	/* Loading namespaces. */
	var nsCommon = using('mars.common');

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

	nsCommon.Observable.prototype._getUUID = function() {
		return 'xx-x-x-x-xxx'.replace(/[x]/g, function () {
			return Math.floor((1 + Math.random()) * 0x1000).toString(16);
		});
	};

	nsCommon.Observable.prototype.subscribe = function(channel, callback) {
		if (!this.observers.hasOwnProperty(channel)) {
			this.observers[channel] = new Object();
		}

		var uuid = this._getUUID();
		while (uuid) {
			if (!this.observers[channel].hasOwnProperty(uuid)) {
				this.observers[channel][uuid] = callback;

				break;
			}

			uuid = this._getUUID();
		}

		return uuid;
	};

	nsCommon.Observable.prototype.unsubscribe = function(channel, token) {
		if (this.observers.hasOwnProperty(channel) && this.observers[channel].hasOwnProperty(token)) {
			delete this.observers[channel][token];	
		}
	};

	nsCommon.Observable.prototype.publish = function(channel, data) {
		if (this.observers.hasOwnProperty(channel)) {
			for (var token in this.observers[channel]) {
				var subscriber = this.observers[channel][token];

				subscriber.apply(this, data);
			}
		}
	};
})();