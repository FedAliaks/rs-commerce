import ProfileComponent from 'components/profile-component/profileComponent';
import { useAppSelector } from 'hooks/typed-react-redux-hooks';
import { apiAuthSelector } from 'redux/selectors';
import { InputProfileType, ProfileComponentType } from 'components/profile-component/types';
import CustomLink from 'components/custom-link/custom-link';
import { ROUTE_PATH } from 'constants/constants';
import classes from './UserProfile.module.css';
import UserProfileHeader from './user-profile-header/UserProfileHeader';

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

  const ProfileUsersComponents: ProfileComponentType[] = [
    {
      title: 'Personal information',
      inputArray: inputArrayPersonal,

      linkTo: ROUTE_PATH.changeName,
    },
  ];

  const arrayAddresses = userData?.customer.addresses;

  if (arrayAddresses)
    arrayAddresses.forEach((item) => {
      const address: InputProfileType[] = [
        {
          title: 'Country',
          id: 'country-billing',
          isSizeSmall: true,
          type: 'text',
          value: item.country || '',
          isDisabled: true,
        },
        {
          title: 'Post code',
          id: 'post-code-billing',
          isSizeSmall: true,
          type: 'text',
          value: item.postalCode || '000000',
          isDisabled: true,
        },
        {
          title: 'City',
          id: 'city-billing',
          isSizeSmall: true,
          type: 'text',
          value: item.city || 'city',
          isDisabled: true,
        },
        {
          title: 'Street',
          id: 'street-billing',
          isSizeSmall: true,
          type: 'text',
          value: item.streetName || 'street',
          isDisabled: true,
        },
      ];

      ProfileUsersComponents.push({
        title: 'Address information',
        subtitle: customer?.shippingAddressIds?.includes(item?.id || '')
          ? 'Shipping address'
          : 'Billing address',
        defaultAddress:
          (item.id || '') === customer?.defaultBillingAddressId ||
          (item.id || '') === customer?.defaultShippingAddressId,
        inputArray: address,
        addressId: item.id,

        linkTo: ROUTE_PATH.changeAddress,
      });
    });

  return (
    <div className={classes['container']}>
      <UserProfileHeader title="Profile" subtitle="Main > Profile" />

      <div className={classes['profile']}>
        <div className={classes['profile__column']}>
          {ProfileUsersComponents.map((item, index) => (
            <ProfileComponent
              title={item.title}
              subtitle={item.subtitle}
              inputArray={item.inputArray}
              defaultAddress={item.defaultAddress}
              key={`address${index}` || item.title || item.subtitle}
              linkTo={item.linkTo}
              addressId={item.addressId}
            />
          ))}
        </div>
        <div className={classes['profile__column']}>
          <CustomLink to={ROUTE_PATH.changePassword} text="Change password" elStyle="link" />
          <div>
            <CustomLink to={ROUTE_PATH.addNewAddress} text="Add new address" elStyle="link" />
          </div>
        </div>
      </div>
    </div>
  );
}
