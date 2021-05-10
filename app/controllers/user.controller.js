const config = require("../config/auth.config");
const db = require("../models");
const Userdetail = db.userdetail;

const { body,validationResult } = require('express-validator/check');

exports.validate = (method) => {
    switch (method) {
        case 'createUser': {
            return [ 
                body('firstname', 'Firstname is required').notEmpty(),
                body('lastname', 'lastname is required').notEmpty()                
            ]   
        }

        case 'updateUser': {
            return [ 
                body('firstname', 'Firstname is required').notEmpty(),
                body('lastname', 'lastname is required').notEmpty()                
            ]   
        }
    }
}

exports.userdetails = (req, res, next) => {
    try {
        Userdetail.find({}, function(err, userdetails) {
            if(err) {
                res.json({
                    error: err
                })
            }
            res.json({
                userdetails: userdetails
            })
        })
    } catch(err) {
        return next(err);
    }
}

exports.userdetail = (req, res, next) => {
    try {
        Userdetail.findOne({_id: req.params.id}, function(err, userdet) {
            if(err) {
                res.json({
                    error: err
                })
            }
            res.json({
                userdetail: userdet
            })
        })
    } catch(err) {
        return next(err);
    }
}

exports.create = (req, res, next) => {
    try {

        const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }

        const userdetail = new Userdetail({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            createdby : req.userId
        });     

        userdetail.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
        
            res.send({ message: "Userdetails are registered successfully!" });
        });
        
    } catch(err) {
        return next(err);
    }
}


exports.update = (req, res, next) => {
    try {

        const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }

        var userdet = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            createdby : req.userId
        }; 

        Userdetail.updateOne({_id: req.params.id}, userdet, function(err, userdata) {
            if(err) {
                res.json({
                    error: err
                })
            }
            res.json({
                message : "User Detail updated successfully",
                userdetail: userdet
            })
        });
        
    } catch(err) {
        return next(err);
    }
}


exports.deleteuserdetail = (req, res, next) => {
    try {
        Userdetail.deleteOne({_id: req.params.id}, function(err, userdet) {
            if(err) {
                res.json({
                    error: err
                })
            }
            res.json({
                message : "User Detail deleted successfully"
            })
        })
    } catch(err) {
        return next(err);
    }
}