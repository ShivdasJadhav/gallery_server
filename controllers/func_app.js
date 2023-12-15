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

// Return all art of a specific status
// url -> /app/getByStatus/:status
const getAllByStatus = async (req, res, next) => {
  let type = req.params.type;
  let item;
  try {
    item = await find({ status: type });
  } catch (err) {
    console.log(err);
  }
  if (!item) {
    return res.status(401).json({ msg: "Failed to Load" });
  } else {
    return res.status(200).json({ item });
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

const getById = async (req, res, next) => {
  let id = req.params.id;
  let item;
  try {
    item = await findOne({ _id: id });
  } catch (err) {
    console.log(err);
  }
  if (!item) {
    return res.status(401).json({ msg: "Failed to Load" });
  } else {
    return res.status(200).json({ item });
  }
};

const getByStatus = async (req, res, next) => {
  let email = req.params.email;
  let type = req.params.type;
  let item;
  try {
    item = await find({ user: email, status: type });
  } catch (err) {
    console.log(err);
  }
  if (!item) {
    return res.status(401).json({ msg: "Failed to Load" });
  } else {
    return res.status(200).json({ item });
  }
};

const updateItem = async (req, res, next) => {
  let id = req.params.id;
  const { title, author, url_pic, description, status } = req.body;
  let item;
  try {
    item = await findByIdAndUpdate(id, {
      title,
      author,
      url_pic,
      description,
      status,
    });
  } catch (err) {
    console.log(err);
  }
  if (!item) {
    return res.status(401).json({ meassage: "Failed to Update" });
  } else {
    return res.status(200).json({ msg: "Gallary Updated!" });
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
const deleteById = async (req, res, next) => {
  let id = req.params.id;
  let item;
  try {
    item = await findByIdAndRemove(id);
  } catch (err) {
    console.log(err);
  }
  if (!item) {
    return res.status(400).json({ msg: "Failed to Delete" });
  } else {
    return res
      .status(200)
      .json({ msg: "Item Deleted successfully!", item: item });
  }
};

exports.func_app = {
  getAllArts,
  addArt,
  getCount,
  getById,
  getByStatus,
  updateItem,
  acceptById,
  rejectById,
  deleteById,
};
