module.exports = {
    units: { bought: Number, left: Number },
    period: Number,
    installation: Boolean,
    date: Date,
    type: { type: String },
    accessories: {
        hygeinstol: { bought: Number, left: Number },
        golvslist: { bought: Number, left: Number },
        shampoo: { bought: Number, left: Number },
        soap: { bought: Number, left: Number },
    },
};
