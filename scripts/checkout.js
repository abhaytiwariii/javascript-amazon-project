import {
  cart,
  removeFromCart,
  calculateCartQuantity,
  updateQuantity,
} from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

updateCheckout();

let cartSummayHTML = "";

cart.forEach((cartItem) => {
  let matchingProduct;

  let productId = cartItem.productId;

  products.forEach((product) => {
    if (product.id === productId) matchingProduct = product;
  });

  cartSummayHTML += `
        <div class="cart-item-container js-cart-item-container-${productId}">
          <div class="delivery-date">
            Delivery date: Tuesday, June 21
          </div>

          <div class="cart-item-details-grid">
            <img class="product-image"
              src="${matchingProduct.image}">

            <div class="cart-item-details">
              <div class="product-name">
                ${matchingProduct.name}
              </div>
              <div class="product-price">
                ${formatCurrency(matchingProduct.priceCents)}
              </div>
              <div class="product-quantity">
                <span>
                  Quantity: <span class="quantity-label js-quantity-label-${
                    matchingProduct.id
                  }">${cartItem.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary js-update-link js-update-link-${
                  matchingProduct.id
                }" data-product-id="${matchingProduct.id}">
                  Update
                </span>

                <input type="text" class="quantity-input js-quantity-input js-quantity-input-${
                  matchingProduct.id
                }" data-product-id="${matchingProduct.id}">
                <span class="link-primary quantity-input js-save-quantity-link" data-product-id="${
                  matchingProduct.id
                }">Save</span>

                <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${
                  matchingProduct.id
                }">
                  Delete
                </span>
              </div>
            </div>

            <div class="delivery-options">
              <div class="delivery-options-title">
                Choose a delivery option:
              </div>
              <div class="delivery-option">
                <input type="radio" checked
                  class="delivery-option-input"
                  name="delivery-option-${matchingProduct.id}">
                <div>
                  <div class="delivery-option-date">
                    Tuesday, June 21
                  </div>
                  <div class="delivery-option-price">
                    FREE Shipping
                  </div>
                </div>
              </div>
              <div class="delivery-option">
                <input type="radio"
                  class="delivery-option-input"
                  name="delivery-option-${matchingProduct.id}">
                <div>
                  <div class="delivery-option-date">
                    Wednesday, June 15
                  </div>
                  <div class="delivery-option-price">
                    $4.99 - Shipping
                  </div>
                </div>
              </div>
              <div class="delivery-option">
                <input type="radio"
                  class="delivery-option-input"
                  name="delivery-option-${matchingProduct.id}">
                <div>
                  <div class="delivery-option-date">
                    Monday, June 13
                  </div>
                  <div class="delivery-option-price">
                    $9.99 - Shipping
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`;
});

document.querySelector(".js-order-summary").innerHTML = cartSummayHTML;

//Adding event listner to all delete button in checkout.html and making it interactive
document.querySelectorAll(".js-delete-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    removeFromCart(productId);

    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );

    container.remove();

    updateCheckout();
  });
});

//function to update the quantity in CheckOut() inside header
function updateCheckout() {
  let cartQuantity = calculateCartQuantity();
  document.querySelector(
    ".js-show-quantity-in-checkout"
  ).textContent = `${cartQuantity} items`;
}

//Adding event listner to all update button in checkout.html and making it interactive
document.querySelectorAll(".js-update-link").forEach((updateLink) => {
  updateLink.addEventListener("click", () => {
    let productId = updateLink.getAttribute("data-product-id");

    document
      .querySelector(`.js-cart-item-container-${productId}`)
      .classList.add("is-editing-quantity");

    updateLink.classList.add("hidden");

    document
      .querySelector(`.js-quantity-label-${productId}`)
      .classList.add("hidden");
  });
});

//Adding event listner to all save button in checkout.html and making it interactive
document.querySelectorAll(".js-save-quantity-link").forEach((saveLink) => {
  saveLink.addEventListener("click", () => {
    let productId = saveLink.getAttribute("data-product-id");
    updateInputQuantity(productId);
  });
});

//Function to update the cart quantity after entering the value in input element
function updateInputQuantity(productId) {
  let inputQuantityElement = document.querySelector(
    `.js-quantity-input-${productId}`
  );

  let newQuantity = Number(inputQuantityElement.value);

  //if statement to check if the value inside the input element is greater than 0 or not
  if (newQuantity < 0) {
    alert("Quantity could not be less than 0");
    return;
  } else if (newQuantity === 0) {
    removeFromCart(productId);

    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );

    container.remove();

    updateCheckout();
    return;
  } else if (!Number.isFinite(newQuantity)) {
    alert("Quantity should be a number");
    return;
  }

  updateQuantity(productId, newQuantity);
  updateCheckout();

  document.querySelector(`.js-quantity-label-${productId}`).textContent =
    newQuantity;

  document
    .querySelector(`.js-cart-item-container-${productId}`)
    .classList.remove("is-editing-quantity");

  document
    .querySelector(`.js-update-link-${productId}`)
    .classList.remove("hidden");

  document
    .querySelector(`.js-quantity-label-${productId}`)
    .classList.remove("hidden");

  inputQuantityElement.value = "";
  console.log(cart);
}

//Adding event listner keydown to all input Element in checkout.html so that when we click enter on it, it updates quantity
document.querySelectorAll(`.js-quantity-input`).forEach((inputElement) => {
  inputElement.addEventListener("keydown", (event) => {
    let productId = inputElement.getAttribute("data-product-id");

    if (event.key === "Enter") {
      updateInputQuantity(productId);
    }
  });
});
