// 🔗 Supabase
const sb = supabase.createClient(
  "https://mefzopeenhfdqfatbjaq.supabase.co",
  "sb_publishable_LU94dUJoW2jwZJ9WIdfsMw_lEnMQobx"
);

let userId = null;

// 🔐 отримати користувача
(async ()=>{
  const { data:{ user } } = await sb.auth.getUser();
  if(user) userId = user.id;
})();

// 📦 відкрити форму
function openOrder(){
  document.getElementById("orderBox").style.display = "block";
  calcSum();
}

// 💰 порахувати суму
function calcSum(){
  const q = Number(document.getElementById("qty").value || 1);
  document.getElementById("sum").innerText = (q * 0.3).toFixed(2);
}

// 🚀 відправити замовлення в БД
async function sendOrder(){
  const name = buyerName.value.trim();
  const orderNum = orderNumber.value.trim();
  const code = orderCode.value.trim();
  const q = Number(qty.value);
  const amount = q * 0.3;

  if(!name || !orderNum || code.length !== 4){
    alert("❗ Заповніть всі поля правильно");
    return;
  }

  const today = new Date().toISOString().slice(0,10);

  const { error } = await sb.from("orders").insert({
    user_id: userId,
    name: name,
    CVV: CVV,
    karta: karta,
    amount: amount,
    code: code,
    order_date: today,
    status: "pending"
  });

  if(error){
    alert("❌ Помилка збереження");
    console.error(error);
    return;
  }

  alert("✅ Замовлення створено. Очікує оплати");
  document.getElementById("orderBox").style.display = "none";
}

