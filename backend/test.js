import axios from "axios";

const BASE_URL = "http://localhost:3000";
const API_KEY = "sk_1c82cd078a5c3a5a";

const endpoints = [
  "/api/orders",
  "/api/users",
  "/api/products",
  "/api/payments",
  "/api/cart",
  "/api/login"
];

const methods = ["POST"];

const TOTAL_REQUESTS = 100;

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomStatus() {
  const statuses = [200, 201, 400, 401, 404, 500];
  return randomItem(statuses);
}

function randomResponseTime() {
  return Math.floor(Math.random() * 800) + 20;
}

async function sendRequest(i) {
  const endpoint = randomItem(endpoints);
  const method = randomItem(methods);

  const payload = {
    endpoint,
    method,
    statusCode: randomStatus(),
    responseTime: randomResponseTime()
  };

  try {
    await axios({
      method: "POST",
      url: `${BASE_URL}/api/analytics`,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY
      },
      data: payload
    });

    console.log(`Request ${i} -> ${endpoint}`);
  } catch (err) {
    console.log(`Error request ${i}: ${endpoint}`);
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTest() {
  const promises = [];

  for (let i = 0; i < TOTAL_REQUESTS; i++) {
   await delay(100);
  promises.push(sendRequest(i));
  }

  await Promise.all(promises);

  console.log("✅ Finished sending 100 requests");
}

runTest();