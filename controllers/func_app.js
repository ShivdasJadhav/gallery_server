const Art = require("../modal/art_schema");
const User = require("../modal/user_schema");

// Returns all Arts
// url -> /app/
const getAllArts = async (req, res, next) => {
  let Art;
  try {
    Art = await find({ status: "published" });
  } catch (err) {
    console.log(err);
  }
  if (!Art) {
    return res.status(400).json({ msg: "No Art Found" });
  } else {
    return res.status(200).json({ Art });
  }
};

// Save a Art piece
// url -> /app/newArt
const addArt = async (req, res, next) => {
  const { title, description, img, status } = req.body;
  let art = null;
  try {
    art = await Art.create({
      title,
      description,
      img,
      user_id: req.user.id,
      status: "review",
      likes: null,
      views: null,
    });
    art && res.status(201).json({ msg: "Saved To Gallery!" });
  } catch (err) {
    return res.status(500).json({ msg: "Failed to Save Art", err });
  }
};

// Returns object of status count for profile
// url-> /app/getCount
const getCount = async (req, res, next) => {
  try {
    let published = await Art.count({
      user_id: req.user.id,
      status: "published",
    });
    let review = await Art.count({
      user_id: req.user.id,
      status: "review",
    });
    let rejected = await Art.count({
      user_id: req.user.id,
      status: "rejected",
    });
    return res.status(200).json({ published, review, rejected });
  } catch (err) {
    return res.status(500).json({ msg: "Failed to return counts!" });
  }
};

// Returns a Art piece with specified Id
// url -> /app/getById/:id
const getArtById = async (req, res, next) => {
  let id = req.params.id;
  let art;
  try {
    art = await Art.findOne({ _id: id });
    art && res.status(200).json({ ...art._doc });
  } catch (err) {
    return res.status(500).json({ msg: "Failed to Load" });
  }
};

// Return all art of a specific status
// url -> /app/getByStatus/:status
const getByStatus = async (req, res, next) => {
  let status = req.params.type;
  let art;
  try {
    art = await Art.find({ user_id: req.user.id, status: status });
    art && res.status(200).json({ ...art });
  } catch (err) {
    return res.status(200).json({ msg: "failed to fetch by status!" });
  }
};

// Update an Art piece via id
// url -> /app/updateArt/:id
const updateArt = async (req, res, next) => {
  const { title, description, img, _id } = req.body;
  console.log({ title, description, img, _id });
  let art = null;
  try {
    art = await Art.findByIdAndUpdate(_id, {
      title,
      description,
      img,
      status: "review",
    });
    art && res.status(200).json({ msg: "updated!" });
  } catch (err) {
    return res.status(500).json({ msg: "Failed to Update" });
  }
};
const acceptById = async (req, res, next) => {
  let id = req.params.id;
  let item;
  try {
    item = await findByIdAndUpdate(id, {
      status: "accepted",
    });
  } catch (err) {
    console.log(err);
  }
  if (!item) {
    return res.status(401).json({ meassage: "Failed to Update" });
  } else {
    return res.status(200).json({ msg: "Marked as Accepted!" });
  }
};
const rejectById = async (req, res, next) => {
  let id = req.params.id;
  let item;
  try {
    item = await findByIdAndUpdate(id, {
      status: "rejected",
    });
  } catch (err) {
    console.log(err);
  }
  if (!item) {
    return res.status(401).json({ meassage: "Failed to Update" });
  } else {
    return res.status(200).json({ msg: "Marked as Rejected!" });
  }
};

// Delete an Art piece by Id
// url -> /app/deleteArt/:id
const deleteById = async (req, res, next) => {
  let id = req.params.id;
  let art;
  try {
    art = await Art.findByIdAndRemove(id);
    art
      ? res.status(200).json({ msg: "art deleted" })
      : res.status(500).json({ msg: "failed to delete art" });
  } catch (err) {
    return res.status(500).json({ msg: "failed to delete art" });
  }
};

// update a Art for Like
// url -> /app/likeArt/:id
const likeArt = async (req, res, next) => {
  let art_id = req.params.id;
  let art = null;
  console.log(art_id);
  try {
    art = await Art.findByIdAndUpdate(
      { _id: art_id },
      {
        $push: { likes: req.user.id },
      }
    );
    if (art) {
      return res.status(200).json({ msg: "liked" });
    }
  } catch (err) {
    return res.status(500).json({ msg: "Failed to Save Art", err });
  }
};
// update a Art for dislike
// url -> /app/dislikeArt/:id
const disLikeArt = async (req, res, next) => {
  let art_id = req.params.id;
  let art = null;
  try {
    art = await Art.findByIdAndUpdate(
      { _id: art_id },
      {
        $pull: { likes: req.user.id },
      }
    );
    art && res.status(200).json({ msg: "disliked" });
  } catch (err) {
    return res.status(500).json({ msg: "Failed to Save Art", err });
  }
};

exports.func_app = {
  getAllArts,
  addArt,
  getCount,
  getArtById,
  getByStatus,
  updateArt,
  acceptById,
  rejectById,
  deleteById,
  likeArt,
  disLikeArt,
};
