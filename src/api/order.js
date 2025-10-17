import { authClient } from './client';

export const getOrders = async (storeId, status) => {
  try {
    const res = await authClient.get(
      `/order/api/merchant/orders?storeId=${storeId}&status=${status}`
    );
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const postOrderComplete = async (orderId) => {
  try {
    const res = await authClient.post(`/order/api/merchant/orders/${orderId}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getRequests = async () => {
  try {
    const res = await authClient.get(`/order/api/merchant/orders/requests`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const postRequestComplete = async (requestId) => {
  try {
    const res = await authClient.post(
      `/order/api/merchant/orders/${requestId}/request`
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const postOrderCancle = async (paymentKey, data) => {
  try {
    const res = await authClient.post(
      `/order/v1/payments/${paymentKey}/cancel`,
      data
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};
