const router = require("express").Router();
const Turf = require("../models/Turf");

// ✅ Add Turf
router.post("/", async (req, res) => {
  const turf = await Turf.create(req.body);
  res.json(turf);
});

// ✅ Get All Turfs (IMPORTANT)
router.get("/", async (req, res) => {
  try {
    const turfs = await Turf.find();
    res.json(turfs);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching turfs" });
  }
});

// ✅ Get Single Turf
router.get("/:id", async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);

    if (!turf) {
      return res.status(404).json({ message: "Turf not found" });
    }

    res.json(turf);
  } catch (err) {
    res.status(500).json({ message: "Error fetching turf" });
  }
});

module.exports = router;