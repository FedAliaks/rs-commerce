import { RootState } from './configure-store';

export const loginFormSelector = (state: RootState) => state.loginForm;
export const apiAuthSelector = (state: RootState) => state.apiAuth;
