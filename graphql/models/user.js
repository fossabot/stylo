const mongoose = require('mongoose')
const defaultsData = require('../data/defaultsData')

const Article = require('./article')
const { UserPermissionSchema } = require('./permission')
const { logger } = require('../logger')

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tag'
    }
  ],
  acquintances: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  articles: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Article'
    }
  ],
  authType: {
    type: String,
    default: 'local',
    enum: ['local', 'oidc']
  },
  password: {
    type: String,
    default: null
  },
  // we store who a user has granted his account to
  // each listed account can _switch into_ their account
  permissions: [
    UserPermissionSchema
  ],
  displayName: {
    type: String,
  },
  admin: {
    type: Boolean,
    default: false
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  institution: {
    type: String
  },
  zoteroToken: {
    type: String
  },
  yaml: {
    type: String,
    defaults: defaultsData.yaml
  }
}, { timestamps: true });


userSchema.statics.findAllArticles = async function ({ userId, fromSharedUserId }) {
  // if fromSharedUserId is provided
  // we check if it allowed userId to look into their articles
  // @todo

  return this
    .findById(fromSharedUserId ?? userId)
    .populate('tags acquintances')
    .populate({ path: 'permissions', populate: 'user' })
    // see https://mongoosejs.com/docs/api/document.html#document_Document-populate
    // for subdocument population
    .populate({
      path: 'articles',
      options: { sort: { 'updatedAt': -1 } },
      populate: [
        {
          path: 'owner versions tags',
        },
        {
          path: 'contributors',
          populate: 'user'
        }
      ],
    })
    .lean();
}

/**
 * Find all the accounts a user can _switch to_
 *
 * @param {String} userId
 * @param {String} role
 * @returns {userSchema.model[]}
 */
userSchema.statics.findAccountAccessUsers = async function (userId, role = 'write') {
  return this
    .find({
      $or: [
        { _id: userId },
        { permissions: {
          $elemMatch: { user: userId, scope: 'user', roles: { $in: role } }
        } }
      ]
    })
    .lean()
}

/**
 * Find all the account identifiers a user can _switch to_
 *
 * @param {String} userId
 * @param {String} role
 * @returns {String[]}
 */
userSchema.statics.findAccountAccessUserIds = async function (userId, role = 'write') {
  return this.findAccountAccessUsers(userId, role)
    .then(users => users.map(({ _id }) => String(_id)).concat(String(userId)))
}

userSchema.statics.findAccountAccessArticles = function (user, role = 'read') {
  return this
    .find({ permissions: { $elemMatch: { user, scope: 'user', roles: { $in: role } } } })
    .populate({
      path: 'articles',
      populate: [
        {
          path: 'owner versions tags',
        },
        {
          path: 'contributors',
          populate: 'user'
        }
      ],
    })
}

module.exports = mongoose.model('User', userSchema)
module.exports.schema = userSchema

module.exports.postCreate = function postCreate (newUser) {
  logger.info({ userId: newUser._id }, 'User has been saved')

  // Create a new default article for each new user
  const defaultArticle = defaultsData.article
  const newArticle = new Article({ title: defaultArticle.title })

  newUser.articles.push(newArticle)
  newArticle.owner = newUser

  return Promise.all([
    newUser.save(),
    newArticle.save(),
  ])
}
