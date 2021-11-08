const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const roleSchema = mongoose.Schema({
    role_name: {type: String, required: true, unique: true}
})

roleSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Role', roleSchema);