const {Schema, model} = require("mongoose")

const stydySchema = new Schema(
	{
		title : String,
		photo : {
			type : String,
			default: "https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png"
		},
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

module.exports = model("StudyMaterial", stydySchema);