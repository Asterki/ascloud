import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TrashFiles = new Schema({
	userID: {
		type: String,
		required: true,
		unique: true,
	},
	filePath: {
		type: String,
		required: true,
		unique: true,
	},
});

export default mongoose.model("Trash files", TrashFiles, "trash-files");
