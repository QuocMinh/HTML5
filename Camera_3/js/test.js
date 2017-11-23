var arr = [];

Food.find({ type: type, format: { $in: format } }, (err, data1) => {
    if(!err) {
        arr = data1;

        Food.find({ type: type }, (err, data2) => {
            arr = arr.concat(data2);

            return err ? callback(err, null) : callback(null, arr);

        }).limit(Number(number - 1));
    } else {
        return callback(err, null);
    }
}).limit(Number(1));

// return err ? callback(err, null) : callback(null, temp1);