// import axios from "axios";
// import { useEffect, useState } from "react";
// import { HOSTNAME } from "../../config";

// export const SubjectDetail = ({ subject, time }) => {
//     const [subjectInfo, setSubjectInfo] = useState({});
//     const [currrentValue, setCurrentValue] = useState({});

//     const fetchSubjectData = async () => {
//         try {
//             const response = await axios.get(`${HOSTNAME}/a/subject/${subject}`);
//             setSubjectInfo(response.data);
//             console.log(response.data);
//             // if(currrentValue){
//             //     console.log(currrentValue);
//             // }
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     useEffect(() => {
//         if (subject ) {
//             fetchSubjectData();
//             setCurrentValue(time);
//         }
//     }, [subject]);

//     return (
//         <div>
//             {
//                 Object.keys(subjectInfo).length > 0 && (
//                     <>
//                         <p>
//                             {currrentValue.timeStart} - {currrentValue.timeEnd}
//                         </p>
//                         <p>{subjectInfo.subCode}</p>
//                         <p>ครู{subjectInfo.teacher.fName}</p>
                        
//                     </>
//                 )
//             }
//         </div>
//     );
// };