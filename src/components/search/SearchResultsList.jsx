import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link} from "react-router-dom";


export const SearchResultsList = (props) => {



     //if result.lenght != 0 px-2 py-2
    const [border, setBorder] = useState("");
    const [borderColor , setBorderColor] = useState("");
    
    useEffect(() => {
        if(!props.result.length <= 0){
            setBorder("border");
            setBorderColor("border-gray-500");
        }else{
            setBorder("");
            setBorderColor("border-white");
        }
    },[props.result.length]);
    
    return (
        <div className={`results-list mt-2 rounded-md w-full ${border} border-2 ${borderColor}` }>
            {   
                props.result.map((result, id) => {
                    return (
                        <div key={id}>
                            <Link to={'/studentInfomation'} state={result.id}>
                                <div className="px-2 py-2 flex justify-between">
                                    <p className="text-sm font-medium">{result.name}</p>
                                    <p className="text-sm font-medium text-gray-400">{result.role}</p>
                                </div>
                            </Link>
                        
                        </div>
                        
                        
                    )
                }) 
            }
        </div>
    );
};

SearchResultsList.propTypes = {
    result : PropTypes.element.isRequired
}