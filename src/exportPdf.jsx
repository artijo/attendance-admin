import { Page, Text, View, Document, StyleSheet, Font, PDFDownloadLink } from '@react-pdf/renderer';
import * as ReactPDF from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 10,
  },
  section: {
    marginBottom: 10,
  },
});

const MyDocument = () => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text>Here is my first PDF!</Text>
      </View>
    </Page>
  </Document>
);

// ฟังก์ชันเพื่อการดาวน์โหลด PDF
const handleExportPdf = () => {
  // สร้างลิงก์ดาวน์โหลด PDF เมื่อผู้ใช้คลิก
  const link = document.createElement('a');
  link.href = '/path-to-your-pdf'; // แน่ใจว่าคุณให้เส้นทางที่ถูกต้อง
  link.download = 'example.pdf'; // กำหนดชื่อไฟล์ PDF ที่จะดาวน์โหลด
  link.click();
};
export const App = () => (
  <div>
    <h1>Generate PDF with React</h1>
    <button onClick={handleExportPdf}>Export PDF</button>
    {/* ตัวอย่าง PDF download link */}
    <PDFDownloadLink document={<MyDocument />} fileName="example.pdf">
      {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
    </PDFDownloadLink>
  </div>
);
