const mongoose = require("mongoose")
const requireLogin = require("../middlewares/requireLogin.js");
const requireCredits = require("../middlewares/requireCredits.js");
const Survey = mongoose.model("surveys");
const Mailer = require("../services/Mailer.js");
const surveyTemplate = require("../services/emailTemplates/surveyTemplate.js");

module.exports = app => {
    app.get("/api/surveys/thanks", (req, res) => {
        res.send("Thanks for voting!");
    });

    app.post("/api/surveys", requireLogin, requireCredits, async (req, res) => {
        const { title, subject, body, recipients } = req.body;

        const survey = new Survey({
            title,
            subject,
            body,
            recipients: recipients.split(",").map(email => ({ email: email.trim() })),
            _user: req.user.id,
            dateSent: Date.now()
        })

        const mailer = new Mailer(survey, surveyTemplate(survey));
        try {
            const response = await mailer.send();
            console.log(response);

            const atLeastOneSuccess = response.Status.some(entry => entry.Status === 'Success');
            console.log(atLeastOneSuccess);
            if (atLeastOneSuccess) {
                await survey.save();
                req.user.credits -= 1;
                const user = await req.user.save();
                res.send(user);
            } else {
                throw new Error(`Unable to send the emails! Check the response status: ${JSON.stringify(response)}`)
            }
        } catch (err) {
            console.log(err);
            res.status(422).send(err);
        }
    });
};
