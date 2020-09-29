const { Schema, model } = require('mongoose');
const PLM = require('passport-local-mongoose');

const userSchema = new Schema(
  {
    email: String,
    name: String,
    from : String,
    living : String,
    photo: {
      type: String,
      default: "https://www.cardiff.ac.uk/__data/assets/image/0014/10841/no-profile.jpg"
    },
    nativeLanguage : {
      type : String,
      enum : ["English", "Spanish", "Japanese", "	Mandarin Chinese", "French", "Italian", "Russian", "German", "Hindi","Portuguese","Arabic", "Bengali", ""]
    },
    learnLanguage : {
      type : String,
      enum : ["English", "Spanish", "Japanese", "	Mandarin Chinese", "French", "Italian", "Russian", "German", "Hindi","Portuguese","Arabic", "Bengali","Korean"]
    },
    hobby:String,
    about:String,
    comments : Array,
    infos : Array,
    materials : Array
  }
);

userSchema.plugin(PLM, { usernameField: 'email' });

module.exports = model('User', userSchema);
