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
    textHeader: {
        fontSize: 16 ,
        fontWeight: "bold",
        textAlign: "left",
        marginBottom: 10,
    },
    table: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#000",
        fontSize: 10,
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
