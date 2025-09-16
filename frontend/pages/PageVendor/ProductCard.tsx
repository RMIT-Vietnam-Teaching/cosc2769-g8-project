import { Link } from "react-router";

import { VendorProduct } from "./types";

import { productHelper } from "#/helpers/product";

export const ProductCard = ({ product }: { product: VendorProduct }) => {
  return (
    <Link
      className="col card product-card shadow-sm text-decoration-none stretched-link p-0 m-0"
      to={`/vendor/product/${product._id}`}
    >
      {product.image.length > 0 ? (
        <img
          src={product.image[0]}
          className="card-img-top product-image"
          alt=""
        />
      ) : (
        <div className="card-img-top product-image bg-secondary d-flex justify-content-center align-items-center light">
          Product
        </div>
      )}
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-title">
          {productHelper.displayPrice(product.price)}
        </p>
      </div>
    </Link>
  );
};
