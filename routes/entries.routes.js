const router = require("express").Router()
const isSignedIn = require("../middleware/is-signed-in.js")
const Entry = require("../models/Entry.js")

router.get("/new", isSignedIn, (req, res) => {
    res.render("new-entry.ejs")
})

router.post("/", isSignedIn, async (req, res) => {
    try {
        const newEntry = await Entry.create({
            title: req.body.title,
            entryBody: req.body.entryBody,
            isPublic: Boolean(req.body.isPublic),
            owner: req.session.user._id
        })
        res.redirect("/entries")
    } catch (error) {
        console.error(error)
        res.redirect("/entries/new")
    }
})

router.get("/", async (req, res) => {
    try {
        const entries = await Entry.find({ isPublic: true })
        res.render("all-entries.ejs", { entries })
    } catch (error) {
        console.error(error)
        res.redirect("/")
    }
})

router.get("/my-entries", isSignedIn, async (req, res) => {
    try {
        const entries = await Entry.find({ owner: req.session.user._id })
        res.render("my-entries.ejs", { entries })
    } catch (error) {
        console.error(error)
        res.redirect("/")
    }
})

router.get("/:id/edit", isSignedIn, async (req, res) => {
    try {
        const entry = await Entry.findById(req.params.id)
        if (!entry || entry.owner.toString() !== req.session.user._id.toString()) {
            return res.redirect("/entries")
        }
        res.render("edit-entry.ejs", { entry })
    } catch (error) {
        console.error(error)
        res.redirect("/entries")
    }
})

router.put("/:id", isSignedIn, async (req, res) => {
    try {
        const updatedEntry = await Entry.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                entryBody: req.body.entryBody,
                isPublic: Boolean(req.body.isPublic)    
            },
            { new: true }
        )
        res.redirect("/entries")
    } catch (error) {
        console.error(error)
        res.redirect("/entries")
    }
})

router.delete("/:id", isSignedIn, async (req, res) => {
    try {
        const deletedEntry = await Entry.findByIdAndDelete(req.params.id)
        res.redirect("/entries")
    } catch (error) {
        console.error(error)
        res.redirect("/entries")
    }
})


module.exports = router