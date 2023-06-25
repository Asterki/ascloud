import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
const Schema = mongoose.Schema;

const User = new Schema({
	userID: {
		type: String,
		required: true,
		unique: true,
	},
	created: {
		type: Number,
		required: true,
	},

	username: {
		type: String,
		required: true,
		unique: true,
	},

	email: {
		value: {
			type: String,
			required: true,
			unique: true,
		},
		verified: {
			type: Boolean,
			default: false,
		},
	},

	storageLimit: {
		type: String,
		required: false,
		default: "10GB",
	},

	locale: {
		type: String,
		default: "en",
	},

	password: {
		type: String,
		required: true,
	},

	tfa: {
		secret: {
			type: String,
			default: "",
		},
	},
});

User.plugin(passportLocalMongoose);
export default mongoose.model("User", User, "users");
