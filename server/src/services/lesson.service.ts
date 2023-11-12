import { Lesson } from '../models/lesson.model';

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

const deleteResource = async (id: string, role: string, resourceId: string) => {
  if (role === 'parent') {
    const lesson = await Lesson.findOneAndUpdate(
      { id },
      { $pull: { parent_resources: resourceId } },
    ).exec();
    return lesson;
  }
  if (role === 'coach') {
    const lesson = await Lesson.findOneAndUpdate(
      { id },
      { $pull: { coach_resources: resourceId } },
    ).exec();
    return lesson;
  }
  return null;
};

const addResource = async (id: string, role: string, resourceId: string) => {
  if (role === 'parent') {
    const lesson = await Lesson.findOneAndUpdate(
      { id },
      { $push: { parent_resources: resourceId } },
    ).exec();
    return lesson;
  }
  if (role === 'coach') {
    const lesson = await Lesson.findOneAndUpdate(
      { id },
      { $push: { coach_resources: resourceId } },
    ).exec();
    return lesson;
  }
  return null;
};

export {
  getLessonById,
  getLessonByLevel,
  getAllLessonsFromDB,
  deleteResource,
  addResource,
};
