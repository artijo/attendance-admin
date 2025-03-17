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
    table: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#000",
        fontSize: 10,
        marginTop:10,
        marginBottom:10,
    },
    tableHeader: {
        backgroundColor: "#e5e5e5",
        flexDirection: "row",
    },
    td: {
        flex: 1,
        padding: 4,
        textAlign: "center",
        fontWeight: "normal",
        fontSize: 8,
        borderWidth: 1,
        borderColor: "#000",
    },
    headerDisplay: {
        display:'flex',
        flexDirection: 'row',
        justifyContent:'space-between'
    }
});
