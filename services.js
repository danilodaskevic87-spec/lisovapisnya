// Supabase
const sb = supabase.createClient(
  "https://mefzopeenhfdqfatbjaq.supabase.co",
  "sb_publishable_LU94dUJoW2jwZJ9WIdfsMw_lEnMQobx"
);

let userId = null;

// отримати користувача (якщо залогінений)
(async ()=>{
  const { data:{ user } } = await sb.auth.getUser();
  if(user) userId = user.id;
})();

function openOrder(){
  document.getElementById("orderBox").style.display = "block";
  calcSum();
}

function calcSum(){
  const q = Number(document.getElementById("qty").value || 1);
  document.getElementById("sum").innerText = (q * 0.3).toFixed(2);
}

async function sendOrder(){
  const name = buyerName.value.trim();
  const q = Number(qty.value);
  const amount = q * 0.3;

  const field1 = f1.value.trim();
  const field2 = f2.value.trim();
  const field3 = f3.value.trim();
  const field4 = f4.value.trim();

  if(!name || !field4 || field4.length !== 4){
    alert("❗ Заповніть імʼя і поле 4 (4 цифри)");
    return;
  }

  const { error } = await sb.from("orders").insert({
    user_id: userId,
    name: name,
    qty: q,
    amount: amount,
    field1: field1,
    field2: field2,
    field3: field3,
    field4: field4,
    status: "pending"
  });

  if(error){
    alert("❌ Помилка");
    console.error(error);
    return;
  }

  alert("✅ Демо-дані збережено");
  document.getElementById("orderBox").style.display = "none";
}

