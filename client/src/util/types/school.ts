interface ISchool {
  _id: string;
  name: string;
  teachers: string[];
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

export default ISchool;
