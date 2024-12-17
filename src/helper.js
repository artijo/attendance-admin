export function formatPhoneNumber(phoneNumber) {
    // ลบตัวอักษรที่ไม่ใช่ตัวเลขออก
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // ตรวจสอบว่าหมายเลขโทรศัพท์มีความยาวเพียงพอ
    if (cleaned.length !== 10) {
      return 'หมายเลขโทรศัพท์ไม่ถูกต้อง';
    }
    
    // เพิ่มฟอร์แมต xxx-xxx-xxxx
    const formatted = cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    
    return formatted;
  }
  