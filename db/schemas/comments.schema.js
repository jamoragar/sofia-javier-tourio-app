import mongoose from "mongoose";

const { Schema, models, model } = mongoose;

const commentsSchema = new Schema({
  name: { type: String, required: true },
  comment: { type: String, required: true },
});

const Comments = models.comments || model("comments", commentsSchema);

export default Comments;
