var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var UserSchema = new Schema(
    {
        avatar: String,
        name: String,
        sex: String,
        rank: String,
        startdate: String,
        phone: String,
        email: String, 
        superior: { type: Schema.Types.ObjectId, ref: 'User', default: null},
        ds: {type: Number, default:0} ////////////
    }
);
UserSchema.plugin(mongoosePaginate); 
module.exports = mongoose.model("User", UserSchema); 
/*let Employee = mongoose.model('Node', treeSchema)
module.exports = Employee;*/
