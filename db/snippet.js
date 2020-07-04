import mongoose, { Schema } from './index.js';

const snippetSchema = new Schema({
  code: String,
});

export const Snippet = mongoose.model('Snippet', snippetSchema);
