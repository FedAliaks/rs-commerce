import { useState } from 'react';
import { InputProps, TypeFields, DispatchObj } from 'types/registrationTypes';
import { useAppDispatch, useAppSelector } from 'hooks/typed-react-redux-hooks';
import { registrationFormActions } from 'redux/slices/registration-slice';
import { registrationFormSelector } from 'redux/selectors';
import classes from './styles.module.css';
import { checkData, checkRegistrationField } from './utils/checkFields';

export enum DispatchSameAddress {
  shippingCity = 'setBillingCity',
  shippingStreet = 'setBillingStreet',
  shippingPostCode = 'setBillingPostCode',
  shippingCountry = 'setBillingCountry',
}

function InputRegistration(props: InputProps): JSX.Element {
  const dispatch = useAppDispatch();
  const { sameAddressForShippingAndBilling } = useAppSelector(registrationFormSelector);

  const { input, errorClassName } = props;
  const { htmlFor, title, type, placeholder, smallSize } = input;
  let inputSize = classes['registration__input'];
  if (smallSize) {
    inputSize = `${classes['registration__input']} ${classes['registration__input_small']}`;
  }

  const [errorContent, setErrorContent] = useState('');

  /*   function clearField(e: React.FocusEvent<HTMLInputElement, Element>) {
    e.target.value = '';
    setErrorContent('');
    dispatch(registrationFormActions[DispatchObj[htmlFor]](''));
  } */

  const addDisabled = (): boolean =>
    sameAddressForShippingAndBilling && htmlFor.startsWith('billing');

  function checkValue(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target.value;

    if (htmlFor === 'dateOfBirth') {
      if (checkData(target, setErrorContent, htmlFor as TypeFields)) {
        dispatch(registrationFormActions[DispatchObj[htmlFor]](target));
      }
    } else if (checkRegistrationField(target, setErrorContent, htmlFor as TypeFields)) {
      dispatch(registrationFormActions[DispatchObj[htmlFor]](target));

      if (
        sameAddressForShippingAndBilling &&
        (htmlFor === 'shippingCity' ||
          htmlFor === 'shippingStreet' ||
          htmlFor === 'shippingPostCode' ||
          htmlFor === 'shippingCountry')
      ) {
        dispatch(registrationFormActions[DispatchSameAddress[htmlFor]](target));
      }
    }
  }

  return (
    <div>
      <p className={classes['input__title']}>{title}</p>
      <label htmlFor={htmlFor}>
        <div className={classes['input__block']}>
          <input
            className={inputSize}
            id={htmlFor}
            type={type}
            disabled={addDisabled()}
            placeholder={placeholder}
            onChange={(e) => checkValue(e)}
            /*             onFocus={(e) => clearField(e)} */
          />
        </div>
      </label>
      <p className={`${classes['input__error']} ${errorClassName}`}>{errorContent}</p>
    </div>
  );
}

export default InputRegistration;
