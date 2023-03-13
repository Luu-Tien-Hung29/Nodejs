const Course = require('../models/Course')
class SiteController {
    // [get]/
    home(req, res, next) {
        const getCource = async () => {
            // const session = await Course.find()
            // try {
            //     if (session) {
            //         const dataSend = {
            //             responseCode: 200,
            //             data: session,
            //             message: "Success"
            //         }
            //         res.json(dataSend)
            //     } else {
            //         next(err)
            //         res.status(400).json({ error: "ERROR!!!" })
            //     }
            // } catch (error) {
            //     res.json(error)
            // }
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
