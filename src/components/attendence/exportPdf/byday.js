import { Font, StyleSheet, } from '@react-pdf/renderer';
import lightFont from '../../../assets/fonts/pdffont/Anakotmai-Light.ttf'
import boldFont from '../../../assets/fonts/pdffont/Anakotmai-Bold.ttf'
import mediumFont from '../../../assets/fonts/pdffont/Anakotmai-Medium.ttf'
Font.register({
    family: 'Anakotmai',
    fonts:[
        {
            src: lightFont,
            fontWeight: 300
        },
        {
            src: mediumFont,
            fontWeight: 500
        },
        {
            src: boldFont,
            fontWeight: 700
        }
    ]
})


export const styles = StyleSheet.create({
    page: {
        backgroundColor: "#fff",
        fontFamily: "Anakotmai",
        padding: "30px 50px",
    },
    textHeader: {
        fontSize: 12,
        fontWeight: "normal",
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
});
