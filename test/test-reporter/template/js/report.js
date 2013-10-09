var isExpanded = false;

function expandSpecs(suite) {
	var suiteName = suite.getAttribute('value'),
		specs = document.getElementsByName(suiteName + '.specs'),
		i,
		isExpanded = false,
		clsName;

	if (specs.length > 0) {
		if (suite.innerHTML.indexOf('+') !== -1) {
			isExpanded = false;
		} else {
			isExpanded = true;
		}
		for (i = 0; i < specs.length; ++i) {
			clsName = specs[i].className;
			if (isExpanded) {
				specs[i].className = clsName.replace("specs-show", "specs-hide");
			} else {
				specs[i].className = clsName.replace("specs-hide", "specs-show");
			}
		}
		if (isExpanded) {
			suite.innerHTML = suiteName + " +";
		} else {
			suite.innerHTML = suiteName + " -";
		}
	}
}
