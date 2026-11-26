import items from "./data.js"

export function NGN(amount) {
  const number = Number(amount);
  if (!Number.isFinite(number)){
    throw new Error (`Invalid Amount ${amount}`)
  }
  return number.toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN"
  })
}

export function doomsday(array){
  const result = {
    all: array,
    ids: array.map(item => item.id),
    prices: array.map(item => item.price),
    names: array.map(item => item.name)
  }
  array.forEach(item => {
    result[item.id] = item
  })
  return result
}
const stuff = doomsday(items)


export function parseQuantity(value) {
    const text = String(value ?? "").trim();

    if (text === "") return 0;

    let quantity;

    if (/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(text)) {
        quantity = Number(text);
    } else {
        const match = text.match(
            /^(?:(\d+)\s+)?(\d+)\s*\/\s*(\d+)$/
        );

        if (!match) {
            throw new Error(
                'Use a quantity like "5", "0.5", "3/4", or "1 1/2".'
            );
        }

        const whole = Number(match[1] || 0);
        const numerator = Number(match[2]);
        const denominator = Number(match[3]);

        if (![whole, numerator, denominator].every(Number.isSafeInteger)) {
            throw new Error("Fraction values are too large.");
        }

        if (denominator === 0) {
            throw new Error("Denominator cannot be zero.");
        }

        quantity = whole + numerator / denominator;
    }

    if (
        !Number.isFinite(quantity) ||
        quantity < 0 ||
        quantity > Number.MAX_SAFE_INTEGER
    ) {
        throw new Error("Enter a valid, non-negative quantity.");
    }

    return quantity;
}


export function calculate(budget, amount) {
  let total = 0
  let info = []
  items.forEach(item => {
    const quantity = amount[item.id] || 0

    if (quantity > 0) {
      const totalcost = item.price * quantity 
      total += totalcost
      info.push({
        name: item.name,
        quantity: quantity,
        cost: totalcost
      })
    }
  })
  
  let over = total > budget
  let balance = Math.abs(budget-total)
  return {
    Totalspent : total,
    Balance: balance,
    Over: over,
    Breakdown: info
  }
}


