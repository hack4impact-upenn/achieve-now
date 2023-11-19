import { Lesson } from '../models/lesson.model';
import { Student } from '../models/student.model';

const getLessonLevelsByTeacherId = async (teacher_id: string) => {
  const students = await Student.find({});
  const filteredStudents = students.filter(
    (student) => student.teacher_id && student.teacher_id.includes(teacher_id),
  );
  const levels = Object();
  for (let i = 0; i < filteredStudents.length; i++) {
    const student = filteredStudents[i];
    if (!student.lesson_level) {
      continue;
    }
    const lesson = await Lesson.findOne({ _id: student.lesson_level });
    console.log(lesson);
    if (!lesson) {
      continue;
    }
    if (levels[lesson.number]) {
      levels[lesson.number]++;
    } else {
      levels[lesson.number] = 1;
    }
  }

  console.log(levels);

  return levels;
};

export { getLessonLevelsByTeacherId };
