### Total Processing Server to Server Example

1) Get a Token to communicate with TP, and configure the calls in api-payment.js
2Set shopperResultUrl in makePaymentRequest method in api-payment.js  (same as the url where your frontend will run)
    Examples: http://localhost:63342/twotone-websites/backend/REST/totalprocessing-payment-s2s/frontend/redirectin-page.html
              http://127.0.0.1:5500/redirectin-page.html
2) Run the server in backend folder `npm run`
3) Open frontend/index.html



# Error
chrome-error://chromewebdata/:1 Refused to display 'http://127.0.0.1:63342/' in a frame because it set 'X-Frame-Options' to 'sameorigin'.