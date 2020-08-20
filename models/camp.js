var mongoose = require("mongoose"); 

var campSchema = new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	description: String, 
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String	
	
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
}, function(err, camp){
	if(err) {
		console.log(err);
	} else{ 
		console.log(camp);
	}
})

module.exports = mongoose.model("Camp", campSchema); 