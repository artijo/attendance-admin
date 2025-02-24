function TextDropdownDocument({title, actionFunction}){
    return (
        <p 
            className="py-2 px-3 hover:cursor-pointer hover:bg-blue-500 hover:text-white"
            onClick={actionFunction}
        >
            {title}
        </p>
    )
    
}
export default TextDropdownDocument;
