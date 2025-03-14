import { Children, useEffect, useRef, useState } from "react";
function TextDropdownDocumentPDFDropDown({children, title}){
    const [isPopUp, setIsPopUp] = useState(false);

    const handlePopUp = () => {
        setIsPopUp((prevState) => !prevState);
    }
    
    return (
        <>
            <div
                className="text-sm py-2 px-3 hover:cursor-pointer hover:bg-blue-600 hover:text-white"
                onClick={handlePopUp}
            >
                <span>{title}</span>
            </div>
        
        </>
        
    )
}
export default TextDropdownDocumentPDFDropDown;
