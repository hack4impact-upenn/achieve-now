import { Coach } from "../models/coach.model";

/**
 * @returns All the {@link Student}s in the database without their passwords.
 */
const getAllCoachesFromDB = async () => {
    const userList = await Coach.find({})
        .exec();
    return userList;
};

/**
 * createCoach creates a student in the database
 * @returns the newly created coach
 */
const createCoachInDB = async (
    userId: string,
    partnerSite: string,
    mailingAddress: string,
    mediaWaiver: boolean,
) => {
    const newCoach = new Coach({
        user_id: userId,
        partner_site: partnerSite,
        mailing_address: mailingAddress,
        media_waiver: mediaWaiver,
    });
    const coach = await newCoach.save();
    return coach;
};

/**
 * A function that updates a student's attendance
 * @param id: The id of the student to update
 * @param date: The timestamp of the date to update attendance for
 * @param attendance: The new attendance of the student
 * @returns The updated {@link Student}
 */
const updateAttendance = async (
    id: string,
    date: number,
    attendance: string,
) => {
    const student = await Coach.findOneAndUpdate(
        {
            _id: id,
        },
        {
            $set: { [`progress_stats.attendance.${date}`]: attendance },
        },
    ).exec();
    return student;
};

/**
 * A function that creates attendance for all students on a given date
 * @param date: The timestamp of the date to create attendance for
 */
const createAttendanceOnDate = async (date: number) => {
    await Coach.updateMany(
        {},
        {
            $set: {
                [`progress_stats.attendance.${date}`]: '',
            },
        },
    );
};

/**
 * A function that deletes attendance for all students on a given date
 * @param date: The timestamp of the date to delete attendance for
 */
const deleteAttendanceOnDate = async (date: number) => {
    await Coach.updateMany(
        {},
        {
            $unset: {
                [`progress_stats.attendance.${date}`]: 1,
            },
        },
    );
};

export {
    getAllCoachesFromDB,
    createCoachInDB,
    updateAttendance,
    createAttendanceOnDate,
    deleteAttendanceOnDate,
};