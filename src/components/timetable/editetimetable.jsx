import PropTypes from 'prop-types';

export const Edittimetable = () => {
    return (
        <div className="flex justify-center items-center w-full h-full cursor-pointer ">
            <p className="bg-yellow-400 hover:bg-yellow-700 text-white font-medium text-sm py-1 px-2 rounded">แก้ไข</p>
        </div>
    );
}

// Deletetimetable.propTypes = {
//     onDelete: PropTypes.func.isRequired
// };