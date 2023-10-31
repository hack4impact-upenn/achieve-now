import { Lesson } from '../models/lesson.model';

const getLessonById = async (id: string) => {
  const lesson = await Lesson.findById(id).exec();
  return lesson;
};

const getLessonByLevel = async (level: string) => {
  const lesson = await Lesson.findOne({ level }).exec();
  return lesson;
};

export { getLessonById, getLessonByLevel };
