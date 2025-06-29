import axios from "axios";
import crypto from "crypto";

// 这里需根据实际情况填写微信商户号、API密钥等配置
const config = {
  appid: process.env.MINIAPP_APPID || "", // 小程序appid
  mchid: process.env.WX_MCHID || "", // 商户号
  notify_url: process.env.WX_PAY_NOTIFY_URL || "", // 支付结果通知地址
  apiKey: process.env.WX_API_KEY || "", // API密钥
};

/**
 * 生成微信小程序支付参数（统一下单）
 * @param openid 用户openid
 * @param out_trade_no 商户订单号
 * @param amount 支付金额（分）
 * @param description 商品描述
 */
export async function createWxPayUnifiedOrder({ openid, out_trade_no, amount, description }: { openid: string, out_trade_no: string, amount: number, description: string }) {
  // 这里只演示参数组装，实际生产建议用微信官方SDK或第三方库
  const url = "https://api.mch.weixin.qq.com/v3/pay/transactions/jsapi";
  const data = {
    appid: config.appid,
    mchid: config.mchid,
    description,
    out_trade_no,
    notify_url: config.notify_url,
    amount: {
      total: amount,
      currency: "CNY"
    },
    payer: {
      openid
    }
  };
  // 这里应实现微信签名与请求，建议用微信支付SDK
  // 这里只返回组装参数，实际应返回微信返回的prepay_id等
  return data;
}