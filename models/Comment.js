const { Schema, model }= require("mongoose")

const commentSchema = new Schema(
	{
    context: String,
		ownerId : {
      type: Schema.Types,
      ref: "User"
    },
    owner : String,
  },
  {
    timestamps: true
  }
)

module.exports = model("Comment", commentSchema);