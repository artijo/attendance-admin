import PropTypes from 'prop-types';

export const Deletetimetable = ({ onDelete }) => {
    return (
        <div className="flex justify-center items-center w-full h-full cursor-pointer" onClick={onDelete}>
            <p className="rounded-sm shadow-lg bg-red-500 hover:bg-red-600 text-white font-medium text-sm w-fit h-fit py-1 px-2">ลบ</p>
        </div>
    );
}

Deletetimetable.propTypes = {
    onDelete: PropTypes.func.isRequired
};