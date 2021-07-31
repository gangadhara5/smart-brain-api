import Clarifai from "clarifai";

//You must add your own API key here from Clarifai.
const app = new Clarifai.App({
  apiKey: "73363d8568e54abcb44eec035973f1a6",
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json("unable to work with API"));
};

const updateEntries = (req, res, db) => {
  db("user")
    .where("id", "=", req.body.id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0]);
    })
    .catch((err) => res.status(400).json("unable to update entries"));
};

export { handleApiCall, updateEntries };
