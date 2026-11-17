const items = [
  {id: "Rice", name:"Rice", price: 3600},
  {id: "beans", name: "Beans", price: 3200},
  {id: "oil", name: "Oil(per_can)", price: 350},
  {id: "gas", name: "Cooking Gas", price: 1250},
  {id: "pasta", name: "Sphaghetti/Macaroni", price: "700"},
  {id: "garri", name: "Garri", price: "1500"}
];
let input = document.getElementById('tmoney')

document.addEventListener("DOMContentLoaded", () => {
  const listContainer = document.getElementById('list')

  items.forEach(item => {
    const itemHTML = `
    <div class="listitem">
      <div class="info">
       <span class="name">${item.name}</span>
        <span class="price">${item.price.toLocaleString()}</span>
      </div>
      <input type="text" class="quantity" id="qty-${item.id}" min="0">
    </div>
    `;
    listContainer.innerHTML += itemHTML
  });
  document.getElementById('calculate').addEventListener('click', () => {
    runCalculatorUI
    if (!input.reportValidity()) {
      return; // Shows the native popup and stops the function
    }

    console.log('Input value:', input.value);
  })
});

function calculateStudentBudget(availableBudget, selectedQuantities) {
    let totalSpending = 0;
    let itemBreakdown = [];

    items.forEach(item => {
        const quantity = selectedQuantities[item.id] || 0;
        
        if (quantity > 0) {
            const itemTotalCost = item.price * quantity;
            totalSpending += itemTotalCost;
            
            itemBreakdown.push({
                name: item.name,
                quantity: quantity,
                cost: itemTotalCost
            });
        }
    });

    let isOverBudget = totalSpending > availableBudget;
    let balanceDifference = Math.abs(availableBudget - totalSpending);
    let percent = (availableBudget/100) * 15
    let invalid = percent <= (availableBudget - totalSpending)
    

    return {
        totalSpending: totalSpending,
        isOverBudget: isOverBudget,
        differenceAmount: balanceDifference,
        breakdown: itemBreakdown,
        percent: percent,
        invalid: invalid
    };
}

function runCalculatorUI() {
    // 1. Extract what the user typed in
    const tmoneyInput = parseFloat(document.getElementById("tmoney").value) || 0;

    const currentCart = {};
    items.forEach(item => {
        const element = document.getElementById(`qty-${item.id}`);
        currentCart[item.id] = parseInt(element.value) || 0;
    });

    // 2. Run background logic equations 
    const analysis = calculateStudentBudget(tmoneyInput, currentCart);

    // 3. Map values back onto target UI container nodes
    const rcontainer = document.getElementById("rcontainer");
    const statusTitle = document.getElementById("resultT");
    const Totalspending = document.getElementById("Totalspending");
    const Balancecheck = document.getElementById("Balancecheck");
    const receipts = document.getElementById("receipts");
    const test = document.getElementById('test')

    // 4. Clean style states and reveal results card
    rcontainer.className = "result-box"; 
    rcontainer.style.display = "block"; 

    // 5. Change theme context color depending on calculation status
    if (analysis.isOverBudget) {
        rcontainer.classList.add("warning");
        statusTitle.innerText = "🚨 Over Budget Alert!";
        Balancecheck.innerText = `You are short by: ₦${analysis.differenceAmount.toLocaleString()}`;
    } else {
        rcontainer.classList.add("safe");
        statusTitle.innerText = "✅ Safe Budget!";
        Balancecheck.innerText = `Remaining Emergency Cash: ₦${analysis.differenceAmount.toLocaleString()}`;
    }
    if (analysis.invalid) {
      test.innerHTML = `<em>Budget Emergency Percentage Remaining:
      15%</em>`
    } else {
      test.innerHTML = `<em>Budget Emergency Percentage too low</em>`
    }

    Totalspending.innerText = `Total Planned Spending: ₦${analysis.totalSpending.toLocaleString()}`;

    // 6. Draw dynamic itemized summary recipe strings
    if (analysis.breakdown.length === 0) {
        receipts.innerHTML = "<em>No items selected yet.</em>";
    } else {
        let breakdownHTML = "<strong>Cart Summary:</strong><br>";
        analysis.breakdown.forEach(item => {
            breakdownHTML += `• ${item.name} (x${item.quantity}) — ₦${item.cost.toLocaleString()}<br>`;
        });
        receipts.innerHTML = breakdownHTML;
    }
}





