/**
 * All the functions for interacting with student data in the MongoDB database
 */
import mongoose from 'mongoose';
import { IResource, Resource } from '../models/resource.model';
import { Lesson } from '../models/lesson.model';

/**
 * @returns All the {@link Resource}s in the database without their passwords.
 */
const getAllResourcesFromDB = async () => {
  const userList = await Resource.find({}).exec();
  return userList;
};

const getLessonResources = async (lessonId: string) => {
  const lesson = await Lesson.findById(lessonId)
    .select(['parent_resources', 'coach_resources'])
    .exec();
  if (!lesson) {
    return null;
  }
  const {
    parent_resources: parentResourceIds,
    coach_resources: coachResourceIds,
  } = lesson;
  const parentResources = await Resource.find({
    _id: { $in: parentResourceIds },
  }).exec();
  const coachResources = await Resource.find({
    _id: { $in: coachResourceIds },
  }).exec();
  return parentResources.concat(coachResources);
};

const updateResource = async (resourceId: string, resource: IResource) => {
  console.log(resourceId);
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

const deleteResource = async (resourceId: string) => {
  const deletedResource = await Resource.findByIdAndDelete(resourceId);
  return deletedResource;
};

export {
  getAllResourcesFromDB,
  getLessonResources,
  updateResource,
  createResource,
  deleteResource,
};
