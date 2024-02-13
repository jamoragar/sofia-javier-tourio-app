import dbConnect from "../../../db/connection.js";
import Places from "../../../db/schemas/palces.schema.js";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method === "GET") {
    try {
      const places = await Places.find();
      return response.status(200).json(places);
    } catch (error) {
      throw new Error(error);
    }
  } else {
    return response.status(405).json({ message: "Method not allowed" });
  }
}
