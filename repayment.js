/*

remaining = initial * (1 + rate)^duration - payment * duration * (1 + rate)^(duration - 1)
int = 1 + rate
remaining = initial * int^duration - duration * int^duration
ln(remaining) = duration * ln(initial * int) - duration * ln(duration * int)
ln(remaining) = duration ( ln(initial * int) - ln(duration * int) )
ln(remaining) = duration ( ln(initial) - ln(duration) )
0 = duration * ln(initial) - duration * ln(duration) - ln(remaining)

*/

console.log(['houseValue', 'down', 'mortgageValue', 'rental', 'interest', 'payments', 'viableMortgageValue', 'timeTillViable'].join(','));

const down = 100000
const payments = 1000

for (let interest = 0.045; interest <= 0.06; interest = interest + 0.015) {
  for (let houseValue = 400000; houseValue <= 1000000; houseValue = houseValue + 50000) {
    for (let rental = 400; rental <= 700; rental = rental + 25) {
      // console.log('Trying', down, payments, interest, houseValue, rental)
      const { mortgageValue, viableMortgageValue, timeTillViable } = calculateScenario(down, payments, interest, houseValue, rental)
      console.log([houseValue, down, mortgageValue, rental, interest, payments, viableMortgageValue, timeTillViable].join(','));
    }
  }
}

return

function calculateScenario(down, payments, interest, value, rental) {
  // Find how big the initial mortgage is
  const mortgageValue = value - down

  // See how big a mortgage can be paid with just the rent at the given interest rate (viable mortgage)
  let viableDuration = 30 * 52 + 1
  let viableMortgageValue = mortgageValue
  while (true) {
    viableDuration = calcDuration(viableMortgageValue, interest / 52, 0, rental)
    if (viableDuration <= 30 * 52) break
    viableMortgageValue = viableMortgageValue - 50000
  }

  // Find how long to get from the initial mortgage to the viable mortgage while paying the payments amount
  const timeTillViable = viableMortgageValue === mortgageValue ? 0 : calcDuration(mortgageValue, interest / 52, viableMortgageValue, payments)

  return {
    mortgageValue,
    viableMortgageValue,
    timeTillViable
  }
}

const payment = 1000
const duration = calcDuration(500000, 0.06 / 52, 425000, payment)
console.log('Payment: $%d.00, Duration: %d years', payment, (duration / 52).toFixed(2))
return

for (let payment = 1000; payment < 3000; payment = payment + 10) {
  const duration = calcDuration(500000, 0.0444 / 52, 425000, payment)
  if (duration < (52 * 3)) {
    console.log('Payment: $%d.00, Duration: %d years, %d weeks', payment, Math.floor(duration / 52), Math.round(duration % 52))
    break
  }
}

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
