const Stripe = require('stripe');

function createCheckoutSession({ stripeSecretKey, planId, frontendUrl }) {
  if (!stripeSecretKey) {
    return {
      demo: true,
      url: `${frontendUrl}/dashboard?plan=${planId}`,
      message: 'Stripe не настроен — режим демо активирован'
    };
  }

  const stripe = new Stripe(stripeSecretKey);
  const planMap = {
    starter: { name: 'Старт', price: 0 },
    pro: { name: 'Профи', price: 1490 },
    business: { name: 'Бизнес', price: 3990 }
  };

  const plan = planMap[planId];
  if (!plan) {
    throw new Error('Неверный planId');
  }

  return stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{
      price_data: {
        currency: 'rub',
        product_data: { name: `${plan.name} — StudentJob` },
        unit_amount: plan.price * 100
      },
      quantity: 1
    }],
    success_url: `${frontendUrl}/dashboard?checkout=success`,
    cancel_url: `${frontendUrl}/dashboard?checkout=cancelled`,
    metadata: { planId }
  });
}

module.exports = { createCheckoutSession };
