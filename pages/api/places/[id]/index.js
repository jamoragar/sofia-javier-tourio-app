import dbConnect from "../../../../db/connection";
import Places from "../../../../db/schemas/palces.schema";
import Comments from "../../../../db/schemas/comments.schema";
import { db_comments } from "../../../../lib/db_comments";

export default async function handler(request, response) {
  const { id } = request.query;

  if (!id) {
    return;
  }
  // Initializing the connection.
  await dbConnect();

  if (request.method === "GET") {
    const place = await Places.findById(id);
    const commentIds = place?.comments;

    if (!place) {
      return response.status(404).json({ status: "Not found" });
    }

    if (commentIds && commentIds.length > 0) {
      const comments = (
        await Promise.all(
          commentIds.map(async (commentId) => {
            const fullComment = await Comments.findById(commentId);
            return fullComment;
          })
        )
      ).filter(Boolean);

      return response.status(200).json({ place: place, comments: comments });
    } else {
      return response.status(200).json({ place: place, comments: [] });
    }
  }

  if (request.method === "PUT") {
    await Places.findByIdAndUpdate(id, {
      $set: request.body,
    });

    return response.status(200).json({ status: "place sucsessfully updated" });
  }
  // DELETE PLACE
  if (request.method === "DELETE") {
    try {
      // First Delete the comments of the Place
      await Places.findById(id)
        .select("comments")
        .then(async (document) => {
          const comments = document.comments;
          if (comments.length > 0) {
            comments.forEach(async (id) => {
              await Comments.findByIdAndDelete(id);
            });
          }
        });
      // Then Delete the Place
      const places = await Places.findByIdAndDelete(id);
      if (!places) {
        return response.status(404).json({ message: "Document not found" });
      }

      return response
        .status(200)
        .json({ message: "Place deleted", data: places });
    } catch (error) {
      return response.status(405).json({ message: error.message });
    }
  }

  if (request.method === "POST") {
    try {
      const newComment = request.body;
      const requestCommentCreate = await Comments.create(newComment);

      await Places.updateOne(
        { _id: id },
        { $push: { comments: requestCommentCreate._id } }
      );

      return response.status(200).json({
        message: "New comment added!",
      });
    } catch (error) {
      console.error(error);
    }
  } else {
    return response.status(405).json({ message: "Method not allowed" });
  }
}
