console.log("services.js FULL LOADED");

// 🔌 Supabase
const sb = supabase.createClient(
  "https://mefzopeenhfdqfatbjaq.supabase.co",
  "sb_publishable_LU94dUJoW2jwZJ9WIdfsMw_lEnMQobx"
);

let userId = null;

/* =========================
   🔔 ПОВІДОМЛЕННЯ
========================= */
function msg(text){
  alert(text);
}

/* =========================
   🔢 ЛІМІТ КАЙФ-ЗОНИ
========================= */
async function updateKZLeft(){
  const el = document.getElementById("kzLeft");
  if(!el) return;

  const res = await sb.from("settings").select("key,value");

  let limit = 0;
  let sold  = 0;

  if(Array.isArray(res.data)){
    for(const r of res.data){
      if(r.key === "kz_limit") limit = Number(r.value);
      if(r.key === "kz_sold")  sold  = Number(r.value);
    }
  }

  el.innerText = "Залишилось місць: " + (limit - sold);
}

/* =========================
   🔐 ЗАВАНТАЖЕННЯ
========================= */
async function load(){
  const auth = await sb.auth.getUser();
  const user = auth.data.user;

  if(!user){
    msg("❌ Ви не увійшли в систему");
    location.href = "bank.html";
    return;
  }

  userId = user.id;

  // баланс
  const bankRes = await sb
    .from("bank")
    .select("balance")
    .eq("user_id", userId)
    .maybeSingle();

  const balance = bankRes.data ? bankRes.data.balance : 0;
  document.getElementById("balance").innerText = balance;

  await updateKZLeft();
}

/* =========================
   💳 ОПЛАТА
========================= */
async function pay(cost, title){
  if(!confirm(`Підтвердити покупку:\n${title}\nСума: ${cost}`)) return;

  const res = await sb
    .from("bank")
    .select("balance")
    .eq("user_id", userId)
    .single();

  if(res.data.balance < cost){
    msg("❌ Недостатньо коштів");
    return;
  }

  await sb
    .from("bank")
    .update({ balance: res.data.balance - cost })
    .eq("user_id", userId);

  msg(`✅ Оплачено: ${title}\n−${cost}`);
  await load();
}

/* =========================
   🛎️ ПОСЛУГИ
========================= */

// 🍬, 💧, 🥤, 💄
function buy(cost, title){
  pay(cost, title);
}

// 😎 КАЙФ-ЗОНА
async function buyKZ(){
  const n = Number(document.getElementById("kzCount").value);
  if(!n || n <= 0){
    msg("❗ Введіть кількість квитків");
    return;
  }

  const res = await sb.from("settings").select("key,value");

  let limit = 0;
  let sold  = 0;

  for(const r of res.data || []){
    if(r.key === "kz_limit") limit = r.value;
    if(r.key === "kz_sold")  sold  = r.value;
  }

  if(sold + n > limit){
    msg(`❌ Доступно лише ${limit - sold} місць`);
    return;
  }

  await pay(n * 30, `Кайф-зона (${n} квитків)`);

  await sb
    .from("settings")
    .update({ value: sold + n })
    .eq("key", "kz_sold");

  await updateKZLeft();
}

// 📽️ ПРОЕКТОР
function buyProjector(){
  const m = Number(document.getElementById("projMin").value);
  if(!m || m <= 0){
    msg("❗ Введіть хвилини");
    return;
  }
  pay(m * 3, `Проектор (${m} хв)`);
}

// 🧖‍♀️ SPA
function buySpa(){
  const min = Number(document.getElementById("spaMin").value);
  if(!min || min < 10 || min % 10 !== 0){
    msg("❗ Хвилини мають бути кратні 10");
    return;
  }
  pay((min / 10) * 50, `SPA масаж (${min} хв)`);
}

/* =========================
   🌍 РОБИМО ФУНКЦІЇ ГЛОБАЛЬНИМИ
   (для onclick в HTML)
========================= */
window.buy = buy;
window.buyKZ = buyKZ;
window.buyProjector = buyProjector;
window.buySpa = buySpa;

/* =========================
   🚀 СТАРТ
========================= */
window.addEventListener("DOMContentLoaded", load);
