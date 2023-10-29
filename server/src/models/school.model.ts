import mongoose from 'mongoose';

const SchoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  teachers: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    required: true,
  },
  info: {
    type: String,
    required: true,
  },
  admin_name: {
    type: String,
    required: false,
  },
  admin_content: {
    type: String,
    required: false,
  },
  calendar_link: {
    type: String,
    required: false,
  },
  school_start_time: {
    type: Date,
    required: false,
  },
  school_end_time: {
    type: Date,
    required: false,
  },
  first_grade_lunch_start_time: {
    type: Date,
    required: false,
  },
  first_grade_lunch_end_time: {
    type: Date,
    required: false,
  },
  second_grade_lunch_start_time: {
    type: Date,
    required: false,
  },
  second_grade_lunch_end_time: {
    type: Date,
    required: false,
  },
});

interface ISchool extends mongoose.Document {
  _id: string;
  name: string;
  teachers: [string];
  info: string;
  admin_name: string;
  admin_content: string;
  calendar_link: string;
  school_start_time: Date;
  school_end_time: Date;
  first_grade_lunch_start_time: Date;
  first_grade_lunch_end_time: Date;
  second_grade_lunch_start_time: Date;
  second_grade_lunch_end_time: Date;
}

const School = mongoose.model<ISchool>('School', SchoolSchema);

export { ISchool, School };
