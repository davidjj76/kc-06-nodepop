const mongoose = require('mongoose');

let Advertisement;

const Schema = mongoose.Schema;

const advertisementSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  forSale: {
    type: Boolean,
    default: true,
  },
  price: {
    type: Number,
    required: true,
  },
  picture: {
    type: String,
    default: '',
  },
  tags: {
    type: [
      {
        type: String,
        enum: ['work', 'lifestyle', 'motor', 'mobile'],
      },
    ],
    required: true,
  },
}, {
  // Schema options
  id: false,
  toJSON: { virtuals: true },
  timestamps: { createdAt: 'publishedAt' },
});

// virtuals
advertisementSchema.virtual('pictureUrl')
  .get(function () {
    return `${this.baseUri}/images/advertisements/${this.picture}`;
  });

// static methods
advertisementSchema.statics = {
  list(filter, skip, limit, sort) {
    return Advertisement.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .exec();
  },
  delete() {
    return Advertisement.deleteMany().exec();
  },
  insert(advertisements) {
    return Advertisement.insertMany(advertisements);
  },
  listTags(requestSort) {
    const unwind = { $unwind: '$tags' };
    const group = {
      $group: {
        _id: '$tags',
        tag: { $first: '$tags' },
        advertisements: { $sum: 1 },
      },
    };
    const project = {
      $project: {
        _id: 0,
        tag: 1,
        advertisements: 1,
      },
    };
    const sort = { $sort: {} };
    if (requestSort === 'advertisements' || requestSort === '-advertisements') {
      sort.$sort = { advertisements: requestSort.indexOf('-') === 0 ? -1 : 1 };
    }
    sort.$sort.tag = 1;
    return Advertisement.aggregate([unwind, group, project, sort]).exec();
  },
};

// create and export model
Advertisement = mongoose.model('Advertisement', advertisementSchema);
module.exports = Advertisement;
