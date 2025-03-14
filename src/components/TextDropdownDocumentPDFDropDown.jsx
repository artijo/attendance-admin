import { Children, useEffect, useRef, useState } from "react";
function TextDropdownDocumentPDFDropDown({children, title}){
    const [isPopUp, setIsPopUp] = useState(false);

    const handlePopUp = () => {
        console.log(`popup Click!`);
        setIsPopUp((prevState) => !prevState);
    }

    const ComponentChildren = () => {
        if(isPopUp){
            return (
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" onClick={handlePopUp}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                    <h2>รายการห้องเรียน</h2>
                    {Children.map(children, child => 
                        <div className="Row">
                            {child}
                        </div>
                    )}
                </div>
            )
        }
    };

    return (
        <>
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
                <ComponentChildren/>
            </div>
            <div
                className="text-sm py-2 px-3 hover:cursor-pointer"
                onClick={handlePopUp}
            >
                <span>{title}</span>
            </div>
        
        </>
        
    )
}
export default TextDropdownDocumentPDFDropDown;
