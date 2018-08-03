import crypto = require('crypto');

const MongoClient = require('mongodb').MongoClient;

export class Mongo {
	private readonly DATABASE_URL: string = 'mongodb://localhost:27017';
	private readonly DB_NAME: string = "MomoRTS";

// User info Getter
	public getDetails(username: string, callback: Function) {
		this.getUserInfo(username, (result: any) => {
			callback(result.details);
		}, () => {});
	}

// Retrieves User Information
	public getUserInfo(username: string, successCallback: Function, failCallback: Function): void {
		MongoClient.connect(this.DATABASE_URL, {useNewUrlParser: true}, (err: any, client: any) => {
			if (err) throw err;
			let db = client.db(this.DB_NAME);
			db.collection("users").findOne({username: username}, (err: any, result: any) => {
				if (result == null) {
					failCallback();
				} else {
					successCallback(result);
				}
				client.close();
			});
		});
	}

// Adds Unverified User from Account Creation
	public addUnverifiedUser(username: string, salt: any, storedPW: any, email: string, activationCode: any) {
		MongoClient.connect(this.DATABASE_URL, {useNewUrlParser: true}, (err: any, client: any) => {
			if (err) throw err;

			var details = {
				username: username, 
				salt: salt, 
				storedPW: storedPW, 
				email: email, 
				creationTime: Date.now(), 
				activationCode: activationCode
			};

			let db = client.db(this.DB_NAME);

			this.getUnverifiedUserInfo(username, () => {}, () => {
				db.collection("unverifiedUsers").insertOne(details, function(err: any, res: any) {
					if (err) throw err;
					console.log("Added user " + username);
					client.close();
				});
			});

		})
	}

// Checks Unverified User Info
	public getUnverifiedUserInfo(username: string, successCallback: Function, failCallback: Function) {
		MongoClient.connect(this.DATABASE_URL, {useNewUrlParser: true}, (err: any, client: any) => { 
			if (err) throw err;
			let db = client.db(this.DB_NAME);
			db.collection("unverifiedUsers").findOne({username: username}, (err: any, result: any) => {
				if (result == null) {
					failCallback();
				} else {
					successCallback(result);
				}
				client.close();
			});
		})
	}

// Verifies the User with the activationCode
	public verifyUser(username: string, activationCode: any, callback: any) {
		this.getUnverifiedUserInfo(username, (data: any) => {
			if (data.activationCode == activationCode) {
				MongoClient.connect(this.DATABASE_URL, {useNewUrlParser: true}, (err: any, client: any) => {
					if (err) throw err;
					let db = client.db(this.DB_NAME);
					db.collection("users").findOne({username: username}, (err: any, result: any) => {
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
							}, (err: any, res: any) => {
								if (err) throw err;
								console.log("Registered user: " + username);
								callback();
								client.close();
							})
						}
					})
				})
				MongoClient.connect(this.DATABASE_URL, {useNewUrlParser: true}, (err: any, client: any) => {
					if (err) throw err;
					let db = client.db(this.DB_NAME);
					db.collection("unverifiedUsers").deleteOne({username: username}, (err: any, result: any) => {
						client.close();
					})
				})
				
			}
		}, () => {})
	}

// Login related functions
	public getSaltForUser(username: string, successCallback: Function, failCallback:Function): void {
		this.getUserInfo(username, (result: any) => {
			let salt = result.salt;
			successCallback(result.salt);
		}, failCallback);
	}

	public hash(input: any) {
		return crypto.createHash('sha256').update(input).digest('hex');
	}

	public randomHex(length: number) {
		return crypto.randomBytes(length / 2).toString("hex");
	}

	public checkLogin(username: string, token: any, tokenPW: any, successCallback: Function, failCallback: Function) {
		this.getUserInfo(username, (result: any) => {
			let correctValue = this.hash(result.storedPW + token);
			if (tokenPW == correctValue) {
				successCallback();
			} else {
				failCallback();
			}
		}, () => {
			failCallback();
		})
	}
}