const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const sanitize = require("express-mongo-sanitize");

var User = require("../models/users");

router.post("/:id/goals", (req, res) => {
  const { id } = req.params;
  const goals = req.body;
  User.findById(id)
    .then((user) => {
      if (user) {
        if (!user.goals) {
          user.goals = goals;
        } else {
          user.goals.push(goals);
        }
        return user.save();
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .then((updatedUser) => {
      res.status(200).json({ user: updatedUser });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

//Insert other types goal at the same goal
router.post("/:id/goals/:idgoal/edittypes", async (req, res) => {
  try {
    const { id } = req.params;
    const { idgoal } = req.params;
    const goalInsert = req.body;

    const user = await User.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
        "goals._id": new mongoose.Types.ObjectId(idgoal),
      },
      {
        $addToSet: {
          "goals.$.types": goalInsert,
        },
      },
      { new: true }
    );

    res.status(200).json({ message: "Goals added" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.delete("/:id/goals/:idgoal", async (req, res) => {
  const { id } = req.params;
  const { idgoal } = req.params;

  try {
    const user = await User.findById(id);
    if (user) {
      if (user) {
        const goalToDelete = user.goals.find(
          (goal) => goal._id.toString() === idgoal
        );
        console.log(goalToDelete);
        if (goalToDelete) {
          user.goals.pull(goalToDelete);
          await user.save();
          res.status(200).json({ message: "Deleted" });
        } else {
          res.status(404).json({ message: "Goals not inserted" });
        }
      }
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.put("/:id/goals/:idgoal/editdate", async (req, res) => {
  try {
    const { id } = req.params;
    const { idgoal } = req.params;
    const newDate = req.body;

    const user = await User.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
        "goals._id": new mongoose.Types.ObjectId(idgoal),
      },
      {
        $set: {
          "goals.$.start": newDate.start,
          "goals.$.end": newDate.end,
        },
      },
      { new: true }
    );

    res.status(200).json({ message: "Date modified" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

//View all intervals
router.get("/:id/goals/view", (req, res) => {
  const { id } = req.params;

  User.find({ _id: id }, { goals: 1 })
    .then((results) => {
      res.status(200).json({ data: results });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
      return;
    });
});

//Filter to intervals from start to end
router.get("/:id/goals/fltdate", (req, res) => {
  const { id } = req.params;
  const { start, end } = req.query;

  User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    {
      $project: {
        goals: {
          $filter: {
            input: "$goals",
            as: "goal",
            cond: {
              $and: [
                { $eq: ["$$goal.start", start] },
                { $eq: ["$$goal.end", end] },
              ],
            },
          },
        },
      },
    },
  ])
    .then((results) => {
      res.status(200).json({ data: results });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
      return;
    });
});

//Filter goals
router.get("/:id/goals/fltgoals", (req, res) => {
  const { id } = req.params;
  const { gls } = req.query;

  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const filteredGoals = user.goals.filter((goal) =>
        goal.types.includes(gls)
      );

      if (filteredGoals.length > 0) {
        res.status(200).json({ data: filteredGoals });
      } else {
        res.status(200).json({ error: "Query not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;
