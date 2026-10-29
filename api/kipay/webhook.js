module.exports = async (req, res) => {
  if (req.method === 'GET') {
    return res.status(200).send('Webhook KiPay Roan Ready - 404 akan hilang!');
  }

  console.log('KiPay Webhook masuk:', req.body);

  // Kalau status paid, order lunas
  if (req.body && (req.body.status === 'paid' || req.body.status === 'success' || req.body.status === 'PAID')) {
    console.log(`ORDER ${req.body.order_id} LUNAS! Siap kirim diamond`);
  }

  // Wajib balikin 200 biar KiPay anggap sukses
  return res.status(200).json({ received: true, status: 'ok' });
};
