const { SESClient, SendBulkTemplatedEmailCommand } = require("@aws-sdk/client-ses");
const keys = require("../config/keys")

const sesClient = new SESClient({
    region: keys.awsRegion,
    credentials: {
        accessKeyId: keys.awsAccessKey,
        secretAccessKey: keys.awsSecretKey
    },
});

class Mailer {
    constructor({ subject, recipients }, content) {

        this.sendBulkCommand = new SendBulkTemplatedEmailCommand({
            Source: "no-reply@andmarsh.cloudns.ch",
            ConfigurationSetName: keys.awsConfigurationSetName,
            Template: "EmptyHtmlTemplate",
            DefaultTemplateData: `{ "subject": "${subject}", "html_body": "${content}" }`,
            Destinations: this.formatAddresses(recipients) }) }

    formatAddresses(recipients) {
        return recipients.map(({ email }) => ({
            Destination: {
                ToAddresses: [email]
            }
        }))
    }

    async send() {
        const response = await sesClient.send(this.sendBulkCommand);
        return response;
    }
}

module.exports = Mailer;
