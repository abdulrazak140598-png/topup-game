import QRCode from 'qrcode';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  try {
    let amount = 400000;
    let product = 'Topup Game';
    
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      amount = body?.amount || amount;
      product = body?.product || product;
    } else {
      amount = req.query?.amount || amount;
    }

    const baseAmount = parseInt(amount);
    const uniqueCode = Math.floor(Math.random()*90)+10;
    const totalAmount = baseAmount + uniqueCode;
    const payId = `ROAN${Date.now().toString().slice(-8)}`;
    
    const payLink = `https://topup-game-roan.vercel.app/pay?id=${payId}&amount=${totalAmount}`;
    const qrImage = await QRCode.toDataURL(payLink, { width: 400, margin: 2 });

    return res.status(200).json({
      success: true,
      total_amount: totalAmount,
      nominal_diminta: baseAmount,
      unique_code: uniqueCode,
      product,
      qr_image: qrImage,
      qr_id: `QRIS-${payId}`
    });
  } catch(e){
    console.error(e);
    return res.status(500).json({ success: false, error: e.message, stack: e.stack });
  }
}
