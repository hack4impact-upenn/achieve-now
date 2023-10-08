import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    auto: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});

interface IResource extends mongoose.Document {
  _id: string;
  title: string;
  type: string;
  link: string;
}

const Resource = mongoose.model<IResource>('Resource', ResourceSchema);

export { IResource, Resource };
