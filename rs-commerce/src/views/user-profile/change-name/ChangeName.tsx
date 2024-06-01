import { InputProfileType } from 'components/profile-component/types';
import ProfileComponent from 'components/profile-component/profileComponent';
import { useAppSelector } from 'hooks/typed-react-redux-hooks';
import { apiAuthSelector } from 'redux/selectors';
import { useState } from 'react';
import {
  errorMsgObj,
  regExpObj,
} from 'views/registration/components/RegistrationForm/components/InputRegistration/utils/checkFields';
import ButtonProfile from '../button-profile/ButtonProfile';
import classes from './changeName.module.css';

export default function ChangeName(): JSX.Element {
  const { userData } = useAppSelector(apiAuthSelector);
  const customer = userData?.customer;
  const [firstName, setFirstName] = useState(customer?.firstName || 'first-name');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastName, setLastName] = useState(customer?.lastName || 'last-name');
  const [lastNameError, setLastNameError] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(customer?.dateOfBirth || '2000-01-01');
  const [dateOfBirthError, setDateOfBirthError] = useState('');

  const [email, setEmail] = useState(customer?.email || 'example@mail.com');
  const [emailError, setEmailError] = useState('');

  const checkField = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<string>>,
    setError: React.Dispatch<React.SetStateAction<string>>,
    regExp: RegExp,
    errorMsg: string,
  ) => {
    const { value } = e.target;
    setState(value);
    if (regExp.test(value)) {
      setError('');
    } else setError(errorMsg);
  };

  const inputArrayAddress: InputProfileType[] = [
    {
      title: 'First name',
      id: 'first-name',
      isSizeSmall: false,
      type: 'text',
      isDisabled: false,
      errorMsg: firstNameError,
      value: firstName,
      handler: (e) =>
        checkField(e, setFirstName, setFirstNameError, regExpObj.firstName, errorMsgObj.firstName),
    },
    {
      title: 'Last name',
      id: 'last-name',
      isSizeSmall: false,
      type: 'text',
      isDisabled: false,
      errorMsg: lastNameError,
      value: lastName,
      handler: (e) =>
        checkField(e, setLastName, setLastNameError, regExpObj.lastName, errorMsgObj.lastName),
    },
    {
      title: 'Date of birth',
      id: 'date-of-birth',
      isSizeSmall: false,
      type: 'data',
      isDisabled: false,
      value: dateOfBirth,
      errorMsg: dateOfBirthError,
      handler: (e) =>
        checkField(
          e,
          setDateOfBirth,
          setDateOfBirthError,
          regExpObj.lastName,
          errorMsgObj.dateOfBirth,
        ),
    },
    {
      title: 'Email',
      id: 'email',
      isSizeSmall: false,
      type: 'email',
      isDisabled: false,
      value: email,
      errorMsg: emailError,
      handler: (e) => checkField(e, setEmail, setEmailError, regExpObj.email, errorMsgObj.email),
    },
  ];

  const clearFieldsOnPage = (): void => {
    setFirstName('');
    setLastName('');
    setDateOfBirth('');
    setEmail('');
  };

  const saveBtnClick = (): void => {
    console.log('save parameters');
  };

  return (
    <div className={classes['profile']}>
      <div className={classes['profile__column']}>
        <h1>Personal information</h1>
        <ProfileComponent inputArray={inputArrayAddress} flexVertical />
        <div className={classes['profile__password-btn-container']}>
          <ButtonProfile content="Cancel" colored={false} onClick={clearFieldsOnPage} />
          <ButtonProfile content="Save" colored onClick={saveBtnClick} />
        </div>
      </div>
    </div>
  );
}
