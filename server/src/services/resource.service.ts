/**
 * All the functions for interacting with student data in the MongoDB database
 */
import mongoose from 'mongoose';
import { Lesson } from '../models/lesson.model';
import { IResource, Resource } from '../models/resource.model';

/**
 * @returns All the {@link Resource}s in the database without their passwords.
 */
const getAllResourcesFromDB = async () => {
  const userList = await Resource.find({}).exec();
  return userList;
};

const getLessonById = async (lessonId: string) => {
  const lesson = await Lesson.findById(lessonId).exec();
  return lesson;
};

const updateResource = async (resourceId: string, resource: IResource) => {
  const updatedResource = await Resource.findByIdAndUpdate(
    resourceId,
    resource,
    { new: true },
  ).exec();
  return updatedResource;
};

const createResource = async (resource: IResource) => {
  const newResource = await Resource.create({
    ...resource,
    _id: new mongoose.Types.ObjectId(),
  });
  return newResource;
};

export { getAllResourcesFromDB, getLessonById, updateResource, createResource };
