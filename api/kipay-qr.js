import QRCode from 'qrcode';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).json({error:'POST only'});
  
  try {
    const { amount, product } = req.body;
    const baseAmount = parseInt(amount);
    const uniqueCode = Math.floor(Math.random()*90)+10; // 10-99
    const totalAmount = baseAmount + uniqueCode;

    // Buat QR yang isinya link pembayaran + total unik
    // Nanti kalau abang kasih QRIS Statis 000201..., ganti link ini jadi QRIS dinamis beneran
    const payLink = `https://topup-game-roan.vercel.app/pay?amount=${totalAmount}&id=ROAN${Date.now()}`;
    
    const qrImage = await QRCode.toDataURL(payLink, { width: 400, margin: 2 });

    return res.json({
      success: true,
      total_amount: totalAmount,
      nominal_diminta: baseAmount,
      unique_code: uniqueCode,
      product: product || 'Topup Game',
      qr_image: qrImage,
      qr_id: `QRIS-ROAN-${Date.now().toString().slice(-8)}`
    });
  } catch(e){
    return res.status(500).json({error: e.message});
  }
}
