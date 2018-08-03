"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const MongoClient = require('mongodb').MongoClient;
class Mongo {
    constructor() {
        this.DATABASE_URL = 'mongodb://localhost:27017';
        this.DB_NAME = "MomoRTS";
    }
    // User info Getter
    getDetails(username, callback) {
        this.getUserInfo(username, (result) => {
            callback(result.details);
        }, () => { });
    }
    // Retrieves User Information
    getUserInfo(username, successCallback, failCallback) {
        MongoClient.connect(this.DATABASE_URL, { useNewUrlParser: true }, (err, client) => {
            if (err)
                throw err;
            let db = client.db(this.DB_NAME);
            db.collection("users").findOne({ username: username }, (err, result) => {
                if (result == null) {
                    failCallback();
                }
                else {
                    successCallback(result);
                }
                client.close();
            });
        });
    }
    // Adds Unverified User from Account Creation
    addUnverifiedUser(username, salt, storedPW, email, activationCode) {
        MongoClient.connect(this.DATABASE_URL, { useNewUrlParser: true }, (err, client) => {
            if (err)
                throw err;
            var details = {
                username: username,
                salt: salt,
                storedPW: storedPW,
                email: email,
                creationTime: Date.now(),
                activationCode: activationCode
            };
            let db = client.db(this.DB_NAME);
            this.getUnverifiedUserInfo(username, () => { }, () => {
                db.collection("unverifiedUsers").insertOne(details, function (err, res) {
                    if (err)
                        throw err;
                    console.log("Added user " + username);
                    client.close();
                });
            });
        });
    }
    // Checks Unverified User Info
    getUnverifiedUserInfo(username, successCallback, failCallback) {
        MongoClient.connect(this.DATABASE_URL, { useNewUrlParser: true }, (err, client) => {
            if (err)
                throw err;
            let db = client.db(this.DB_NAME);
            db.collection("unverifiedUsers").findOne({ username: username }, (err, result) => {
                if (result == null) {
                    failCallback();
                }
                else {
                    successCallback(result);
                }
                client.close();
            });
        });
    }
    // Verifies the User with the activationCode
    verifyUser(username, activationCode, callback) {
        this.getUnverifiedUserInfo(username, (data) => {
            if (data.activationCode == activationCode) {
                MongoClient.connect(this.DATABASE_URL, { useNewUrlParser: true }, (err, client) => {
                    if (err)
                        throw err;
                    let db = client.db(this.DB_NAME);
                    db.collection("users").findOne({ username: username }, (err, result) => {
                        if (result == null) {
                            db.collection("users").insertOne({
                                username: data.username,
                                salt: data.salt,
                                storedPW: data.storedPW,
                                email: data.email,
                                creationTime: data.creationTime
                                // Add details later 
                                // details: {
                                // 	isAdmin: false, 
                                // 	isSuperMod: false, 
                                // 	isMod: false, 
                                // 	isMuted: false, 
                                // 	muteTime: 0, 
                                // 	isBanned: false, 
                                // 	banTime: 0, 
                                // 	MMR: 1000}
                            }, (err, res) => {
                                if (err)
                                    throw err;
                                console.log("Registered user: " + username);
                                callback();
                                client.close();
                            });
                        }
                    });
                });
                MongoClient.connect(this.DATABASE_URL, { useNewUrlParser: true }, (err, client) => {
                    if (err)
                        throw err;
                    let db = client.db(this.DB_NAME);
                    db.collection("unverifiedUsers").deleteOne({ username: username }, (err, result) => {
                        client.close();
                    });
                });
            }
        }, () => { });
    }
    // Login related functions
    getSaltForUser(username, successCallback, failCallback) {
        this.getUserInfo(username, (result) => {
            let salt = result.salt;
            successCallback(result.salt);
        }, failCallback);
    }
    hash(input) {
        return crypto.createHash('sha256').update(input).digest('hex');
    }
    randomHex(length) {
        return crypto.randomBytes(length / 2).toString("hex");
    }
    checkLogin(username, token, tokenPW, successCallback, failCallback) {
        this.getUserInfo(username, (result) => {
            let correctValue = this.hash(result.storedPW + token);
            if (tokenPW == correctValue) {
                successCallback();
            }
            else {
                failCallback();
            }
        }, () => {
            failCallback();
        });
    }
}
exports.Mongo = Mongo;
//# sourceMappingURL=mongo.js.map