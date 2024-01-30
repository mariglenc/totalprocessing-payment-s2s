let paymentId

// when the iframe load completes we remove the loading effect
function handleIframeLoad() {
  console.log("IFrame was loaded")
  document.getElementById('loadingOverlay').style.display = 'none'
}

// this is called after the iframe submit button is clicked and the redirection has happened
async function on3DSComplete() {
  console.log("New event 3DS-authentication-complete. IFrame will be hidden, and the payment response will be shown")
  document.getElementById('paymentIframe').style.display = 'none'
  document.getElementById('responseDiv').style.display = 'block'
  document.getElementById('loadingOverlay').style.display = 'block'

  const response = await verifyPayment(paymentId)
  console.log('verifyPayment response ', response)

  const resultInfoDiv = document.getElementById('resultInfo')
  resultInfoDiv.innerHTML = `<p>Result Code: ${response.result.code}</p>`
  resultInfoDiv.innerHTML += `<p>Result Description: ${response.result.description}</p>`

  document.getElementById('loadingOverlay').style.display = 'none'
}

// this function is to verify the payment
async function verifyPayment(id) {
  try {
    let response = await fetch(`http://127.0.0.1:3003/verifyPayment/${id}`)
    let data = response.json()
    return data;
  } catch (error) {
    console.error('Error:', error)
  }
}

// this event listenere listens for the iframe postmessage and the execute other functions
window.addEventListener(
  'message',
  function (e) {
    if (e.data === '3DS-authentication-complete') {
      on3DSComplete()
    }
  },
  false
)

//this is used for initiate the payment in submit clik
async function submitForm() {
  try {
    console.log('the form was submitted')
    document.getElementById('loadingOverlay').style.display = 'block'
    let response = await fetch('http://127.0.0.1:3003/makePayment', {
      method: 'POST',
    });
    let data = await response.json();
    console.log('/makePayment response ', data)
    const redirectUrl = data.redirect.url
    paymentId = data.id
    document.getElementById('paymentIframe').src = redirectUrl
    document.getElementById('paymentIframe').style.display = 'block'
  } catch (error) {
    console.error('Error:', error)
  }
}
