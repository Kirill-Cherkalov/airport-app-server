const paypal = require('paypal-rest-sdk');

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AU8YL03yFxcgpXe4EfypJBqu3RsFXBq2GuVXcNb6tM5TzOdIErN8wgelQfk4pGBTmoMEMm-utFxVRooH',
  'client_secret': 'EGcwq7cMm0skXjqDLkKNNc0v4TijKPnhk9NlzXzijrWE8dQp0X02EKDE63uHdOGf1nH9CpnqqmGcTtFI'
});

exports.createPaymentBill = (req, res) => {
  console.log(req.body);
  console.log('it works\n\n');

  paypal.payment.create(req.body, function (error, payment) {
    if (error) {
        throw error;
    } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === 'approval_url') {
            res.send(payment.links[i].href);
          }
        }
    }
  });
};

exports.successPayment = (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
        "amount": {
            "currency": "USD",
            "total": "1.00"
        }
    }]
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
        console.log(JSON.stringify(payment));
        res.send('success');
    }
  });
};

exports.cancelPayment = (req, res) => {
  res.send('cancel');
};
