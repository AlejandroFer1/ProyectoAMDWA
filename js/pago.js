import { supabase } from "./supabase-client.js";

document.addEventListener("DOMContentLoaded", async () => {
  const btnPay = document.getElementById("btn-pay");
  const authWarning = document.getElementById("auth-warning");
  const btnCoupon = document.getElementById("btn-apply-coupon");
  const formPayment = document.getElementById("payment-form");

  let currentUserId = null;
  const basePrice = 15.0;
  let finalPrice = basePrice;

  // 1. Verificación de Autenticación
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (!session) {
    authWarning.style.display = "block";
    btnPay.disabled = true;
    btnPay.style.opacity = "0.5";
    btnPay.style.cursor = "not-allowed";
  } else {
    currentUserId = session.user.id;
    // Comprobar si ya es premium
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_premium")
      .eq("id", currentUserId)
      .single();

    if (profile && profile.is_premium) {
      alert("¡Ya posees una Licencia Monarca Activa!");
      window.location.href = "perfil.html";
      return;
    }
  }

  // 2. Lógica de Cupones Simulada (Conectando mentalmente con Rewards)
  btnCoupon.addEventListener("click", () => {
    const code = document
      .getElementById("coupon-code")
      .value.toUpperCase()
      .trim();
    const msg = document.getElementById("coupon-msg");
    const discountRow = document.getElementById("discount-row");
    const discountPctEl = document.getElementById("discount-pct");
    const discountAmtEl = document.getElementById("discount-amount");
    const totalPriceEl = document.getElementById("total-price");

    let discountPercent = 0;

    // Diccionario rápido paralelo a js/rewards.js
    if (code === "HUNTER-D") discountPercent = 5;
    else if (code === "HUNTER-C") discountPercent = 10;
    else if (code === "HUNTER-B") discountPercent = 15;
    else if (code === "HUNTER-A") discountPercent = 25;
    else if (code === "HUNTER-S") discountPercent = 50;
    else if (code === "DEV") discountPercent = 100; // Easter Egg For Testing

    if (discountPercent > 0) {
      msg.textContent = `¡Cupón válido! Se aplicó un ${discountPercent}% de descuento.`;
      msg.style.color = "var(--color-accent)";

      const discountAmount = (basePrice * discountPercent) / 100;
      finalPrice = basePrice - discountAmount;

      discountPctEl.textContent = discountPercent;
      discountAmtEl.textContent = `-$${discountAmount.toFixed(2)}`;
      discountRow.style.display = "flex";
      totalPriceEl.textContent = `$${finalPrice.toFixed(2)}`;

      btnCoupon.disabled = true;
      document.getElementById("coupon-code").disabled = true;
    } else {
      msg.textContent = "Cupón inválido o expirado.";
      msg.style.color = "red";
    }
  });

  // 3. Procesar el Pago
  formPayment.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!currentUserId) {
      alert("Error: Debes iniciar sesión primero.");
      return;
    }

    // Simulando procesamiento de pago
    btnPay.textContent = "Procesando...";
    btnPay.disabled = true;

    // Fake delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Validar tarjeta "falsa"
    const cardNumber = document
      .getElementById("card-number")
      .value.replace(/\s/g, "");
    if (cardNumber.length < 15) {
      alert("Por favor, introduce una tarjeta de prueba válida.");
      btnPay.textContent = "Confirmar Pago 🔒";
      btnPay.disabled = false;
      return;
    }

    try {
      // Marcar usuario como premium en Base de datos
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ is_premium: true })
        .eq("id", currentUserId);

      if (updateError) throw updateError;

      alert(
        "¡Transacción Exitosa! \n\nTu Licencia Monarca ha sido activada correctamente.",
      );
      window.location.href = "perfil.html";
    } catch (err) {
      console.error("Payment sync failed:", err);
      alert(
        "Hubo un error de conexión al actualizar tu estatus. El cobro no se ha realizado.",
      );
      btnPay.textContent = "Confirmar Pago 🔒";
      btnPay.disabled = false;
    }
  });

  // Utilidad: Espaciar números de tarjeta
  document
    .getElementById("card-number")
    .addEventListener("input", function (e) {
      let target = e.target;
      let position = target.selectionStart;
      let length = target.value.length;
      target.value = target.value
        .replace(/\D/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
      if (position !== length) {
        target.setSelectionRange(position, position);
      }
    });
});
