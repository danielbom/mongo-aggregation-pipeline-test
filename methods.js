const expression = {};
const _id = "123";
const field = "x";
const fields = ["y", "z"];
const path = "p";
const options = {};
const from = "from";
const localField = "local";
const foreignField = "foreign";
const as = "as";
const fromExpression = {
  from,
  localField,
  foreignField,
  as,
};
const unwindOptions = { x: true };
const number = 99;
const collectionName = "collection";
const newRoot = "new";
const size = 42;
const index = "index";
const search = "search";
const highlight = "highlight";
const root = "root";

const methods = [
  {
    name: "addFields",
    args: [expression],
    expect: { $addFields: expression },
  },
  {
    name: "group",
    args: [expression],
    expect: { $group: expression },
  },
  {
    name: "groupFields",
    args: [root, _id, field, ...fields],
    expect: [
      {
        $group: {
          _id,
          [root]: { $first: "$$ROOT" },
          [field]: { $push: "$" + field },
          ...fields.reduce((o, f) => ({ ...o, [f]: { $push: "$" + f } }), {}),
        },
      },
      {
        $addFields: {
          [root + "." + field]: "$" + field,
          ...fields.reduce((o, f) => ({ ...o, [root + "." + f]: "$" + f }), {}),
        },
      },
      { $replaceRoot: { newRoot: "$" + root } },
    ],
  },
  {
    name: "match",
    args: [expression],
    expect: { $match: expression },
  },
  {
    name: "project",
    args: [expression],
    expect: { $project: expression },
  },
  {
    name: "unwind",
    args: [path, options],
    expect: { $unwind: { path, ...options } },
  },
  {
    name: "unwindPreserveNulls",
    args: [path, options],
    expect: {
      $unwind: { path, ...options, preserveNullAndEmptyArrays: true },
    },
  },
  {
    name: "lookup",
    args: [from, localField, foreignField, as],
    expect: {
      $lookup: {
        from: from,
        localField,
        foreignField,
        as,
      },
    },
  },
  {
    name: "lookupAndUnwind",
    args: [from, localField, foreignField, as, unwindOptions],
    expect: [
      {
        $lookup: {
          from: from,
          localField,
          foreignField,
          as,
        },
      },
      { $unwind: { path: "$" + as, ...unwindOptions } },
    ],
  },
  {
    name: "lookupAndUnwindPreserveNulls",
    args: [from, localField, foreignField, as, unwindOptions],
    expect: [
      {
        $lookup: {
          from: from,
          localField,
          foreignField,
          as,
        },
      },
      {
        $unwind: {
          path: "$" + as,
          ...unwindOptions,
          preserveNullAndEmptyArrays: true,
        },
      },
    ],
  },
  {
    name: "lookupAndUnwind",
    args: [from, localField, foreignField],
    expect: [
      {
        $lookup: {
          from: from,
          localField,
          foreignField,
          as: localField,
        },
      },
      { $unwind: { path: "$" + localField } },
    ],
  },
  {
    name: "lookupAndUnwindPreserveNulls",
    args: [from, localField, foreignField],
    expect: [
      {
        $lookup: {
          from: from,
          localField,
          foreignField,
          as: localField,
        },
      },
      {
        $unwind: {
          path: "$" + localField,
          preserveNullAndEmptyArrays: true,
        },
      },
    ],
  },
  {
    name: "lookupAndUnwind",
    args: [fromExpression],
    expect: [
      { $lookup: fromExpression },
      { $unwind: { path: "$" + fromExpression.as } },
    ],
  },
  {
    name: "lookupAndUnwindPreserveNulls",
    args: [fromExpression],
    expect: [
      { $lookup: fromExpression },
      {
        $unwind: {
          path: "$" + fromExpression.as,
          preserveNullAndEmptyArrays: true,
        },
      },
    ],
  },
  {
    name: "bucket",
    args: [expression],
    expect: { $bucket: expression },
  },
  {
    name: "bucketAuto",
    args: [expression],
    expect: { $bucketAuto: expression },
  },
  {
    name: "colStat",
    args: [expression],
    expect: { $colStat: expression },
  },
  {
    name: "count",
    args: [field],
    expect: { $count: field },
  },
  {
    name: "facet",
    args: [expression],
    expect: { $facet: expression },
  },
  {
    name: "geoNear",
    args: [expression],
    expect: { $geoNear: expression },
  },
  {
    name: "graphLookup",
    args: [expression],
    expect: { $graphLookup: expression },
  },
  {
    name: "indexStat",
    args: [],
    expect: { $indexStat: {} },
  },
  {
    name: "limit",
    args: [number],
    expect: { $limit: number },
  },
  {
    name: "out",
    args: [collectionName],
    expect: { $out: collectionName },
  },
  {
    name: "redact",
    args: [expression],
    expect: { $redact: expression },
  },
  {
    name: "replaceRoot",
    args: [newRoot],
    expect: { $replaceRoot: { newRoot } },
  },
  {
    name: "sample",
    args: [size],
    expect: { $sample: { size } },
  },
  {
    name: "searchBeta",
    args: [index, search, highlight],
    expect: { $searchBeta: { index, search, highlight } },
  },
  {
    name: "skip",
    args: [number],
    expect: { $skip: number },
  },
  {
    name: "sort",
    args: [expression],
    expect: { $sort: expression },
  },
  {
    name: "sortByCount",
    args: [expression],
    expect: { $sortByCount: expression },
  },
];

module.exports = methods;
