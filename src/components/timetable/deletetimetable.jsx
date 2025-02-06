import PropTypes from 'prop-types';

export const Deletetimetable = ({ onDelete }) => {
    return (
        <div className="flex justify-center items-center w-full h-full cursor-pointer" onClick={onDelete}>
            <p className="cursor-pointer bg-red-200 text-red-600 px-2 py-[2px] rounded-sm hover:bg-red-400 hover:text-red-700">ลบ</p>
        </div>
    );
}

Deletetimetable.propTypes = {
    onDelete: PropTypes.func.isRequired
};