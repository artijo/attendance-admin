import PropTypes from "prop-types";

export const StudentInfomation = (props) => {

    const []


    return (
        <div>
            <div>
                <h1>Infomation</h1>
                <div className="Info">
                    <p>
                        <span>รหัสนักศึกษา </span>
                        <span>{props.studentInfo.stdId}</span>
                    </p>
                    <p>
                        <span>ชื่อจริง </span>
                        <span>{props.studentInfo.fName}</span>
                    </p>
                    <p>
                        <span>นามสกุล </span>
                        <span>{props.studentInfo.lName}</span>
                    </p>
                    <p>
                        <span>อีเมล </span>
                        <span>{props.studentInfo.email}</span>
                    </p>
                    <p>
                        <span>เบอร์โทรศัพท์ </span>
                        <span>{props.studentInfo.tel}</span>
                    </p>
                    <p>
                        <span>รหัสบัตรประชาชน </span>
                        <span>{props.studentInfo.cityzenId}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};


StudentInfomation.propTypes = {
    studentInfo : PropTypes.object.isRequired
};
