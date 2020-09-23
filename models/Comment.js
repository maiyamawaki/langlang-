const { Schema, model }= require("mongoose")

const commentSchema = new Schema(
	{
    context: String,
		owner : {
      type: Schema.Types,
      ref: "User"
		}
  },
  {
    timestamps: true
  }
)

module.exports = model("Comment", commentSchema);