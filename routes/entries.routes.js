const router = require("express").Router()
const isSignedIn = require("../middleware/is-signed-in.js")
const Entry = require("../models/Entry.js")

router.get("/new", isSignedIn, (req, res) => {
    res.render("new-entry")
})

router.post("/", isSignedIn, async (req, res) => {
    try {
        const newEntry = await Entry.create({
            title: req.body.title,
            entryBody: req.body.entryBody,
            isPublic: req.body.isPublic,
            owner: req.user._id
        })
        res.redirect("/entries")
    } catch (error) {
        console.error(error)
    }
})

router.get("/", async (req, res) => {
    try {
        const entries = await Entry.findById({ owner: req.user._id })
        res.render("entries", { entries })
    } catch (error) {
        console.error(error)
    }
})

router.get("/my-entries", isSignedIn, async (req, res) => {
    try {
        const entries = await Entry.findById({ owner: req.user._id })
        res.render("entries", { entries })
    } catch (error) {
        console.error(error)
    }
})


module.exports = router