/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Nguyễn Hoàng Long
# ID: s4131459
*/
import debug from 'debug';
import { z } from 'zod/v4';

import validationHelper from '#root/helpers/validation.helper.js';
import { logger } from '#root/logger.js';
import { Product } from '#root/models.js';

const vendorController = {};

/** @type {app.AsyncRequestHandler} */
vendorController.allProducts = async (req, res) => {
  const id = req.session.user?.id;
  try {
    const list = await Product.find({ vendor: id });
    res.jsonData(list);
  } catch (e) {
    logger.error('[Vendor All Products Error] %o', e);
    res.jsonErrorMsg(['Unable to list products for this vendor!']);
  }
};

/** @type {app.AsyncRequestHandler} */
vendorController.productById = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id ?? '' });
    res.jsonData(product);
  } catch (e) {
    logger.error('[Vendor Product Error] %o', e);
    res.jsonErrorMsg(['Unable to list products for this vendor!']);
  }
};

const newProductSchema = z.strictObject({
  name: z.string().min(10, 'At least 10 characters!').max(20, 'At most 20 characters!'),
  price: z.coerce.number().min(1, 'At least 1đ!'),
  description: z.string().max(500, 'At most 500 characters!'),
  mainImage: z.string().min(1, 'Please select main image!'),
  image: z.array(z.string()),
});

const log = debug('controller:vendor');

/** @type {app.AsyncRequestHandler} */
vendorController.new = async (req, res) => {
  const files = Array.isArray(req.files) ? {} : req.files ?? {};

  log('Extra image', files.image);

  const body = {
    ...req.body,
    mainImage: files?.mainImage?.at(0)?.filename ?? '',
    image: (files.image ?? []).map(f => f.filename),
  };

  const validation = newProductSchema.safeParse(body);

  if (validation.success) {
    try {
      const { data } = validation;
      await Product.create({
        vendor: req.session.user?.id,
        name: data.name,
        price: data.price,
        description: data.description,
        image: [data.mainImage, ...data.image],
      });

      return res.jsonOk();
    } catch (e) {
      logger.error('[Vendor New Product Error] %o', e);
      return res.jsonInternalErrorMsg(['Unable to create this product']);
    }
  } else {
    return res.jsonError(validationHelper.groupIssues(validation.error.issues));
  }
};

export default vendorController;
