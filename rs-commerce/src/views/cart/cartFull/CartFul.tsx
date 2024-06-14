import apiRootWithExistingTokenFlow from 'SDK/apiRootWithExistingTokenFlow';
import { useEffect, useState } from 'react';
import { Cart, LineItem } from '@commercetools/platform-sdk';
import ButtonBig from 'components/button-big/button-big';
import classes from './cartFull.module.css';
import CartProduct from './cartProduct/CartProduct';
import CartTotal from './cartTotal/cartTotal';

export default function CartFull(): JSX.Element {
  const [productArr, setProductArray] = useState<LineItem[]>();
  const [cartBody, setCartBody] = useState<Cart>();
  const [update, setUpdate] = useState(0);

  const clearCart = () => {
    console.log('clear Cart');
  };

  const updateCart = (): void => {
    setUpdate(Math.random());
  };

  useEffect(() => {
    // getCart
    apiRootWithExistingTokenFlow()
      .me()
      .carts()
      .get()
      .execute()
      .then((res) => {
        if (res.body.results[0]?.lineItems) {
          setProductArray(res.body.results[0]?.lineItems);
          setCartBody(res.body.results[0]);
          console.log('product Arr');
          console.log(productArr);
          console.log(res.body.results[0]);
        }
      });
  }, [update]);

  const headerColumnArr = ['Product', 'Price', 'Quantity', 'Total cost'];

  return (
    <div className={classes['cart-full__container']}>
      <div>
        <div className={classes['cart-full__product-column-header']}>
          {headerColumnArr.map((item, index) => (
            <p className={index === 0 ? `${classes['column1']}` : undefined} key={`header${item}`}>
              {item}
            </p>
          ))}
        </div>
        <div className={classes['products__container']}>
          {productArr?.map((item) => (
            <CartProduct product={item} idCart={cartBody?.id || ''} updateCart={updateCart} />
          ))}
          <div className={classes['product__clear-btn-container']}>
            <ButtonBig content="Clear Shopping Cart" isActiveStyle onClick={clearCart} />
          </div>
        </div>
      </div>
      <CartTotal
        discounted={cartBody?.discountOnTotalPrice?.discountedAmount.centAmount}
        totalPrice={cartBody?.totalPrice.centAmount || 100}
        idCart={cartBody?.id || ''}
      />
    </div>
  );
}
