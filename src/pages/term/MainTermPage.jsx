import { Termlistable } from "../../components/term/termlistable";
import { Link } from "react-router-dom";
function MainTermPage() {
    return (
        <div className="container mx-auto">
            <h1 className="mb-4">รายการเทอมและปีการศึกษา</h1>
            <div>
                <Link type="button" to="/terms/create"  className="flex ml-auto justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-fit">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>สร้างปีการศึกษาและเทอม</span>
                </Link>
                <Termlistable/>
            </div>
        </div>
    );
};

export default MainTermPage;