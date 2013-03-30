var validity = (function(validity) {
	var options = {},
		$ = function(id) {
			return document.getElementById(id);
		},
		enableHostsElm,
		validateHostsElm,
		validateHost;

	function loadOptions() {
		var validateHosts,
			hostOpt,
			validator = $('validator'),
			collapsed = $('collapse');

		//	Load options
		var enableHosts = [],
			validateHosts = [];

		//	TODO: abstract select box population into function
		if (localStorage['enableHosts']) {
			enableHosts = localStorage['enableHosts'].split(' ');
			for (var i = 0; i < enableHosts.length; i++) {
				hostOpt = document.createElement('option');
				hostOpt.textContent = enableHosts[i];
				enableHostsElm.appendChild(hostOpt);
			}
		}

		if (localStorage['validateHosts'] !== undefined) {
			validateHosts = localStorage['validateHosts'].split(' ');
			//	Loop through hosts to populate select box
			for (var j = 0; j < validateHosts.length; j++) {
				hostOpt = document.createElement('option');
				hostOpt.textContent = validateHosts[j];
				validateHostsElm.appendChild(hostOpt);
			}
		}

		if (localStorage['validator'] !== undefined) {
			validator.value = localStorage['validator'];
		}

		if (localStorage['collapseResults'] !== undefined) {
			collapsed.checked = options.toBool(localStorage['collapseResults']);
		}
		else {
			//	Defaults to true
			collapsed.checked = true;
		}
	}

	//	Save options
	function saveOptions() {
		var enableHosts = [],
			validateHosts = [];

		for (var i = 0; i < enableHostsElm.childNodes.length; i++) {
			enableHosts.push(enableHostsElm.childNodes[i].textContent);
		}

		for (var j = 0; j < validateHostsElm.childNodes.length; j++) {
			validateHosts.push(validateHostsElm.childNodes[j].textContent);
		}

		//	Sort hosts alphabetically
		enableHosts.sort();
		validateHosts.sort();

		localStorage['enableHosts'] = enableHosts.join(' ');
		localStorage['validateHosts'] = validateHosts.join(' ');
		localStorage['validator'] = validator.value;
		localStorage['collapseResults'] = collapse.checked.toString();
	}

	//	Edit hosts
	options.addOptionToSelect = function(optionText, select) {
		var option = document.createElement('option');

		option.textContent = optionText;
		select.appendChild(option);

		return option;
	};

	options.removeOptionsFromSelect = function(select) {
		var option;

		for (var i = 0; i < select.childNodes.length; i++) {
			option = select.childNodes[i];
			if (option.selected === true) {
				select.removeChild(option);
			}
		}
	};

	options.toBool = function(input) {
		if (typeof input === 'string') {
			return input.toLowerCase() === 'true';
		}
		return !!input;
	};

	options.init = function() {
		enableHostsElm = $('enableHosts');
		validateHostsElm = $('validateHosts');
		//validateHost = $('validateHost');

		//	Load option values into UI
		loadOptions();

		//	Attach add and remove events for select boxes
		$('enableAdd').addEventListener('click', function() {
			var textArea = $('enableHost');
			if (textArea.value !== '') {
				options.addOptionToSelect(textArea.value, enableHostsElm);
			}
			textArea.value = '';
		});

		$('enableRemove').addEventListener('click', function() {
			options.removeOptionsFromSelect(enableHostsElm);
		});

		//	Add host on enter keypress
		$('enableHost').addEventListener('keypress', function(e) {
			if (e.which === 13) {
				//	Cancel submit
				e.preventDefault();
				$('enableAdd').click();
			}
		});

		$('validateAdd').addEventListener('click', function() {
			var textArea = $('validateHost');
			if (textArea.value !== '') {
				options.addOptionToSelect(textArea.value, validateHostsElm);
			}
			textArea.value = '';
		});

		$('validateRemove').addEventListener('click', function() {
			options.removeOptionsFromSelect(validateHostsElm);
		});

		//	Add host on enter keypress
		$('validateHost').addEventListener('keypress', function(e) {
			if (e.which === 13) {
				//	Cancel submit
				e.preventDefault();
				$('validateAdd').click();
			}
		});

		//	Attach save and apply events
		$('apply').addEventListener('click', function() {
			saveOptions();
		});

		$('optionsForm').addEventListener('submit', function(e) {
			saveOptions();
			window.close();
			return false;
		});
	};

	validity.options = options;
	return validity;
})(validity || {});

window.addEventListener("load", function load(event) {
    validity.options.init();
});
