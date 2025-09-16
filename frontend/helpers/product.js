const helper = {};

/**
 * @param {number} price
 * @returns {string}
 */
helper.displayPrice = (price) => {
  return price.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
};

export const productHelper = helper;
