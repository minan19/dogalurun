import crypto from "crypto";

const API_KEY = process.env.IYZICO_API_KEY!;
const SECRET_KEY = process.env.IYZICO_SECRET_KEY!;
const BASE_URL = process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com";

function generateAuthHeader(requestBody: string): string {
  const randomStr = Math.random().toString(36).substring(2);
  const hash = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(API_KEY + randomStr + requestBody)
    .digest("base64");
  const authStr = `apiKey:${API_KEY}&randomKey:${randomStr}&signature:${hash}`;
  return `IYZWSv2 ${Buffer.from(authStr).toString("base64")}`;
}

export interface IyzicoPaymentRequest {
  price: number;
  paidPrice: number;
  orderId: string;
  locale?: string;
  customer: {
    name: string;
    surname: string;
    email: string;
    phone: string;
    identityNumber?: string;
    ip?: string;
    city: string;
    country: string;
    address: string;
    zipCode?: string;
  };
  items: Array<{
    id: string;
    name: string;
    category: string;
    price: number;
  }>;
  callbackUrl: string;
  card: {
    cardHolderName: string;
    cardNumber: string;
    expireMonth: string;
    expireYear: string;
    cvc: string;
  };
}

export async function initiate3DPayment(req: IyzicoPaymentRequest) {
  const payload = {
    locale: req.locale || "tr",
    conversationId: req.orderId,
    price: req.price.toFixed(2),
    paidPrice: req.paidPrice.toFixed(2),
    currency: "TRY",
    installment: "1",
    paymentChannel: "WEB",
    paymentGroup: "PRODUCT",
    paymentCard: {
      cardHolderName: req.card.cardHolderName,
      cardNumber: req.card.cardNumber.replace(/\s/g, ""),
      expireMonth: req.card.expireMonth,
      expireYear: req.card.expireYear,
      cvc: req.card.cvc,
      registerCard: "0",
    },
    buyer: {
      id: req.orderId,
      name: req.customer.name,
      surname: req.customer.surname,
      email: req.customer.email,
      identityNumber: req.customer.identityNumber || "11111111111",
      phone: req.customer.phone || "+905000000000",
      registrationAddress: req.customer.address,
      city: req.customer.city,
      country: req.customer.country,
      zipCode: req.customer.zipCode || "00000",
      ip: req.customer.ip || "0.0.0.0",
    },
    shippingAddress: {
      contactName: `${req.customer.name} ${req.customer.surname}`,
      city: req.customer.city,
      country: req.customer.country,
      address: req.customer.address,
      zipCode: req.customer.zipCode || "00000",
    },
    billingAddress: {
      contactName: `${req.customer.name} ${req.customer.surname}`,
      city: req.customer.city,
      country: req.customer.country,
      address: req.customer.address,
      zipCode: req.customer.zipCode || "00000",
    },
    basketItems: req.items.map((item) => ({
      id: item.id,
      name: item.name,
      category1: item.category || "Takviye",
      itemType: "PHYSICAL",
      price: item.price.toFixed(2),
    })),
    callbackUrl: req.callbackUrl,
  };

  const body = JSON.stringify(payload);
  const res = await fetch(`${BASE_URL}/payment/3dsecure/initialize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: generateAuthHeader(body),
    },
    body,
  });

  return res.json();
}

export async function verify3DPayment(paymentId: string, conversationId: string) {
  const payload = { locale: "tr", conversationId, paymentId };
  const body = JSON.stringify(payload);

  const res = await fetch(`${BASE_URL}/payment/3dsecure/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: generateAuthHeader(body),
    },
    body,
  });

  return res.json();
}
