const Course = require('../models/Course.models')
class SiteController {
    // [get]/
    home(req, res, next) {
        const getCource = async () => {
            Course.find({})
                .then(cources => {
                    const dataSend = {
                        responseCode: 200,
                        data: cources,
                        message: "Success"
                    }
                    res.json(dataSend)
                })
                .catch(error => next(error))

        }
        getCource()
    }
    // [get]/search
    search(req, res) {
        res.render('search');
    }
}

module.exports = new SiteController();
