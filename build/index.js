var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/*

remaining = initial * (1 + rate)^duration - payment * duration * (1 + rate)^(duration - 1)
int = 1 + rate
remaining = initial * int^duration - duration * int^duration
ln(remaining) = duration * ln(initial * int) - duration * ln(duration * int)
ln(remaining) = duration ( ln(initial * int) - ln(duration * int) )
ln(remaining) = duration ( ln(initial) - ln(duration) )
0 = duration * ln(initial) - duration * ln(duration) - ln(remaining)

*/

// console.log(['houseValue', 'down', 'mortgageValue', 'rental', 'interest', 'payments', 'viableMortgageValue', 'timeTillViable'].join(','));

// const down = 100000
// const payments = 1000

// for (let interest = 0.045; interest <= 0.06; interest = interest + 0.015) {
//   for (let houseValue = 400000; houseValue <= 1000000; houseValue = houseValue + 50000) {
//     for (let rental = 400; rental <= 700; rental = rental + 25) {
//       // console.log('Trying', down, payments, interest, houseValue, rental)
//       const { mortgageValue, viableMortgageValue, timeTillViable } = calculateScenario(down, payments, interest, houseValue, rental)
//       console.log([houseValue, down, mortgageValue, rental, interest, payments, viableMortgageValue, timeTillViable].join(','));
//     }
//   }
// }

// return

function calculateScenario(down, payments, interest, value, rental) {
  // Find how big the initial mortgage is
  var mortgageValue = value - down;

  // See how big a mortgage can be paid with just the rent at the given interest rate (viable mortgage)
  var viableDuration = 30 * 52 + 1;
  var viableMortgageValue = mortgageValue;
  while (true) {
    viableDuration = calcDuration(viableMortgageValue, interest / 52, 0, rental);
    if (viableDuration <= 30 * 52) break;
    viableMortgageValue = viableMortgageValue - 1000;
  }

  // Find how long to get from the initial mortgage to the viable mortgage while paying the payments amount
  var timeTillViable = viableMortgageValue === mortgageValue ? 0 : calcDuration(mortgageValue, interest / 52, viableMortgageValue, payments);

  return {
    mortgageValue: mortgageValue,
    viableMortgageValue: viableMortgageValue,
    timeTillViable: timeTillViable
  };
}

// const payment = 1000
// const duration = calcDuration(500000, 0.06 / 52, 425000, payment)
// console.log('Payment: $%d.00, Duration: %d years', payment, (duration / 52).toFixed(2))
// return

// for (let payment = 1000; payment < 3000; payment = payment + 10) {
//   const duration = calcDuration(500000, 0.0444 / 52, 425000, payment)
//   if (duration < (52 * 3)) {
//     console.log('Payment: $%d.00, Duration: %d years, %d weeks', payment, Math.floor(duration / 52), Math.round(duration % 52))
//     break
//   }
// }

function calcDuration(initial, rate, target, payment) {
  // console.log('calcDuration start', initial, rate, target, payment)
  var remaining = initial;
  var duration = 0;
  while (remaining > target) {
    // console.log(remaining, remaining * (1 + rate) - remaining)
    remaining = remaining * (1 + rate) - payment;
    duration++;

    if (remaining > initial) return Infinity;
  }
  // console.log('calcDuration end')

  return duration;

  // console.log('Duration: %d years, %d weeks', Math.floor(duration / 12), Math.round(duration % 12))
}

var defaults = {
  downPayment: 150000,
  repayments: 1200,
  interest: 0.045,
  propertyValue: 690000,
  rental: 750,
  fixedOutgoings: 5000
};

var App = function App() {
  var _React$useState = React.useState(defaults.downPayment),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      downPayment = _React$useState2[0],
      setDownPayment = _React$useState2[1];

  var _React$useState3 = React.useState(defaults.repayments),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      repayments = _React$useState4[0],
      setRepayments = _React$useState4[1];

  var _React$useState5 = React.useState(defaults.interest),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      interest = _React$useState6[0],
      setInterest = _React$useState6[1];

  var _React$useState7 = React.useState(defaults.propertyValue),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      propertyValue = _React$useState8[0],
      setPropertyValue = _React$useState8[1];

  var _React$useState9 = React.useState(defaults.rental),
      _React$useState10 = _slicedToArray(_React$useState9, 2),
      rental = _React$useState10[0],
      setRental = _React$useState10[1];

  var _React$useState11 = React.useState(defaults.fixedOutgoings),
      _React$useState12 = _slicedToArray(_React$useState11, 2),
      fixedOutgoings = _React$useState12[0],
      setFixedOutgoings = _React$useState12[1];

  var depositPercentage = downPayment / propertyValue * 100;

  var actualRepayments = repayments - fixedOutgoings / 52;
  var effectiveRent = rental - fixedOutgoings / 52;

  var _calculateScenario = calculateScenario(downPayment, actualRepayments, interest, propertyValue, effectiveRent),
      mortgageValue = _calculateScenario.mortgageValue,
      viableMortgageValue = _calculateScenario.viableMortgageValue,
      timeTillViable = _calculateScenario.timeTillViable;

  return React.createElement(
    "div",
    null,
    React.createElement(
      "table",
      null,
      React.createElement(
        "tbody",
        null,
        React.createElement(
          "tr",
          null,
          React.createElement(
            "th",
            { colSpan: "3" },
            "Inputs"
          )
        ),
        React.createElement(
          "tr",
          null,
          React.createElement("th", { colSpan: "2" })
        ),
        React.createElement(
          "tr",
          null,
          React.createElement(
            "td",
            null,
            React.createElement(
              "label",
              { htmlFor: "down" },
              "Down Payment"
            )
          ),
          React.createElement(
            "td",
            null,
            React.createElement("input", { type: "number", step: "1000", id: "down", name: "down", value: downPayment, onChange: function onChange(e) {
                return setDownPayment(e.target.value);
              } })
          )
        ),
        React.createElement(
          "tr",
          null,
          React.createElement(
            "td",
            null,
            React.createElement(
              "label",
              { htmlFor: "repayments" },
              "Weekly Repayments"
            )
          ),
          React.createElement(
            "td",
            null,
            React.createElement("input", { type: "number", step: "10", id: "repayments", name: "repayments", value: repayments, onChange: function onChange(e) {
                return setRepayments(e.target.value);
              } })
          ),
          React.createElement(
            "td",
            null,
            React.createElement(
              "span",
              null,
              "Income that can be put towards the property on an ongoing basis. Could be thought of as the approx amount that currently goes to rent and most that goes to savings. Would likely still make minimum kiwisaver contributions and keep a splash fund aside."
            )
          )
        ),
        React.createElement(
          "tr",
          null,
          React.createElement(
            "td",
            null,
            React.createElement(
              "label",
              { htmlFor: "interest" },
              "Interest Rate (p.a.)"
            )
          ),
          React.createElement(
            "td",
            null,
            React.createElement("input", { type: "number", step: "0.01", id: "interest", name: "interest", value: interest, onChange: function onChange(e) {
                return setInterest(e.target.value);
              } })
          ),
          React.createElement(
            "td",
            null,
            React.createElement(
              "span",
              null,
              "Nominal, may be composed of several composite rates/amounts"
            )
          )
        ),
        React.createElement(
          "tr",
          null,
          React.createElement(
            "td",
            null,
            React.createElement(
              "label",
              { htmlFor: "propertyValue" },
              "Property Value"
            )
          ),
          React.createElement(
            "td",
            null,
            React.createElement("input", { type: "number", step: "1000", id: "propertyValue", name: "propertyValue", value: propertyValue, onChange: function onChange(e) {
                return setPropertyValue(e.target.value);
              } })
          )
        ),
        React.createElement(
          "tr",
          null,
          React.createElement(
            "td",
            null,
            React.createElement(
              "label",
              { htmlFor: "fixedOutgoings" },
              "Fixed Outgoings"
            )
          ),
          React.createElement(
            "td",
            null,
            React.createElement("input", { type: "number", step: "100", id: "fixedOutgoings", name: "fixedOutgoings", value: fixedOutgoings, onChange: function onChange(e) {
                return setFixedOutgoings(e.target.value);
              } })
          ),
          React.createElement(
            "td",
            null,
            React.createElement(
              "span",
              null,
              "Body corp, maintenance allowance, rates etc. Ongoing stable expenses associated with owning the property. These are subtracted from Weekly Repayments and Rental before paying down the mortgage."
            )
          )
        ),
        React.createElement(
          "tr",
          null,
          React.createElement(
            "td",
            null,
            React.createElement(
              "label",
              { htmlFor: "rental" },
              "Rental Appraisal (weekly)"
            )
          ),
          React.createElement(
            "td",
            null,
            React.createElement("input", { type: "number", step: "50", id: "rental", name: "rental", value: rental, onChange: function onChange(e) {
                return setRental(e.target.value);
              } })
          )
        )
      )
    ),
    React.createElement("br", null),
    React.createElement("br", null),
    React.createElement(
      "table",
      null,
      React.createElement(
        "tbody",
        null,
        React.createElement(
          "tr",
          null,
          React.createElement(
            "th",
            { colSpan: "4" },
            "Outputs"
          )
        ),
        React.createElement(
          "tr",
          null,
          React.createElement(
            "th",
            { style: { paddingRight: '2em' } },
            "Deposit Percentage"
          ),
          React.createElement(
            "th",
            { style: { paddingRight: '2em' } },
            "Initial Mortgage Value"
          ),
          React.createElement(
            "th",
            { style: { paddingRight: '2em' } },
            "Viable Mortgage Value"
          ),
          React.createElement(
            "th",
            null,
            "Time Till Viable"
          )
        ),
        React.createElement(
          "tr",
          null,
          React.createElement(
            "td",
            null,
            depositPercentage.toFixed(1) + '%'
          ),
          React.createElement(
            "td",
            null,
            "$",
            mortgageValue
          ),
          React.createElement(
            "td",
            null,
            "$",
            viableMortgageValue
          ),
          React.createElement(
            "td",
            null,
            Math.floor(timeTillViable / 52),
            " years, ",
            Math.round(timeTillViable % 52),
            " weeks"
          )
        )
      )
    ),
    React.createElement(
      "p",
      null,
      "Viable \u2013 Approximated as the size of mortgage remaining that can be paid at the longes term available (30 years) by the rent alone (after paying the fixed outgoings)."
    )
  );
};

var domContainer = document.querySelector('#app');
ReactDOM.render(React.createElement(App), domContainer);