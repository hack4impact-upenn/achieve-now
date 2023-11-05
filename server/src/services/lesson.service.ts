import { Lesson } from '../models/lesson.model';

/**
 * Gets a user from the database by their id but doesn't include the
 * password in the returned user.
 * @param id The id of the user to get.
 * @returns The {@link User} or null if the user was not found.
 */
const getLessonById = async (id: string) => {
  const lesson = await Lesson.findById(id).exec();
  return lesson;
};

const getAllLessonsfromDB = async () => {
  const lessonList = await Lesson.find({}).exec();
  return lessonList;
};

export { getLessonById, getAllLessonsfromDB };
