const {Schema, model} = require("mongoose");

const infoSchema = new Schema(
	{
		title : String,
		photo : String,
		description : String,
		ownerId : {
      type: Schema.Types,
      ref: "User"
    },
    owner : String,
	},
	{
		timestamps: true,
	}
)

module.exports = model("Info", infoSchema)