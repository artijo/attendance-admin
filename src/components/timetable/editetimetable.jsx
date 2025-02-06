import PropTypes from 'prop-types';

export const Edittimetable = () => {
    return (
        <div className="flex justify-center items-center w-full h-full cursor-pointer">
            <p className="cursor-pointer bg-yellow-200/100 text-yellow-600 px-2 py-[2px] rounded-sm hover:bg-yellow-400 hover:text-yellow-700">แก้ไข</p>
        </div>
    );
}

// Deletetimetable.propTypes = {
//     onDelete: PropTypes.func.isRequired
// };