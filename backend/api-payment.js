const express = require('express')
const https = require('https')
const querystring = require('querystring')
const cors = require('cors')

const app = express()
const port = 3003

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// routes
app.post('/makePayment', async (req, res) => {
  try {
    const response = await makePaymentRequest()
    res.json(response)
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.get('/verifyPayment/:paymentId', async (req, res) => {
  try {
    const paymentId = req.params.paymentId
    const data = await verifyPaymentRequest(paymentId)
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

const makePaymentRequest = async () => {
  const path = '/v1/payments'

  const data = querystring.stringify({
    entityId: '8ac7a4ca880534c801880575423200b5',
    amount: 50,
    currency: 'GBP',
    paymentBrand: 'VISA',
    paymentType: 'PA',
    shopperResultUrl: 'http://127.0.0.1:5500/frontend/redirectin-page.html',
    createRegistration: true,
    'card.number': 4200000000000091,
    'card.holder': 'Jane Jones',
    'card.expiryMonth': '05',
    'card.expiryYear': 2031,
    'card.cvv': 123,
    'threeDSecure.challengeIndicator': 4,
    'customer.browser.acceptHeader': 'text/html',
    'customer.browser.screenColorDepth': 48,
    'customer.browser.javaEnabled': false,
    'customer.browser.language': 'en',
    'customer.browser.screenHeight': 1200,
    'customer.browser.screenWidth': 1600,
    'customer.browser.timezone': 60,
    'customer.browser.challengeWindow': 4,
    'customer.browser.userAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  })

  const options = {
    port: 443,
    host: 'eu-test.oppwa.com',
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': data.length,
      Authorization: 'Bearer OGFjN2E0Y2E4ODA1MzRjODAxODgwNTc1NDAzNDAwYjN8U1dZZXNnMmJ5NQ==',
    },
  }

  return new Promise((resolve, reject) => {
    const postRequest = https.request(options, res => {
      const chunks = []

      res.on('data', chunk => {
        chunks.push(Buffer.from(chunk))
      })

      res.on('end', () => {
        const jsonString = Buffer.concat(chunks).toString('utf8')
        try {
          resolve(JSON.parse(jsonString))
        } catch (error) {
          reject(error)
        }
      })
    })

    postRequest.on('error', reject)
    postRequest.write(data)
    postRequest.end()
  })
}

const verifyPaymentRequest = async id => {
  const path = `/v1/payments/${id}?entityId=8ac7a4ca880534c801880575423200b5`
  const options = {
    port: 443,
    host: 'eu-test.oppwa.com',
    path: path,
    method: 'GET',
    headers: {
      Authorization: 'Bearer OGFjN2E0Y2E4ODA1MzRjODAxODgwNTc1NDAzNDAwYjN8U1dZZXNnMmJ5NQ==',
    },
  }

  return new Promise((resolve, reject) => {
    const postRequest = https.request(options, function (response) {
      const buf = []
      response.on('data', chunk => {
        buf.push(Buffer.from(chunk))
      })
      response.on('end', () => {
        const jsonString = Buffer.concat(buf).toString('utf8')
        try {
          resolve(JSON.parse(jsonString))
        } catch (error) {
          reject(error)
        }
      })
    })

    postRequest.on('error', reject)
    postRequest.end()
  })
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
