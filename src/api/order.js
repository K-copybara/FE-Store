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

export const getRequests = async (storeId) => {
  try {
    const res = await authClient.get(
      `/order/api/merchant/orders/requests?storeId=${storeId}`
    );
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

export const postOrderCancel = async (orderId) => {
  try {
    const data = {
      cancelReason: '취소 사유',
    };
    const res = await authClient.post(
      `/order/v1/payments/order/${orderId}/cancel`,
      data
    );
    console.log(res);
    return res.data;
  } catch (err) {
    throw err;
  }
};
