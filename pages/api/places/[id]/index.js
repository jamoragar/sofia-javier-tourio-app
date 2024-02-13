import dbConnect from "../../../../db/connection";
import Places from "../.././../../db/schemas/palces.schema";
import { db_comments } from "../../../../lib/db_comments";

export default async function handler(request, response) {
  const { id } = request.query;

  if (!id) {
    return;
  }
  // Initializing the connection.
  await dbConnect();

  if (request.method === "GET") {
    const place = Places.find((place) => place._id.$oid === id);
    const comment = place?.comments;
    const allCommentIds = comment?.map((comment) => comment.$oid) || [];
    const comments = db_comments.filter((comment) =>
      allCommentIds.includes(comment._id.$oid)
    );

    if (!place) {
      return response.status(404).json({ status: "Not found" });
    }

    return response.status(200).json({ place: place, comments: comments });
  } else {
    return response.status(405).json({ message: "Method not allowed" });
  }
}
