import PropTypes from 'prop-types';

export const Deletetimetable = ({ onDelete }) => {
    return (
        <div className="absolute flex justify-center items-center w-full h-full cursor-pointer" onClick={onDelete}>
            <p className="rounded-lg shadow-lg bg-red-500 hover:bg-red-600 text-white font-medium w-fit h-fit py-2 px-4">ลบ</p>
        </div>
    );
}

Deletetimetable.propTypes = {
    onDelete: PropTypes.func.isRequired
};