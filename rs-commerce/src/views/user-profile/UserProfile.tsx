import ProfileComponent from 'components/profile-component/profileComponent';
import { useAppSelector } from 'hooks/typed-react-redux-hooks';
import { apiAuthSelector } from 'redux/selectors';
import { InputProfileType, ProfileComponentType } from 'components/profile-component/types';
import CustomLink from 'components/custom-link/custom-link';
import { ROUTE_PATH } from 'constants/constants';
import classes from './UserProfile.module.css';

export default function UserProfile(): JSX.Element {
  const { userData } = useAppSelector(apiAuthSelector);
  const customer = userData?.customer;

  const inputArrayPersonal: InputProfileType[] = [
    {
      title: 'First name',
      id: 'first-name',
      isSizeSmall: true,
      type: 'text',
      value: customer?.firstName || 'name',
      isDisabled: true,
    },
    {
      title: 'Last name',
      id: 'last-name',
      isSizeSmall: true,
      type: 'text',
      value: customer?.lastName || 'name',
      isDisabled: true,
    },
    {
      title: 'Date of birth',
      id: 'date-of-birth',
      isSizeSmall: false,
      type: 'data',
      value: customer?.dateOfBirth || '1900-01-01',
      isDisabled: true,
    },
  ];

  const inputArrayShippingAddress: InputProfileType[] = [
    {
      title: 'Country',
      id: 'country-ship',
      isSizeSmall: true,
      type: 'text',
      value: customer?.addresses[0]?.country || '',
      isDisabled: true,
    },
    {
      title: 'Post code',
      id: 'post-code-ship',
      isSizeSmall: true,
      type: 'text',
      value: customer?.addresses[0]?.postalCode || '000000',
      isDisabled: true,
    },
    {
      title: 'City',
      id: 'city-ship',
      isSizeSmall: true,
      type: 'text',
      value: customer?.addresses[0]?.city || 'city',
      isDisabled: true,
    },
    {
      title: 'Street',
      id: 'street-ship',
      isSizeSmall: true,
      type: 'text',
      value: customer?.addresses[0]?.streetName || 'street',
      isDisabled: true,
    },
  ];

  const inputArrayBillingAddress: InputProfileType[] = [
    {
      title: 'Country',
      id: 'country-billing',
      isSizeSmall: true,
      type: 'text',
      value: customer?.addresses[1]?.country || '',
      isDisabled: true,
    },
    {
      title: 'Post code',
      id: 'post-code-billing',
      isSizeSmall: true,
      type: 'text',
      value: customer?.addresses[1]?.postalCode || '000000',
      isDisabled: true,
    },
    {
      title: 'City',
      id: 'city-billing',
      isSizeSmall: true,
      type: 'text',
      value: customer?.addresses[1]?.city || 'city',
      isDisabled: true,
    },
    {
      title: 'Street',
      id: 'street-billing',
      isSizeSmall: true,
      type: 'text',
      value: customer?.addresses[1]?.streetName || 'street',
      isDisabled: true,
    },
  ];

  const moveToChangePersonalInfo = () => {
    console.log('change personal info');
  };

  const moveToChangeAddress = () => {
    console.log('change address');
  };

  const ProfileUsersComponents: ProfileComponentType[] = [
    {
      title: 'Personal information',
      inputArray: inputArrayPersonal,
      handler: moveToChangePersonalInfo,
    },
    {
      title: 'Address information',
      subtitle: 'Shipping address',
      defaultAddress: true,
      inputArray: inputArrayShippingAddress,
      handler: moveToChangeAddress,
    },
    {
      subtitle: 'Billing address',
      defaultAddress: false,
      inputArray: inputArrayBillingAddress,
    },
  ];

  return (
    <div className={classes['profile']}>
      <div className={classes['profile__column']}>
        {ProfileUsersComponents.map((item, index) => (
          <ProfileComponent
            title={item.title}
            subtitle={item.subtitle}
            inputArray={item.inputArray}
            defaultAddress={item.defaultAddress}
            key={item.title || item.subtitle || `address${index}`}
          />
        ))}
      </div>
      <div className={classes['profile__column']}>
        <CustomLink to={ROUTE_PATH.changePassword} text="Change password" elStyle="link" />
      </div>
    </div>
  );
}
