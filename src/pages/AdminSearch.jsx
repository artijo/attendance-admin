import { useState } from "react";
import { SearchBar } from "../components/search/SearchBar.jsx";
import { SearchResultsList } from "../components/search/SearchResultsList.jsx";


const AdminSearch = () => {
    const [result, setResult] = useState([]);
    return (
        <div className="search-bar w-[700px]">
            <div className="search-bar-container">
                <SearchBar setResults = {setResult}/>
                <SearchResultsList result={result}/>
            </div>
        </div>
    )
};

export default AdminSearch;