console.log("scenarioGenerator.js loaded");

function createScenarioObject() {
	//TODO: Take in a bunch of scenario variables as arguments, possibly in enums. Create an object with these values.
}

function createScenarioExtraMonthly(scenario, extraMonthlyAmount) {
	//TODO: create a new scenario by paying an extra monthly amount, say $100 per month. The TOP and end date will need to be adjusted.
}



// --- EVALUATION WEIGHTS ---
// These methods return a weighted score, where 0 is good and 10+ is bad.

function evaluateScenarioTotalOfPayments(scenario) {
	//TODO: return a score based on the total of payments. Perhaps a logarithmic scale, base 7 or something.
}
function evaluateScenarioDateCompleted(scenario) {
	//TODO: return a score based on how long the loan will take to be paid off. 0 years = 0, 10 years = 8, 25 years = 10. Logarithmic.
}
function evaluateScenario(scenario) {
	//TODO: return a score based on how well the borrower will be able to manage if they lose their income.
	//This is a score from the monthly payment amounts multiplied by the score from the amount to be forgiven at the end.
}
function evaluateAll(scenario) {
	//TODO: return a combination of all 3 evaluations above. Either multiply or add them together. 
}

//The 'worst' loan is the one that the user should pay down next
function getWorstLoanIndex(loans, scenario) {
	//console.log("getWorstLoanIndex()");
	var worstLoanIndex = 0;
	
	//avalanche. pay down the largest rate first
	if(scenario.payOffOrder == "avalanche") { 
		var worstLoanRate = 0;
		for(var i=0; i<loans.length; i++) {
			var principleRemaining = loans[i].month[loans[i].month.length-1].beginningPrincipleAmount;
			if( principleRemaining > 0.009) {
				if( loans[i].rate > worstLoanRate ) {
					worstLoanRate = loans[i].rate;
					worstLoanIndex = i;
					//alert("worstLoanIndex is now" + worstLoanIndex);
				}
			}
			//alert("principleRemaining=" + principleRemaining + " worstLoanRate=" + worstLoanRate + " i=" + i + " worstLoanIndex=" + worstLoanIndex);
		}
		console.log("avalanche. worst loan rate is " + worstLoanRate);
	}	
	
	//snowball. pay down the smallest remaining principle first
	else {
		var worstLoanAmount = 999999999;
		for(var i=0; i<loans.length; i++) {
			var principleRemaining = loans[i].month[loans[i].month.length-1].beginningPrincipleAmount;
			if( principleRemaining > 0.009) {
				var currentMonth = loans[i].month[loans[i].month.length-1];
				var currentPrinciple = (currentMonth.monthInterest + currentMonth.monthPrinciple);
				if( (currentPrinciple < worstLoanAmount) && (currentPrinciple > 0)) {
					worstLoanAmount = currentPrinciple;
					worstLoanIndex = i;
					//alert("worstLoanIndex is now" + worstLoanIndex);
				}
			}
			//alert("principleRemaining=" + principleRemaining + " worstLoanAmount=" + worstLoanAmount + " i=" + i + " worstLoanIndex=" + worstLoanIndex);
		}
		console.log("snowball. worst loan amount is " + worstLoanAmount);
	}
	console.log("getWorstLoanIndex() is returning worst loan# " + worstLoanIndex);
	return worstLoanIndex;
}

// Determine the minimum allowed amount under the user's plan
function getExpectedMinimumTotalPayment(plan, paymentsAt10PercentDiscretionaryIncome, paymentsAt15PercentDiscretionaryIncome) {
	
	//SEE THESE WEBSITES FOR INFORMATION ON EACH PLAN: 
	//http://www.finaid.org/loans/repayment.phtml
	//https://studentaid.ed.gov/sa/repay-loans/understand/plans/income-driven#monthly-payments
	
	var standardPayment = 0;
	for(var i; i<future.loans.length; i++) {
		var loan = future.loans[i];
		var ratePerMonthlyPeriod = (future.loans[i].rate / 100) / 12;
		standardPayment +=loanPayment.monthPrinciplePlusInterest = future.loans[i].startingAmount / ((1-(1/Math.pow((1+ratePerMonthlyPeriod), monthsRemaining)))/ratePerMonthlyPeriod);
	}
	standardPayment = Math.max(standardPayment, 50);
	console.log("The standard payment is " + standardPayment);
	
	if(plan === "standard") {
		return standardPayment;
	} else if(plan === "ibr") {
		return Math.min( paymentsAt15PercentDiscretionaryIncome, standardPayment);
	} else if(plan === "icr") {
		var twelveYearStandard = 0;
		for(var i; i<future.loans.length; i++) {
			var ratePerMonthlyPeriod = (future.loans[i].rate / 100) / 12;
			twelveYearStandard += future.loans[i].startingAmount / ((1-(1/Math.pow((1+ratePerMonthlyPeriod), 144)))/ratePerMonthlyPeriod);
		}
		return Math.min( (paymentsAt10PercentDiscretionaryIncome * 2), twelveYearStandard);
	} else if(plan === "paye") {
		return Math.min(paymentsAt10PercentDiscretionaryIncome, standardPayment);
	} else if(plan === "repaye") {
		return paymentsAt10PercentDiscretionaryIncome;
	} else {
		console.log("ERROR: The payment plan was not in the list. string is " + plan);
		return standardPayment;
	}
}

/*//Find the interest and principle payments that are required this month
function getLoanInterestMinimumPayment(currentPrincipleRemaining, monthsRemaining, paymentPlan, interestRate) {
	//TODO: delete the input monthsRemaining. it isn't used.
	console.log("getLoanInterestMinimumPayment() Inputs are: " + currentPrincipleRemaining + "  " + monthsRemaining + "  " + paymentPlan + "  " + interestRate);
	var interestPayment = 0;
	
	//check if this loan is paid off
	if (currentPrincipleRemaining === 0 ) {
		return 0;
	}
	
	//console.log("type of payment plan is " + typeof(paymentPlan) + " payment plan is " + paymentPlan);
	if(paymentPlan === "standard") {
		var rate = interestRate / 100;
		var irf = rate / 365.25; //We are assuming all months are exact same time length. //Reference: http://www.debtfreeadventure.com/how-student-loan-interest-is-calculated-and-why-it-varies-from-month-to-month/
		interestPayment = 30.44 * currentPrincipleRemaining * irf;
	} else if(paymentPlan === "ibr") {
		
	} else if(paymentPlan === "icr") {
		
	} else if(paymentPlan === "paye") {
		
	} else if(paymentPlan === "repaye") {
		
	}
	
	return interestPayment;
}
function getLoanPrincipleMinimumPayment(currentPrincipleRemaining, monthsRemaining, interestRate) {
	//console.log("getLoanPrincipleMinimumPayment()");
	console.log("getLoanPrincipleMinimumPayment() Inputs are: " + currentPrincipleRemaining + "  " + monthsRemaining + "  " + paymentPlan + "  " + interestRate);
	
	//check if this loan is paid off
	if (currentPrincipleRemaining === 0 ) {
		return 0;
	}
	
	var principlePayment = 0;
	var ratePerMonthlyPeriod = (interestRate / 100) / 12;
	//To calculate the current payment, use this formula:  PV  /  [(1- (1 / (1 + i)n )) / i]    //Source: https://answers.yahoo.com/question/index?qid=20080822070859AAY94ZT
	//                                                     ^^^^^^^ THIS IS IMPORTANT ^^^^^^^
	
	if(paymentPlan === "standard") {
		//wrong, but close approximation: //principlePayment = currentPrincipleRemaining / monthsRemaining
		var totalPayment = currentPrincipleRemaining / ((1-(1/Math.pow((1+ratePerMonthlyPeriod), monthsRemaining)))/ratePerMonthlyPeriod);
		principlePayment = totalPayment - getLoanInterestMinimumPayment(currentPrincipleRemaining, monthsRemaining, paymentPlan, interestRate);
		//TODO: major speed problem. We shouldn't have to call getLoanInterestMinimumPayment here. Parent function also calls this.
	} else if(paymentPlan === "ibr") {
		
	} else if(paymentPlan === "icr") {
		
	} else if(paymentPlan === "paye") {
		
	} else if(paymentPlan === "repaye") {
		
	}
	
	return principlePayment;
}*/
function getLoanPaymentInformation(currentPrincipleRemaining, interestRate, monthsRemaining, paymentPlan, defermentMonthsRemainingCountdown) {
	
	var loanPayment = {"beginningPrincipleAmount": currentPrincipleRemaining, "monthPrinciplePlusInterest": 0, "monthPrinciple": 0, "monthInterest": 0, 
			"monthMinimumPayment": 0, "monthExtraPayment": 0};
	
	//check if this loan is paid off
	if (currentPrincipleRemaining < 0.009 ) { //approximate zero for rounding errors
		loanPayment.currentPrincipleRemaining = 0;
		return loanPayment;
	}
	
	//Past expiration date for loan
	if (monthsRemaining <= 0) {
		if(currentPrincipleRemaining > 0) {
			console.log("ERROR?? This loan is past its expiration date, but there is still $" + currentPrincipleRemaining + " left!!");
		}
		console.log("This loan is past its expiration date. It is forgiven.");
		return loanPayment;
	}
	
	//Find total payment
	var ratePerMonthlyPeriod = (interestRate / 100) / 12; //We are assuming all months are exact same time length. //Reference: http://www.debtfreeadventure.com/how-student-loan-interest-is-calculated-and-why-it-varies-from-month-to-month/
	loanPayment.monthPrinciplePlusInterest = currentPrincipleRemaining / ((1-(1/Math.pow((1+ratePerMonthlyPeriod), monthsRemaining)))/ratePerMonthlyPeriod);
	
	//Find the interest this month
	//var irf = ratePerMonthlyPeriod / 365.25;
	loanPayment.monthInterest = currentPrincipleRemaining * ratePerMonthlyPeriod;
	
	/*//There is a $50 minimum payment //SEE THIS WEBSITE FOR MINIMUMS PER PLAN: http://www.finaid.org/loans/repayment.phtml
	if(loanPayment.monthPrinciplePlusInterest < 50) {
		if ( (currentPrincipleRemaining + loanPayment.monthInterest) < 50) { // this is the final payment
			loanPayment.monthPrinciplePlusInterest = currentPrincipleRemaining + loanPayment.monthInterest;
			loanPayment.monthPrinciple = currentPrincipleRemaining;
			console.log("Final payment. principle+interest=" + loanPayment.monthPrinciplePlusInterest + " and principle=" + loanPayment.monthPrinciple);
		} else { //$50 minimum
			loanPayment.monthPrinciplePlusInterest = 50;
			//loanPayment.monthPrinciple = loanPayment.monthPrinciplePlusInterest - loanPayment.monthInterest;
			console.log("Bumping up to $50 minimum payment. principle+interest=" + loanPayment.monthPrinciplePlusInterest);
		}
	}*/
	
	//Find the principle expected payment this month
	loanPayment.monthPrinciple = loanPayment.monthPrinciplePlusInterest - loanPayment.monthInterest;
	console.log("principle=" + loanPayment.monthPrinciple);

	//SEE THESE WEBSITES FOR INFORMATION ON EACH PLAN: 
	//http://www.finaid.org/loans/repayment.phtml
	//https://studentaid.ed.gov/sa/repay-loans/understand/plans/income-driven#monthly-payments
	
	if(defermentMonthsRemainingCountdown > 0) { //Deferment
		loanPayment.monthMinimumPayment = 0;
		//TODO: This assumes a subsidized loan. Not all loans are subsidized.
		loanPayment.monthPrinciple = 0; 
		loanPayment.monthInterest = 0; // <-- TODO: SUBSIDIZED ONLY!!!! Interest should accumulate on an unsubsidized loan
		loanPayment.monthPrinciplePlusInterest = loanPayment.monthInterest;
		console.log("deferred. principle=" + loanPayment.monthPrinciple);
	} else if(paymentPlan === "standard") {
		loanPayment.monthMinimumPayment = loanPayment.monthPrinciplePlusInterest;
		console.log("standard");
	} else if(paymentPlan === "ibr") {
		//TODO: Payment plan
		console.log("TODO");
	} else if(paymentPlan === "icr") {
		//TODO: Payment plan
		console.log("TODO");
	} else if(paymentPlan === "paye") {
		//TODO: Payment plan
		console.log("TODO");
	} else if(paymentPlan === "repaye") {
		//TODO: Payment plan
		console.log("TODO");
	} else {
		console.log("ERROR: The payment plan was not in the list. string is " + paymentPlan);
	}
	
	console.log("getLoanPaymentInformation() Based on the inputs: " + 
			"\ncurrentPrincipleRemaining=" + currentPrincipleRemaining + 
			"\n interestRate=" + interestRate + 
			"\n monthsRemaining=" + monthsRemaining + 
			"\n paymentPlan=" + paymentPlan + 
			"\n defermentMonthsRemainingCountdown=" + defermentMonthsRemainingCountdown + 
			"\n The monthly output is: \n" + JSON.stringify(loanPayment, null, 2));
	return loanPayment;
}