module.exports = (req, res, db) => {
    console.dir(req.body);

    // Parsing options
    options = {
        amount: 5,
        list: undefined
    }

    if (req.query.amount) {
        options.amount = parseInt(req.query.amount)
    }

    if (req.query.list) {
        options.list = req.query.list
    } else {
        return res.status(400).send('List param missing');
    }

    let x = await db.getAllListsWithWords('niels')
    console.log(x);
    return res.send(await (await db).getWords(options));
}