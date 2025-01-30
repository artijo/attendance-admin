import { Termlistable } from "../../components/term/termlistable";
import { Link } from "react-router-dom";
function MainTermPage() {
    return (
        <div className="container mx-auto">
            <h1 className="mb-4">รายการเทอมและปีการศึกษา</h1>
            <div>
                <Link type="button" to="/terms/create" className="block w-fit ml-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                    สร้างปีการศึกษาและเทอม
                </Link>
                <Termlistable/>
            </div>
        </div>
    );
};

export default MainTermPage;