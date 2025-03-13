import { styles } from "./style.js";
import { Page, Text, View, Document, PDFViewer } from "@react-pdf/renderer";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
function FilterByClassroom({
    participateList
}){
    return (
        <Document>
            <Page size="A4" style={styles.page} orientation="landscape">

            </Page>
        </Document>
    );
};

export default FilterByClassroom;