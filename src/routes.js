"use strict";

const express = require("express");
const router = express.Router();
const utils = require("../config/utilities");
const Artist = require("./schema/Artist");
const Track = require("./schema/Track");
const {
    deleteArtists, deleteTracks, insertArtists, insertTracks
} = utils;


router.route("/")
    .get((_req, res) => {
        console.log("GET /");
        res.status(200).send({
            data: "App is running."
        });
    });

///////////////////////////////
// Your code below this line //
///////////////////////////////

router.route("/artists")
    .get((_req, res) => {
        // implemented for you:
        console.log("GET /artists");
        Artist.find({})
            .then(artists => {
                res.status(200).send(artists);
            })
    })
    .post((req, res) => {
        console.log("POST /artists");

        // if they post bad data
        if (!(req.body.name && req.body.genres)) {
            res.status(404).send({
                message: `Must put name and genres.`
            });
            return
        }

        // create JSON of new artist
        var newArtist = {
            "name": req.body.name,
            "genres": req.body.genres
        }
        if (req.body.spotify_id) {
            newArtist["spotify_id"] = req.body.spotify_id
        }
        if (req.body.image_url) {
            newArtist["image_url"] = req.body.image_url
        }

        Artist.create(newArtist).save()
            .then(function () {
                res.status(201).send(newArtist);
            }).catch(function (error) {
                res.status(404).send({
                    message: `Invalid POST.`
                });
            });
    });

router.route("/artists/:id")
    .get((req, res) => {
        console.log(`GET /artists/${req.params.id}`);
        Artist.findById(req.params.id)
            .then(artist => {
                res.status(200).send(artist);
                return
            })
            .catch(function () {
                res.status(404).send({
                    message: `Invalid artist ID.`
                });
            });
    })

    .patch((req, res) => {
        console.log(`PATCH /artists/${req.params.id}`);
        Artist.findByIdAndUpdate(req.params.id, req.body)
            .then(function () {
                res.status(200).send(null);
                return
            }).catch(function () {
                res.status(404).send({
                    message: `Artist not found / invalid post operation.`
                });
            });
    })

    .delete((req, res) => {
        console.log(`DELETE /artists/${req.params.id}`);
        Artist.findByIdAndDelete(req.params.id)
            .then(function () {
                res.status(200).send(null);
                return
            }).catch(function () {
                res.status(404).send({
                    message: `Artist not found.`
                });
            });
    });

router.route("/artists/:id/tracks")
    .get((req, res) => {
        console.log(`GET /artists/${req.params.id}/tracks`);
        res.status(501).send();
    })

router.route("/tracks")
    .get((_req, res) => {
        console.log("GET /tracks");
        // implemented for you:
        Track.find({})
            .then(tracks => {
                res.status(200).send(tracks);
            })
    })
    .post((req, res) => {
        console.log("POST /doctors");
        res.status(501).send();
    });

router.route("/tracks/:id")
    .get((req, res) => {
        console.log(`GET /tracks/${req.params.id}`);
        res.status(501).send();
    })
    .patch((req, res) => {
        console.log(`PATCH /tracks/${req.params.id}`);
        res.status(501).send();
    })
    .delete((req, res) => {
        console.log(`DELETE /tracks/${req.params.id}`);
        res.status(501).send();
    });

router.route("/search")
    .get((req, res) => {
        console.log(`GET /search`);
        console.log(req.query);

        // validation code:
        if (!req.query.term) {
            res.status(400).send({
                message: `"term" query parameter is required. Valid search string: /search?term=beyonce&type=track`
            });
            return; // don't forget the return to exit early!
        }
        if (!req.query.type || !['artist', 'track'].includes(req.query.type)) {
            res.status(400).send({
                message: `"type" query parameter is required and must either be "artist" or "track". Valid search string: /search?term=beyonce&type=track`
            });
            return; // don't forget the return to exit early!
        }

        /**
         * your code below this comment:
         * if req.query.type === 'artist', query the Artist collection
         * for any artist that matches the search term
         * 
         * if req.query.type === 'track', query the Track collection
         * for any artist that matches the search term 
         * 
         * Use regular expressions (see Lecture 5 for details)
         */
        const term = req.query.term
        const type = req.query.type

        if (type.toLowerCase() === "artist") {
            Artist.find({ 'name': { '$regex': term, "$options": "i" }})
                .then(artists => {
                    res.status(200).send(artists);
                })
        }
        else{
            Track.find({ 'name': { '$regex': term, "$options": "i" }})
            .then(tracks => {
                res.status(200).send(tracks);
            })
        }
    })











///////////////////////////////
// Your code above this line //
///////////////////////////////
router.route("/reset")
    .get((_req, res) => {
        deleteArtists()
            .then(results => {
                console.log('All artists have been deleted from the database.');
            })
            .then(deleteTracks)
            .then(results => {
                console.log('All tracks have been deleted from the database.');
            })
            .then(insertArtists)
            .then(results => {
                console.log(results.length + ' artists have been inserted into the database.');
            })
            .then(insertTracks)
            .then(results => {
                console.log(results.length + ' tracks have been inserted into the database.');
                res.status(200).send({
                    message: "Data has been reset."
                });
            });
    });
module.exports = router;