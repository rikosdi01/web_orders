import { Search as SearchIcon } from "lucide-react";
import "./Search.css";

const Search = ({
    placeholder,
    customWidth = "200px",
}) => {
    return (
        <div className="search-container" style={{ width: customWidth }} >
            <SearchIcon className="search-icon" size={20} />
            <input type="text" placeholder={placeholder} className="search-input" />
        </div>
    );
};

export default Search;