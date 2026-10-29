export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  try {
    const data = req.body;
    console.log('KIPAY WEBHOOK DAPAT:', data);
    
    // data.is_paid = true kalau udah bayar
    // data.amount = jumlah Rp yang dibayar
    // Simpan ke database / kirim ke WA abang

    // WAJIB balikin 200 biar Kipay tau sukses
    return res.status(200).json({ success: true, message: 'Webhook diterima' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
}
