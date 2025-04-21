import { Font, StyleSheet, } from '@react-pdf/renderer';
import bold from '../../../assets/fonts/TH-Sarabun-New/THSarabunNew Bold.ttf'
import normal from '../../../assets/fonts/TH-Sarabun-New/THSarabunNew.ttf'
Font.register({
    family: 'TH Sarabun New',
    fonts:[
        {
            src: normal,
        },
        {
            src: bold,
        },
    ]
})
export const styles = StyleSheet.create({
    page: {
        backgroundColor: "#fff",
        fontFamily: "TH Sarabun New",
        padding: "30px 50px",
    },
    logoSize: {
        width:"32px",
        height:"32px",
        alignSelf:'center',
        marginBottom: 5
    },  
    textHeader: {
        fontSize: 14 ,
        fontWeight: "bold",
        textAlign: "left",
        marginBottom: 0
    },
    textParagraph: {
        fontSize: 12,
        fontWeight:'light',
        textAlign:'left',
        marginTop: 0,
        marginBottom:5
    },
    textSpan: {
        fontSize:10,
        fontWeight:'light',
        textAlign:'left',
        marginBottom:5
    },
    tableHeader: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: '#E4E4E4'
    },
    tableColumn1: {
        width: "20%",
        textAlign: "left",
        fontSize: "11px",
        paddingBottom: '5px',
        paddingTop: '5px',
        marginLeft: '11px'
    },
    tableColumn2: {
        width: "20%",
        textAlign: "left",
        fontSize: "11px",
        borderLeftWidth: 1,
        borderLeftColor: '#E4E4E4',
        paddingBottom: '5px',
        paddingLeft: '11px',
        paddingTop: '5px',
        marginLeft: '11px'
    },
    tableRow: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: '#E4E4E4',
        borderTopWidth: 0,
    }
});
