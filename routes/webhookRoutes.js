const bodyParser = require('body-parser')

module.exports = (app, got) => {
  // app.use(bodyParser.urlencoded({ extended: true }))
  // app.use(bodyParser.json())

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(bodyParser.text());

  app.post('/api/webhook', async (req, res) => {
    console.log(req)
    // let body = ''

    // req.on('data', (chunk) => {
    //   body += chunk.toString()
    // })
    console.log(req.body)

    req.on('end', async () => {
      // console.log(body);
      let payload = JSON.parse(body)
      // console.log(payload);

      if (payload.Type === 'SubscriptionConfirmation') {
        if (req.body.SubscribeURL) {
          await got(req.body.SubscribeURL)
          return res.end()
        }
      }
    })
  })
}

  // app.post('/api/webhook', async (req, res) => {
  //   try {
  //     // console.log(req);
  //     // Include this new block
  //     // to confirm subscription
  //     if (req.is('text/*')) {
  //       console.log("test")
  //       console.log(req.SubscribeURL)
  //       console.log(req.body)
  //       req.body = JSON.parse(req.body)
  //       console.log(req.body);
  //       if (req.body.SubscribeURL) {
  //         await got(req.body.SubscribeURL)
  //         return res.end()
  //       }
  //     }
  //     // \endblock
  //     const body = JSON.parse(req.body.Message)

  //     // If there is no event type, then we've got nothing
  //     if (!body.eventType) { return res.end() }

  //     // What's the event?
  //     const event = body.eventType.toLowerCase()
  //     const eventData = body
  //     console.log(JSON.stringify(eventData))

  //     const domain = event_data.mail.tags['ses:from-domain'][0]
  //     const messageId = event_data.mail.messageId
  //     const date = new Date(eventData.mail.timestamp)
  //     const email = event_data.mail.destination[0]
  //     const subject = eventData.mail.commonHeaders.subject

  //     // #todo: Verify event is from SES

  //     if (event == 'click') {
  //       const ua = eventData.click.userAgent
  //       const url = eventData.click.link
  //       // do stuff here
  //     } else if (event == 'open') {
  //       const ua = eventData.open.userAgent
  //       // do stuff here
  //     } else if (event == 'delivery') {
  //       // do stuff here
  //     } else if (event == 'complaint') {
  //       const ua = eventData.complaint.userAgent
  //       // do stuff here
  //     } else if (event == 'reject') {
  //       const ua = eventData.complaint.userAgent
  //       const reason = eventData.reject.reason
  //       // do stuff here
  //     } else if (event == 'bounce') {
  //       const description = eventData.bounce.bouncedRecipients[0].diagnosticCode
  //       // do stuff here
  //     } else {
  //       // Not supported
  //       // do stuff here
  //     }

  //     // anything else can come in here

  //     return res.end()
  //   } catch (err) {
  //     // #todo: Track error here
  //     res.end()
  //   }
  // })
// }
