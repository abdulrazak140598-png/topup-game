module.exports = async (req, res) => {
  const { amount, diamond } = req.query;
  
  // API Key dan Link Bayar punya abang dari foto tadi
  const PAY_LINK = 'https://api.kipay.id/pay/qpg_pub_0qY_WWQe1uLHo3Zow-PeX4MHogpx';

  if (!amount) {
    return res.status(400).json({ error: 'amount belum diisi' });
  }

  // Bikin link bayar dengan nominal dinamis
  const orderId = `ROAN-${diamond || 'DIAMOND'}-${Date.now()}`;
  const finalUrl = `${PAY_LINK}?amount=${amount}&order_id=${orderId}&description=${diamond}-Diamond-Promo`;

  return res.status(200).json({ 
    payUrl: finalUrl,
    orderId: orderId,
    amount: amount
  });
};
