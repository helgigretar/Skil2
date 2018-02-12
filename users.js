const bcrypt = require('bcrypt');

const records = [
  {
    id: 1,
    username: 'admin',
    password: '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii',
    name: 'Stjórnandi',
  },
];

exports.comparePasswords = (hash, user) => {
  // todo
}

exports.findByUsername = username => {
  // todo
}

exports.findById = id => {
  // todo
}
