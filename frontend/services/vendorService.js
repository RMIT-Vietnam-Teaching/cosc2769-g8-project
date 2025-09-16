import { fetchHelper } from '#/helpers/fetch';

export const vendorService = {
  fetchProducts: async () => {
    /** @type {app.Response<import("#/pages/PageVendor/types").VendorProduct[]> } */
    const res = await fetchHelper.get('/api/vendor/products').json();

    if (res.success) {
      return res.data;
    }
    return [];
  },

  /** @param {string} id */
  fetchProduct: async (id) => {
    /** @type {app.Response<import("#/pages/PageVendor/types").VendorProduct[]> } */
    const res = await fetchHelper.get(`/api/vendor/product/${id}`).json();

    if (res.success) {
      return res.data;
    }
    return null;
  },
};
