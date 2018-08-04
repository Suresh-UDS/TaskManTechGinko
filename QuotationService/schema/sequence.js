var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

var SequenceSchema = new Schema({

	value :{
		type: Number,
		required:true 
	},
	type :{
		type: String,
		required:true 
	}
	
});

SequenceSchema.statics.getNext = function(type,callback){
	var self = this;

	this.findOneAndUpdate(
{
    type:type
    },
  {
      $inc:{value:1
          }
      }
  ,function(err,result){
  	callback(result.value.toFixed(0));
  });
	/*this.findOne({id:id},function(err,result){
		if(err || !result){
			var Gen = mongoose.model('Sequence')
			var sequence  = new Gen();
			sequence.id=id
			sequence.value = 1;
			sequence.save();
			callback(1);
		}else{
			result.value = result.value+1;
			result.save(function(err, result){

				callback(result.value);

			})
		}
	})*/
}
mongoose.model('Sequence', SequenceSchema);

module.exports = SequenceSchema