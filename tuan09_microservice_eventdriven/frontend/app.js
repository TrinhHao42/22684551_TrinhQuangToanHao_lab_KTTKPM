const api = (path, opts = {}) => fetch('/api' + path, opts).then(r => r.json().catch(() => ({})));

let token = null;

document.getElementById('btnRegister').onclick = async () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const res = await api('/users/register', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ username, password }) });
  document.getElementById('loginResult').innerText = JSON.stringify(res);
};

document.getElementById('btnLogin').onclick = async () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const res = await api('/users/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ username, password }) });
  if (res.token) token = res.token;
  document.getElementById('loginResult').innerText = JSON.stringify(res);
};

async function loadFoods() {
  const foods = await api('/foods');
  const ul = document.getElementById('foodList');
  ul.innerHTML = '';
  const sel = document.getElementById('selectFood');
  sel.innerHTML = '';
  foods.forEach(f => {
    const li = document.createElement('li'); li.innerText = `${f.name} - ${f.price}`; ul.appendChild(li);
    const opt = document.createElement('option'); opt.value = f.id; opt.innerText = f.name; sel.appendChild(opt);
  });
}

document.getElementById('btnLoadFoods').onclick = loadFoods;

document.getElementById('btnOrder').onclick = async () => {
  const food_id = document.getElementById('selectFood').value;
  const amount = parseInt(document.getElementById('amount').value, 10);
  const res = await api('/orders', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ user_id: 1, food_id: parseInt(food_id), amount }) });
  document.getElementById('orderResult').innerText = JSON.stringify(res);
};

document.getElementById('btnLoadOrders').onclick = async () => {
  const orders = await api('/orders');
  const ul = document.getElementById('orderList'); ul.innerHTML = '';
  orders.forEach(o => { const li = document.createElement('li'); li.innerText = JSON.stringify(o); ul.appendChild(li); });
};

window.onload = () => loadFoods();
