function Button({ isSubmitting }) {
    // isSubmitting คือ State ที่ใช้บอกว่าข้อมูลกำลังส่งแล้วจะทำให้ปุ่มคลิกไม่ได้
    /*
        ถ้า True = กำลังส่ง
        ถ้า Flase = ยังไม่ส่งหรือยังไม่มีอะไรเกิดขึ้น
    */ 
    return (
        <button
            type="submit"
            disabled={isSubmitting} 
            className="inline-flex justify-center items-center px-6 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
            {isSubmitting ? (
                <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    กำลังบันทึก...
                </>
            ) : (
                <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    เพิ่มเทอม
                </>
            )}
        </button>
    );
};

export default Button;