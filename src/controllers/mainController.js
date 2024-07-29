const mainController = {
    async index(req, res) {
        // res.status(301);
        res.status(301).redirect('/lists');
    },
};

export { mainController };
