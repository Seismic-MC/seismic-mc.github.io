import {doomsday, parseQuantity, calculate, NGN} from "./Logic.js"
import items from "./data.js"
const stuff = doomsday(items)


document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById('list')
  let input = document.getElementById('pocketMoney')
  items.forEach(item => {
    const itemHTML = `
    <div class="listItems">
      <div class="info">
        <span class="name">${item.name}</span>
        <span class="price">${NGN(item.price)}</span>
      </div>
      <input type="text" class="quantity" id="qty${item.id}" min="0" placeholder="Quantity">
    </div>
    `
    list.innerHTML += itemHTML
  })
  document.getElementById('calculateBtn').addEventListener('click', Runlogic)
})

function Runlogic(){
  const input = parseFloat(document.getElementById('pocketMoney').value || 0);

  const cart = {};

  items.forEach(item => {
    const element = document.getElementById(`qty${item.id}`)
    cart[item.id] = parseQuantity(element.value)||0
  })
  
  const analysis = calculate(input, cart)
  
  const resultbox = document.getElementById('resultBox')
  const resultTitle = document.getElementById('resultTitle')
  const totalText = document.getElementById('totalText')
  const balancetext = document.getElementById('balanceText')
  const receiptText = document.getElementById('receipt')

  resultbox.className = "result-box"
  resultbox.style.display = "block"
  if (analysis.Over){
    resultbox.classList.add('warning')
    resultTitle.innerText = "Over Budget Alert"
    balancetext.innerText = `You are short by ${NGN(analysis.Balance)}`
  } else {
    resultbox.classList.add('Safe')
    resultTitle.innerText = "Safe Budget"
    balancetext.innerText = `Remaining Cash ${NGN(analysis.Balance)}`
  }

  totalText.innerText = `Total planned spending ${NGN(analysis.Totalspent)}`

  if (analysis.Breakdown.length === 0) {
    receipt.innerHTML = "<em>No items Selected</em>"
  } else {
     let breakdownHTML = "<strong>Cart Summary:</strong><br>";
        analysis.Breakdown.forEach(item => {
            breakdownHTML += `• ${item.name} (x${item.quantity}) — ₦${item.cost}<br>`;
        });
        receipt.innerHTML = breakdownHTML;
  }
}










