const paypal = require("paypal-rest-sdk");
const CatchAsync = require("../../util/CatchAsync");
const Plan = require("../../models/PlanModel");
const Event = require("../../models/EventModel");
const PurchaseHistory = require('../../models/PurchaseHistory') 
const { PAYPAL_MODE, PAYPAL_CLIENT_ID, PAYPAL_SECRET_KEY } = process.env;

paypal.configure({
  mode: PAYPAL_MODE,
  client_id: PAYPAL_CLIENT_ID,
  client_secret: PAYPAL_SECRET_KEY,
});

exports.availablePlans = CatchAsync(async (req, res) => {
  const plans = await Plan.find({ isDeleted: false });
  const event = await Event.findById(req?.eventId);

  let currentPlan = null
  if(event.selectedPlan.transactionId){
    currentPlan = await Plan.findById(event.selectedPlan.plan) 
    if (currentPlan) {
      currentPlan = currentPlan.toObject();
      currentPlan.expiresOn = event.selectedPlan.expiry.toDateString()
    }
  }
  console.log(currentPlan)
  return res.status(200).json({ success: "ok", plans, currentPlan });
});

exports.buyPlan = CatchAsync(async (req, res) => {
  console.log(req.body);
  const selectedPlan = await Plan.findById(req.body.planId);
  const event = await Event.findById(req.eventId);
  console.log(event);
  const createPaymentJson = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: `http://localhost:5000/api/event/PaymentSuccess?planId=${selectedPlan._id}&eventId=${event._id}`,
      cancel_url: "http://localhost:5000/api/event/PaymentError",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: selectedPlan.name,
              sku: selectedPlan._id,
              price: selectedPlan.amount,
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: selectedPlan.amount,
        },
        description: "Hat for the best team ever",
      },
    ],
  };

  paypal.payment.create(createPaymentJson, async function (error, payment) {
    if (error) {
      console.log(error.message);
      return res.json({ error: "payment failed" });
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          return res.json({
            success: "payment is on",
            approvalUrl: payment.links[i].href,
          });
        }
      }
    }
  });
});

exports.getSuccessPage = CatchAsync(async (req, res) => {
  const payerId = req.query?.PayerID;
  const paymentId = req.query?.paymentId;
  const planId = req?.query?.planId;
  const eventId = req?.query?.eventId;

  const plan = await Plan.findById(planId);
  const event = await Event.findById(eventId);
  //   console.log(plan)
  //  console.log(event)

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: plan.amount,
        },
      },
    ],
  };

  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    async function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        const response = JSON.stringify(payment);
        const parsedResponse = JSON.parse(response);

        const transactionId = parsedResponse.transactions[0].related_resources[0].sale.id;
        const createdOn = new Date();
        console.log(transactionId)

        event.selectedPlan.plan = plan._id
        event.selectedPlan.transactionId = transactionId;
        event.selectedPlan.expiry = new Date(createdOn.getTime() + 10 * 60 * 1000); // 10 min valid for test case
        await event.save();

        await PurchaseHistory.create({
          plan:plan._id,
          event:eventId,
          transactionId:transactionId,
          startDate:createdOn,
          expireDate:new Date(createdOn.getTime() + 10 * 60 * 1000)
        })
        return res.redirect("http://localhost:5173/PaymentSuccess");
      }
    }
  );
});


exports.getErrorPage = CatchAsync(async (req, res) => {
  console.log("payment failed");
  return res.redirect("http://localhost:5173/PaymentError");
});
