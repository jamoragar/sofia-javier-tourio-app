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
  if (request.method === "DELETE") {
    const places = await Places.findByIdAndDelete(id);
    response.status(260).json("Place deleted");

    return response.status(200).json(places);
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
