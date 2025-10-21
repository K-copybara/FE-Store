import { authClient } from './client';

//주문조회
export const getOrders = async (storeId, status) => {
  try {
    const res = await authClient.get(
      `api/merchant/orders?storeId=${storeId}&status=${status}`
    );
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

//주문완료
export const postOrderComplete = async (orderId) => {
  try {
    const res = await authClient.post(`api/merchant/orders/${orderId}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

//요청조회
export const getRequests = async () => {
  try {
    const res = await authClient.get(`api/merchant/orders/requests`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

//요청 완료
export const postRequestComplete = async (requestId) => {
  try {
    const res = await authClient.post(
      `api/merchant/orders/${requestId}/request`
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const postOrderCancle = async (paymentKey, data) => {
  try {
    const res = await authClient.post(
      `v1/payments/${paymentKey}/cancel`,
      data
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};
