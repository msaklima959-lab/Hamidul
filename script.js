let products = [];
let sellValue = 0;
let profitValue = 0;

// পেজ লোড হওয়ার সময় ডাটা নিয়ে আসা
window.onload = loadData;

function addItem() {
    let name = document.getElementById('pName').value;
    let buy = parseFloat(document.getElementById('pBuy').value);
    let sell = parseFloat(document.getElementById('pSell').value);
    let qty = parseInt(document.getElementById('pQty').value);

    if (!name || isNaN(buy) || isNaN(sell) || isNaN(qty)) {
        alert("সব ঘর পূরণ করুন!");
        return;
    }

    let product = { id: Date.now(), name, buy, sell, qty };
    products.push(product);
    
    saveAndRefresh();
    clearInputs();
}

function renderTable() {
    let tbody = document.querySelector('#itemTable tbody');
    tbody.innerHTML = '';
    let currentStockTotal = 0;

    products.forEach(p => {
        currentStockTotal += (p.buy * p.qty);
        let row = tbody.insertRow();
        row.innerHTML = `
            <td>${p.name}</td>
            <td>${p.qty}</td>
            <td>${p.buy}</td>
            <td>${p.sell}</td>
            <td>
                <input type="number" id="sellQty-${p.id}" class="sell-input" value="1" min="1" max="${p.qty}">
                <button class="btn-sell" onclick="sellItem(${p.id})">বিক্রি</button>
            </td>
        `;
    });

    document.getElementById('totalStock').innerText = currentStockTotal.toLocaleString() + " ৳";
    document.getElementById('totalSell').innerText = sellValue.toLocaleString() + " ৳";
    document.getElementById('totalProfit').innerText = profitValue.toLocaleString() + " ৳";
}

function sellItem(id) {
    let sellQtyInput = document.getElementById(`sellQty-${id}`);
    let sQty = parseInt(sellQtyInput.value);
    let pIndex = products.findIndex(p => p.id === id);
    let p = products[pIndex];

    if (sQty > p.qty) {
        alert("স্টকের চেয়ে বেশি বিক্রি সম্ভব নয়!");
        return;
    }

    sellValue += (p.sell * sQty);
    profitValue += ((p.sell - p.buy) * sQty);
    p.qty -= sQty;

    if (p.qty <= 0) products.splice(pIndex, 1);

    saveAndRefresh();
}

function saveAndRefresh() {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('sellValue', sellValue);
    localStorage.setItem('profitValue', profitValue);
    renderTable();
}

function loadData() {
    products = JSON.parse(localStorage.getItem('products')) || [];
    sellValue = parseFloat(localStorage.getItem('sellValue')) || 0;
    profitValue = parseFloat(localStorage.getItem('profitValue')) || 0;
    renderTable();
}

function clearInputs() {
    document.getElementById('pName').value = '';
    document.getElementById('pBuy').value = '';
    document.getElementById('pSell').value = '';
    document.getElementById('pQty').value = '';
}

function resetAll() {
    if (confirm("আপনি কি নিশ্চিত? সব ডাটা স্থায়ীভাবে মুছে যাবে!")) {
        localStorage.clear();
        location.reload();
    }
}