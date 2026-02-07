import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide blog title']
  },
  content: {
    type: String,
    required: [true, 'Please provide blog content']
  },
  destination: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;

