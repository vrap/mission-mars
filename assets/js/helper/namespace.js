function using(namespace, objects) {
	var names           = namespace.split('.');
	var namespaceLength = names.length;
	var scope           = window;

	/* For each namespaces provided, add them if does not exist. */
	for (var i = 0; i < namespaceLength; i++) {
		scope = scope[names[i]] = scope[names[i]] || {};
	}

	/* If objects are defined add them to the namespace. */
	if (objects) {
		for (var object in objects) {
			scope[object] = objects[object];
		}
	}

	/* Return the scope. */
	return scope;
};