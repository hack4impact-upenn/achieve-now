import { ILesson, Lesson } from '../models/lesson.model';

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

const getLessonByLevel = async (level: string) => {
  const lesson = await Lesson.findOne({ level }).exec();
  return lesson;
};

const getAllLessonsFromDB = async () => {
  const lessonList = await Lesson.find({}).exec();
  return lessonList;
};

const deleteResource = async (
  lesson: ILesson,
  role: string,
  resourceId: string,
) => {
  try {
    if (role === 'parent') {
      await Lesson.updateOne(
        { _id: lesson._id },
        { $pull: { parent_resources: resourceId } },
      ).exec();
    } else if (role === 'coach') {
      await Lesson.updateOne(
        { _id: lesson._id },
        { $pull: { coach_resources: resourceId } },
      ).exec();
    } else {
      throw new Error('Invalid role specified');
    }

    // Fetch and return the updated lesson object
    const updatedLesson = await Lesson.findById(lesson._id).exec();
    return updatedLesson;
  } catch (error) {
    console.log('Error updating resources in lesson:', error);
    throw error; // Propagate the error
  }
};

const addResource = async (
  lesson: ILesson,
  role: string,
  resourceId: string,
) => {
  try {
    if (role === 'parent') {
      await Lesson.updateOne(
        { _id: lesson._id },
        { $addToSet: { parent_resources: resourceId } },
      ).exec();
    } else if (role === 'coach') {
      await Lesson.updateOne(
        { _id: lesson._id },
        { $addToSet: { coach_resources: resourceId } },
      ).exec();
    } else {
      throw new Error('Invalid role specified');
    }

    // Fetch and return the updated lesson object
    const updatedLesson = await Lesson.findById(lesson._id).exec();
    return updatedLesson;
  } catch (error) {
    console.log('Error updating resources in lesson:', error);
    throw error; // Propagate the error
  }
};

export {
  getLessonById,
  getLessonByLevel,
  getAllLessonsFromDB,
  deleteResource,
  addResource,
};
