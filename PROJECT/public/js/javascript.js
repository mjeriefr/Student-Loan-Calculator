console.log("javascript.js loaded");

/* --- MANIPULATING HTML ELEMENTS ON THE PAGE. hide things, show data, etc --- */
document.getElementById("refinanceCheckbox").addEventListener("click", function(){
	if(document.getElementById("refinanceCheckbox").checked) {
		document.getElementById("refinanceOptionDiv").hidden = false;
	} else {
		document.getElementById("refinanceOptionDiv").hidden = true;
	}
}, false);
document.getElementById("forgivenessCheckbox").addEventListener("click", function(){
	if(document.getElementById("forgivenessCheckbox").checked) {
		document.getElementById("loanForgivenessHiddenInput").hidden = false;
		document.getElementById("loanForgivenessHiddenInputInverse").hidden = true;
	} else {
		document.getElementById("loanForgivenessHiddenInput").hidden = true;
		document.getElementById("loanForgivenessHiddenInputInverse").hidden = false;
	}
}, false);


/* --- LOAN INPUT --- */
document.getElementById("submitLoanButton").addEventListener("click", function(){
	//alert("submitLoanButton event");
	// Create loan object and add it to the data structure list of loans
	var newLoanAmount = document.getElementById("loanAmountInput").value;
	var newLoanRate = document.getElementById("interestRateInput").value;
	
	//TODO: sanitize inputs. not blank, no spaces, negative, rate is within normal bounds
	
	addLoan(newLoanAmount, newLoanRate); 
}, false);


/* --- UPDATING AND SUBMITTING INPUTS --- */
// submitButton sends all inputs to the dataHandler 
document.getElementById("submitButton").addEventListener("click", function() {
	//Pull input values from the html document 
	var plan = document.getElementById("planType").value;
	var completedMonth = document.getElementById("completedMonth").value;
	var completedYear = document.getElementById("completedYear").value;
	var defermentBool = document.getElementById("defermentCheck").checked;
	var defermentMonth = document.getElementById("defermentMonth").value;
	var defermentYear = document.getElementById("defermentYear").value;
	var income = document.getElementById("income").value;
	var stateResidency = document.getElementById("stateResidency").value;
	var forgivenessCheckbox = document.getElementById("forgivenessCheckbox").checked;
	var forgivenessYears = document.getElementById("forgivenessYears").value;
	var extraPaymentOption = document.querySelector('input[name="extraPaymentGroup"]:checked').value; //See http://stackoverflow.com/a/15839451/2312949
	var extraMonthlyPaymentAmount = document.getElementById("extraMonthlyPaymentAmount").value;
	var refinanceCheckbox = document.getElementById("refinanceCheckbox").checked;
	var refinanceAmount = document.getElementById("refinanceAmount").value;
	var nYearsRefinance = document.getElementById("nYearsRefinance").value;
	var refinanceInterestRate = document.getElementById("refinanceInterestRate").value;
	var usingAutopay = document.getElementById("usingAutopay").checked;
	var payOffOrder = document.getElementById("payOffOrder").value;
	var newRepaymentPlan = document.getElementById("newRepaymentPlan").value;

	//TODO: Check these inputs. no negative numbers, text in numbers, blank, etc.
	if (income == "" || typeof(Number(income)) !== "number" || income < 0 ) {
		//Non-essential input, don't require it. Set to maximum instead.
		income = 100000;
	}
	income = Number(income);
	
	//TODO: This is incorrect - http://clubmate.fi/javascript-adding-and-removing-class-names-from-elements/
//	if( document.getElementById("forgivenessYears").hasClass(" missing-required-input ") ) { 
//		//document.getElementById("forgivenessYears").removeClass(" missing-required-input "); 
//	}
//	if ( forgivenessCheckbox === true && (forgivenessYears == "" || typeof(Number(forgivenessYears)) !== "number" || forgivenessYears < 0)) {
//		alert("if");
//		document.getElementById("forgivenessYears").classList.add(" missing-required-input ");
//		alert("added");
//	}
	
	//Find the total number of months remaining on the plan
	var differenceMonths = completedMonth - todaysMonth;
	var differenceYears = completedYear - todaysYear;
	var totalMonthsRemaining = (differenceYears * 12) + differenceMonths;
	console.log("The number of months remaining until payoff is " + totalMonthsRemaining);
	
	//Put these values into a scenario object json
	//BUG: We don't need 'scenario' at the beginning. It must also be taken out in addScenario() method. This also doesn't need to be a string json, just a json object
	var inputScenario = '{"scenario": { \
		"plan": "' + plan + '", \
		"completedMonth": "' + completedMonth + '", \
		"completedYear": "' + completedYear + '", \
		"totalMonthsRemaining": "' + totalMonthsRemaining + '", \
		"defermentBool": "' + defermentBool + '", \
		"defermentMonth": "' + defermentMonth +'", \
		"defermentYear": "' + defermentYear + '", \
		"income": "' + income + '", \
		"stateResidency": "' + stateResidency + '", \
		"forgivenessCheckbox": "' + forgivenessCheckbox + '", \
		"forgivenessYears": "' + forgivenessYears + '", \
		"extraPaymentOption": "' + extraPaymentOption + '", \
		"extraMonthlyPaymentAmount": "' + extraMonthlyPaymentAmount + '", \
		"refinanceCheckbox": "' + refinanceCheckbox + '", \
		"refinanceAmount": "' + refinanceAmount + '", \
		"nYearsRefinance": "' + nYearsRefinance + '", \
		"refinanceInterestRate": "' + refinanceInterestRate + '", \
		"usingAutopay": "' + usingAutopay + '", \
		"payOffOrder": "' + payOffOrder + '", \
		"newRepaymentPlan": "' + newRepaymentPlan + '" }}';
	console.log("Input scenario JSON is: " + inputScenario);
	var jsonInputScenario = JSON.parse(JSON.stringify(inputScenario));
	
	//pass the json object into the data handler
	addScenario(jsonInputScenario);
}, false);