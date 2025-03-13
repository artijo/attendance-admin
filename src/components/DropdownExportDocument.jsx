import { Children, useEffect, useRef, useState } from "react";


const useOutSideClick = (callback) => {
    const ref = useRef();
    useEffect(() => {
        const handleClick = (event) => {
            if(ref.current && !ref.current.contains(event.target)){
                callback();
            }
            
        };
        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('click', handleClick);
        };
    },[ref])
    return ref;
}
function DropdownExportDocument({children}){
    
    const [isShow, setIsShow] = useState(false);

    const handleClickOutside = () => {
        setIsShow(false);
    };
    
    const handleOnclick = () => {
        setIsShow((state) => !state);
    }
    const ref = useOutSideClick(handleClickOutside);

    return (
        <div
            ref={ref} 
            className={`relative flex flex-col w-[200px] border border-gray-300 ${isShow && `border-blue-300`}  rounded-md `}
            onClick={handleOnclick}
        >
            <div className="flex justify-between items-center h-[48px] px-3 z-40 ">
                <p className="cursor-default">ดาวน์โหลดเอกสาร</p>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
            </div>
            <div className={`${isShow ? `block` : `hidden`} absolute top-[100%] mt-[1px]  z-10 border border-slate-500 bg-white w-full`}>
                {Children.map(children, child => 
                    <div className="Row">
                        {child}
                    </div>
                )}
            </div>
            
        </div>
    )
}
export default DropdownExportDocument;
