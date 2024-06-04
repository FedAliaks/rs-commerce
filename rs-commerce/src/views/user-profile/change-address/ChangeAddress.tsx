import { useAppSelector } from 'hooks/typed-react-redux-hooks';
import { apiAuthSelector } from 'redux/selectors';
import { InputProfileType } from 'components/profile-component/types';
import { useLocation } from 'react-router-dom';
import { countryArr } from 'views/registration/components/RegistrationForm/components/InputRegistration/CountryInput';
import { useState } from 'react';
import {
  errorMsgObj,
  regExpObj,
} from 'views/registration/components/RegistrationForm/components/InputRegistration/utils/checkFields';
import InputProfile from 'components/profile-component/input-profile/inputProfile';
import CheckboxDefault from 'components/checkbox-defaut/CheckboxDefault';
import ButtonDefault from 'components/button-default/ButtonDefault';
import apiRootWithExistingTokenFlow from 'SDK/apiRootWithExistingTokenFlow';
import UserProfileHeader from '../user-profile-header/UserProfileHeader';
import ButtonProfile from '../button-profile/ButtonProfile';
import classes from '../UserProfile.module.css';
import classesLocal from './change-address.module.css';

export default function ChangeAddress() {
  const { userData } = useAppSelector(apiAuthSelector);
  const errCountryDefault = 'You can use only "BY" and "US"';

  const location = useLocation();
  const addressID = location.state.addressId;
  const [resultRequest, setResultRequest] = useState('result request');
  const [isActiveSaveBtn, setIsActiveSaveBtn] = useState(true);

  const address = userData?.customer.addresses.filter((item) => item.id === addressID);

  const [streetErr, setStreetErr] = useState('');
  const [cityErr, setCityErr] = useState('');
  const [postCodeErr, setPostCodeErr] = useState('');
  const [countryErr, setCountryErr] = useState('');
  const [isDefaultAddress, setIsDefaultAddress] = useState(true);

  const [street, setStreet] = useState(address ? address[0]?.streetName : '');
  const [city, setCity] = useState(address ? address[0]?.city : '');
  const [postCode, setPostCode] = useState(address ? address[0]?.postalCode : '');
  const [country, setCountry] = useState(address ? address[0]?.country : countryArr[0]);

  const checkActiveSaveBtn = () => {
    if (streetErr || cityErr || countryErr || postCodeErr) {
      setIsActiveSaveBtn(false);
    } else setIsActiveSaveBtn(true);
  };

  const postRequest = () => {
    console.log('sent request');
    if (userData)
      apiRootWithExistingTokenFlow()
        .customers()
        .withId({ ID: userData.customer.id })
        .post({
          body: {
            version: userData?.customer.version,
            actions: [
              {
                action: 'changeAddress',
                addressId: addressID,
                address: {
                  city,
                  country: country || 'US',
                  streetName: street,
                  postalCode: postCode,
                },
              },
            ],
          },
        })
        .execute()
        .then(() => {
          setResultRequest('Your address has already updated');
          setTimeout(() => setResultRequest(''), 3000);
        });
  };

  const checkStreet = (value: string) => {
    setStreet(value);
    if (regExpObj.billingStreet.test(value)) {
      setStreetErr('');
    } else setStreetErr(errorMsgObj.billingStreet);
    checkActiveSaveBtn();
  };

  const checkPostCode = (value: string) => {
    setPostCode(value);
    if (regExpObj.billingPostCode.test(value)) {
      setPostCodeErr('');
      checkActiveSaveBtn();
    } else setPostCodeErr(errorMsgObj.billingPostCode);
  };

  const checkCity = (value: string) => {
    setCity(value);
    if (regExpObj.billingCity.test(value)) {
      setCityErr('');
      checkActiveSaveBtn();
    } else setCityErr(errorMsgObj.billingCity);
    checkActiveSaveBtn();
  };

  const checkCountry = (value: string) => {
    setCountry(value);
    if (value === 'US' || value === 'BY') {
      setCountryErr('');
      checkActiveSaveBtn();
    } else {
      setCountryErr(errCountryDefault);
    }
  };

  const clearBtn = () => {
    setCity('');
    setCountry('');
    setPostCode('');
    setCountry('');
    checkCity('');
    checkCountry('');
    checkPostCode('');
    checkStreet('');
  };

  const addressArray: InputProfileType[] = [
    {
      title: 'Street',
      id: 'Street',
      isSizeSmall: true,
      type: 'text',
      isDisabled: false,
      errorMsg: streetErr,
      value: street,
      handler: (e) => checkStreet(e.target.value),
    },
    {
      title: 'Post code',
      id: 'PostCode',
      isSizeSmall: true,
      type: 'text',
      isDisabled: false,
      errorMsg: postCodeErr,
      value: postCode,
      handler: (e) => checkPostCode(e.target.value),
    },
    {
      title: 'City',
      id: 'City',
      isSizeSmall: true,
      type: 'text',
      isDisabled: false,
      errorMsg: cityErr,
      value: city,
      handler: (e) => checkCity(e.target.value),
    },
    {
      title: 'Country',
      id: `country`,
      isSizeSmall: true,
      type: 'text',
      isDisabled: false,
      errorMsg: countryErr,
      value: country,
      handler: (e) => checkCountry(e.target.value),
    },
  ];

  const toggleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('toggle');
    setIsDefaultAddress(!e.target.checked);
    console.log(isDefaultAddress);
  };

  return (
    <div>
      <UserProfileHeader title="Change Address" subtitle="Main > Profile > Edit address" />
      <div className={classesLocal['add-address__container']}>
        <h1>Address</h1>
        <CheckboxDefault content="Set as default address" onChange={toggleCheckbox} />

        <div className={classes['address']}>
          {addressArray.map((item) => (
            <InputProfile
              title={item.title}
              id={item.id}
              isSizeSmall={item.isSizeSmall}
              type={item.type}
              value={item.value}
              key={item.id}
              errorMsg={item.errorMsg}
              isDisabled={item.isDisabled}
              handler={item.handler}
            />
          ))}

          <div />
        </div>
        <p className={classesLocal['response']}>{resultRequest}</p>
      </div>

      <div className={classes['profile__password-btn-container']}>
        <ButtonProfile content="Cancel" colored={false} onClick={clearBtn} />
        <ButtonDefault content="Save" colored onClick={postRequest} isActive={isActiveSaveBtn} />
      </div>
    </div>
  );
}
