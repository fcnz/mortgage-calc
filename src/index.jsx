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
  const mortgageValue = value - down

  // See how big a mortgage can be paid with just the rent at the given interest rate (viable mortgage)
  let viableDuration = 30 * 52 + 1
  let viableMortgageValue = mortgageValue
  while (true) {
    viableDuration = calcDuration(viableMortgageValue, interest / 52, 0, rental)
    if (viableDuration <= 30 * 52) break
    viableMortgageValue = viableMortgageValue - 1000
  }

  // Find how long to get from the initial mortgage to the viable mortgage while paying the payments amount
  const timeTillViable = viableMortgageValue === mortgageValue ? 0 : calcDuration(mortgageValue, interest / 52, viableMortgageValue, payments)

  return {
    mortgageValue,
    viableMortgageValue,
    timeTillViable
  }
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
  let remaining = initial
  let duration = 0
  while (remaining > target) {
    // console.log(remaining, remaining * (1 + rate) - remaining)
    remaining = remaining * (1 + rate) - payment
    duration++

    if (remaining > initial) return Infinity
  }
  // console.log('calcDuration end')

  return duration

  // console.log('Duration: %d years, %d weeks', Math.floor(duration / 12), Math.round(duration % 12))
}

const defaults = {
  downPayment: 150000,
  repayments: 1200,
  interest: 0.045,
  propertyValue: 690000,
  rental: 750,
  fixedOutgoings: 5000,
}

const App = () => {
  const [downPayment, setDownPayment] = React.useState(defaults.downPayment)
  const [repayments, setRepayments] = React.useState(defaults.repayments)
  const [interest, setInterest] = React.useState(defaults.interest)
  const [propertyValue, setPropertyValue] = React.useState(defaults.propertyValue)
  const [rental, setRental] = React.useState(defaults.rental)
  const [fixedOutgoings, setFixedOutgoings] = React.useState(defaults.fixedOutgoings)

  const depositPercentage = downPayment / propertyValue * 100

  const actualRepayments = repayments - fixedOutgoings / 52
  const effectiveRent = rental - fixedOutgoings / 52
  const {
    mortgageValue, viableMortgageValue, timeTillViable
  } = calculateScenario(
    downPayment,
    actualRepayments,
    interest,
    propertyValue,
    effectiveRent
  )

  return <div>
    <table>
      <tbody>
        <tr><th colSpan="3">Inputs</th></tr>
        <tr><th colSpan="2"></th></tr>
        <tr>
          <td><label htmlFor="down">Down Payment</label></td>
          <td><input type="number" step="1000" id="down" name="down" value={downPayment} onChange={(e) => setDownPayment(e.target.value)}/></td>
        </tr>

        <tr>
          <td><label htmlFor="repayments">Weekly Repayments</label></td>
          <td><input type="number" step="10" id="repayments" name="repayments" value={repayments} onChange={(e) => setRepayments(e.target.value)}/></td>
          <td><span>Income that can be put towards the property on an ongoing basis. Could be thought of as the approx amount that currently goes to rent and most that goes to savings. Would likely still make minimum kiwisaver contributions and keep a splash fund aside.</span></td>
        </tr>

        <tr>
          <td><label htmlFor="interest">Interest Rate (p.a.)</label></td>
          <td><input type="number" step="0.01" id="interest" name="interest" value={interest} onChange={(e) => setInterest(e.target.value)}/></td>
          <td><span>Nominal, may be composed of several composite rates/amounts</span></td>
        </tr>

        <tr>
          <td><label htmlFor="propertyValue">Property Value</label></td>
          <td><input type="number" step="1000" id="propertyValue" name="propertyValue" value={propertyValue} onChange={(e) => setPropertyValue(e.target.value)}/></td>
        </tr>

        <tr>
          <td><label htmlFor="fixedOutgoings">Fixed Outgoings</label></td>
          <td><input type="number" step="100" id="fixedOutgoings" name="fixedOutgoings" value={fixedOutgoings} onChange={(e) => setFixedOutgoings(e.target.value)}/></td>
          <td><span>Body corp, maintenance allowance, rates etc. Ongoing stable expenses associated with owning the property. These are subtracted from Weekly Repayments and Rental before paying down the mortgage.</span></td>
        </tr>

        <tr>
          <td><label htmlFor="rental">Rental Appraisal (weekly)</label></td>
          <td><input type="number" step="50" id="rental" name="rental" value={rental} onChange={(e) => setRental(e.target.value)}/></td>
        </tr>
      </tbody>
    </table>

    <br/>
    <br/>

    <table>
      <tbody>
        <tr><th colSpan="4">Outputs</th></tr>
        <tr>
          <th style={{paddingRight: '2em'}}>Deposit Percentage</th>
          <th style={{paddingRight: '2em'}}>Initial Mortgage Value</th>
          <th style={{paddingRight: '2em'}}>Viable Mortgage Value</th>
          <th>Time Till Viable</th>
        </tr>
        <tr>
          <td>{depositPercentage.toFixed(1) + '%'}</td>
          <td>${mortgageValue}</td>
          <td>${viableMortgageValue}</td>
          <td>{Math.floor(timeTillViable / 52)} years, {Math.round(timeTillViable % 52)} weeks</td>
        </tr>
      </tbody>
    </table>

    <p>Viable – Approximated as the size of mortgage remaining that can be paid at the longes term available (30 years) by the rent alone (after paying the fixed outgoings).</p>
  </div>
}

const domContainer = document.querySelector('#app')
ReactDOM.render(React.createElement(App), domContainer)
