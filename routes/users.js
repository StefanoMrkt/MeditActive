const express = require("express");
const router = express.Router();

var User = require("../models/users");

router.post("/", (req, res) => {
  const NewUser = new User(req.body);
  NewUser.save()
    .then(() => res.status(200).json({ message: "User inserted" }))
    .catch((err) => res.status(501).json({ error: err }));
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const EditUser = req.body;
  User.findById(id, (err, user) => {
    if (err) return res.status(404).json({ error: err });
    user.updateOne(EditUser, (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(200).json({ message: "User updated" });
    });
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  User.findById(id, (err, user) => {
    if (err) return res.status(404).json({ error: err });
    user.deleteOne((err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(200).json({ message: "User deleted" });
    });
  });
});

module.exports = router;
