import { PDFDownloadLink } from "@react-pdf/renderer";

function TextDropdownDocumentForPDF({PDFComponent, fileName, title}){
    return (
        <PDFDownloadLink document={PDFComponentd}  fileName={fileName}>
            <p 
                className="text-xs py-2 px-3 hover:cursor-pointer hover:bg-blue-500 hover:text-white"
            >
                {title}
            </p>

        </PDFDownloadLink>
        
    )
    
}
export default TextDropdownDocumentForPDF;
