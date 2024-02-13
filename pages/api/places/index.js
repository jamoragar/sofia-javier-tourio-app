import dbConnect from "../../../db/connection.js";
import Places from "../../../db/schemas/palces.schema.js";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method === "GET") {
    try {
      const places = await Places.find();
      return response.status(200).json(places);
    } catch (e) {
      console.error(e);
      return response.status(404).json({ error: e.message });
    }
  }
  if (request.method === "POST") {
    try {
      const placeData = request.body;
      await Places.create(placeData);
      return response.status(200).json({ status: "New Place created!" });
    } catch (e) {
      console.error(e);
      return response.status(404).json({ error: e.message });
    }
  }

  return response.status(405).json({ message: "Method not allowed" });
}
