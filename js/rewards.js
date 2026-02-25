export class Rewards {
  /**
   * Obtiene los beneficios correspondientes a un rango específico.
   * @param {string} rank - El rango del usuario ('E', 'D', 'C', 'B', 'A', 'S')
   * @returns {Object} Objeto con el porcentaje de descuento y el código de cupón.
   */
  static getRankBenefits(rank) {
    const benefits = {
      E: {
        discountPercentage: 0,
        couponCode: null,
        message: "Sigue entrenando para desbloquear descuentos.",
        color: "#888888", // Gris
      },
      D: {
        discountPercentage: 5,
        couponCode: "HUNTER-D",
        message: "Tienes un 5% de descuento en la tienda.",
        color: "#4CAF50", // Verde
      },
      C: {
        discountPercentage: 10,
        couponCode: "HUNTER-C",
        message: "Tienes un 10% de descuento en la tienda.",
        color: "#2196F3", // Azul
      },
      B: {
        discountPercentage: 15,
        couponCode: "HUNTER-B",
        message: "Tienes un 15% de descuento en la tienda.",
        color: "#9C27B0", // Morado
      },
      A: {
        discountPercentage: 25,
        couponCode: "HUNTER-A",
        message: "Tienes un 25% de descuento en la tienda.",
        color: "#FF9800", // Naranja
      },
      S: {
        discountPercentage: 50,
        couponCode: "HUNTER-S",
        message: "¡VIP! 50% de descuento y envíos gratis.",
        color: "#F44336", // Rojo/Dorado
      },
    };

    // Devolver beneficios o los de E por defecto si hay algún error
    return benefits[rank] || benefits["E"];
  }
}
