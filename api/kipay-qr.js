// api/kipay-qr.js
const WHSEC = process.env.KIPAY_WHSEC;
const STATIC_QRIS = process.env.KIPAY_QRIS_STATIC;
function toCRC16(str){
  let crc = 0xFFFF;
  for(let c of str){
    crc ^= c.charCodeAt(0) << 8;
    for(let i=0;i<8;i++) crc = crc & 0x8000 ? (crc<<1)^0x1021 : crc<<1;
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4,'0');
}

function makeDynamicQRIS(base, amount){
  // 1. Hapus CRC lama + ubah static 010211 jadi dynamic 010212
  let qris = base.slice(0,-4).replace("010211","010212");
  // 2. Split di 5802ID
  let parts = qris.split("5802ID");
  let before = parts[0];
  let after = parts[1];
  // 3. Encode amount tag 54
  let amtStr = amount.toString();
  let amtTag = `54${String(amtStr.length).padStart(2,'0')}${amtStr}`;
  // 4. Gabung + hitung CRC baru
  let raw = before + amtTag + "5802ID" + after;
  let crc = toCRC16(raw + "6304");
  return raw + "6304" + crc;
}

export default async function handler(req,res){
  let {amount, uid, diamond} = req.body;
  let unique = Math.floor(Math.random()*90)+10; // 10-99 kayak 12 di foto abang
  let total = parseInt(amount) + unique;
  
  let dynamicString = makeDynamicQRIS(STATIC_QRIS, total);
  
  // QR image base64
  let QRCode = require('qrcode');
  let qrImage = await QRCode.toDataURL(dynamicString);

  res.json({
    total_amount: total,
    nominal_diminta: parseInt(amount),
    unique_code: unique,
    qr_string: dynamicString,
    qr_image: qrImage,
    qr_id: `QRIS-${Date.now().toString().slice(-8)}-${Math.random().toString(36).slice(2,6).toUpperCase()}`
  });
}
