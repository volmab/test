"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { StoreFreeShippingPrice } from "@starter/types/shipping-option/http"
import { getAuthHeaders, getCacheOptions } from "./cookies"

export const listCartShippingMethods = async (cartId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("fulfillment")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreShippingOptionListResponse>(
      `/store/shipping-options`,
      {
        method: "GET",
        query: { cart_id: cartId },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ shipping_options }) => shipping_options)
    .catch(() => {
      return null
    })
}

export const listCartFreeShippingPrices = async (
  cartId: string
): Promise<StoreFreeShippingPrice[]> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("freeShipping")),
  }

  return sdk.client
    .fetch<{
      prices: StoreFreeShippingPrice[]
    }>(`/store/free-shipping/prices`, {
      method: "GET",
      query: { cart_id: cartId },
      headers,
      next,
      cache: "force-cache",
    })
    .then((data) => data.prices)
}
