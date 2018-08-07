import { server } from './server';
import { Mongo } from './mongo';
import NodeMailer = require('nodemailer');

// Listeners for the Server whenever server receives an on.message from the client about account creation or logging in

let listener = function(clients: any, sessionInfo: any, index: number, data: any): void {
	let mongo = new Mongo();
	let curClient = clients[index];
	let session = sessionInfo[index];

	switch (data.type) {
// Handles receiving username to send client a message to initiate login
		case "begin-login": {
			if (!server.validateProperties(data, ["username"])) {
				return;
			}
			mongo.getSaltForUser(data.username, (salt: any) => {
				let token = mongo.randomHex(64);
				session.loginToken = token;
				session.salt = salt;

				curClient.send(JSON.stringify({
					type: "login-token",
					token: token,
					salt: salt
				}))
			}, () => {

				curClient.send(JSON.stringify({
					type: "bad-login"
				}));
			})

			break;
		}
// Starts login process
		case "login": {
			if (!server.validateProperties(data, ["username", "value"])) {
				return;
			}
			mongo.checkLogin(data.username, session.loginToken, data.value, () => {
				// Check if this user is already logged in, and don't log in if so
				for (let i in sessionInfo) {
					if (sessionInfo[i].username == data.username) {
						curClient.send(JSON.stringify({
							type: "already-logged-in"
						}));
						return;
					}
				}
				delete session.loginToken;
				session.username = data.username;

				mongo.getDetails(session.username, (details: any) => {
					// Update session info function, and allow client to login
					let initiateLogin = () => {
						// update session object
						curClient.send(JSON.stringify({
							type: "logged-in",
							details: "something" // more info to login
						}))
						// send lobby update
					}

					// if (details.isBanned) {
					// 	// do something if user is banned	
					// }
					initiateLogin();
					return;
				});

			}, () => {
				curClient.send(JSON.stringify({
					what: "bad-login"
				}));
			});
			break;
		}
// Receives message from client to initiate account creation
		case "begin-create-account": {
			let salt = mongo.randomHex(64);
			session.newSalt = salt;
			curClient.send(JSON.stringify({
				type: "new-account-salt",
				salt: salt
			}))
			break;
		}
// Checks for duplicate usernames and resumes account creation
		case "create-account": {
			if (!server.validateProperties(data, ["username", "storedPW", "email"])) {
				return;
			}
			if (!session.newSalt) {
				return;
			}
			mongo.getUserInfo(data.username, () => {
				curClient.send(JSON.stringify({
					type: "username-taken"
				}));
			}, () => {
				curClient.send(JSON.stringify({
					type: "activation-email-sent"
				}));
				let activationCode = mongo.randomHex(10);
				// Remove data.salt when client-crypto works
				mongo.addUnverifiedUser(data.username, session.newSalt, data.storedPW, data.email, activationCode);

				// Send verification e-mail
				let transporter = NodeMailer.createTransport({
					service: "gmail",
					auth: {
						user: "momorts.verify@gmail.com",
						pass: "veniisafag"
					}
				});

				let mailOptions = {
						from: "momorts.verify@gmail.com",
						to: data.email,
						subject: "MomoRTS Account Verification",
						html: `<a href="http://localhost:4200/verify/?user=${data.username}&code=${activationCode}">Activation URL</a>`
				};

				transporter.sendMail(mailOptions, (error, info) => {
					if (error) {
						console.log(error);
					} else {
						console.log(`Verification email sent to ${data.email}: ` + info.response);
					}
				});
			});
			break;
		}
// Verify the account
		case "verify-account": {
			if (!server.validateProperties(data, ["username", "activationCode"])) {
				return;
			}
			mongo.verifyUser(data.username, data.activationCode, () => {
				curClient.send(JSON.stringify({
					type: "account-activated"
				}));
			})
			break;
		}
	}
}

module.exports = {
	listener: listener
};