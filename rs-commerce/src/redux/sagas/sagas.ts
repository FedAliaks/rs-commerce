import {
  CategoryPagedQueryResponse,
  ClientResponse,
  CustomerSignInResult,
  ErrorResponse,
  ProductProjectionPagedQueryResponse,
} from '@commercetools/platform-sdk';
import { PayloadAction } from '@reduxjs/toolkit';
import { apiLogin, getAllCategories, getAllProductsProjections } from 'api/api';
import { MAX_QUERY_LIMIT, TOASTS_TEXT } from 'constants/constants';
import toast from 'react-hot-toast';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import { apiAuthActions } from 'redux/slices/api-auth-slice';
import { apiCategoriesProductsActions } from 'redux/slices/api-categories-products-slice';
import { loginFormActions } from 'redux/slices/login-form-slice';
import { LoginData, QueryParamsProductsProjections } from 'types/types';

function* workStartAuthFetchSaga(action: PayloadAction<{ data: LoginData }>) {
  try {
    const response: ClientResponse<CustomerSignInResult> = yield call(
      apiLogin,
      action.payload.data,
    );
    yield put(apiAuthActions.setUserData(response.body));
    yield put(apiAuthActions.setIsAuth(true));
    yield put(loginFormActions.resetLoginFormSlice());
    yield toast.success(TOASTS_TEXT.authOkMessage);
  } catch (e: unknown) {
    const error = e as ErrorResponse;
    yield put(apiAuthActions.setIsAuthError400(true));
    yield put(loginFormActions.setLoginFormErrorMessage(TOASTS_TEXT.authError400Message));
    yield toast.error(error.message);
  } finally {
    yield put(apiAuthActions.setIsLoadingAuth(false));
    yield put(apiAuthActions.resetLoginData());
  }
}

function* workStartGetCategoriesFetchSaga() {
  try {
    const response: ClientResponse<CategoryPagedQueryResponse> = yield call(() =>
      getAllCategories({ limit: MAX_QUERY_LIMIT }),
    );
    yield put(
      apiCategoriesProductsActions.getCategoriesSuccess({ categories: response.body.results }),
    );
  } catch (e: unknown) {
    const error = e as ErrorResponse;
    yield toast.error(error.message);
  } finally {
    yield put(apiCategoriesProductsActions.setIsLoadingCategories(false));
  }
}

function* workStartGetProductsFetchSaga(
  action: PayloadAction<{ data: QueryParamsProductsProjections }>,
) {
  try {
    const response: ClientResponse<ProductProjectionPagedQueryResponse> = yield call(
      getAllProductsProjections,
      action.payload.data,
    );
    yield put(apiCategoriesProductsActions.getProductsSuccess({ products: response.body.results }));
    const curProductsTotal = response.body.total;
    if (curProductsTotal)
      yield put(apiCategoriesProductsActions.setCurProductsTotal(curProductsTotal));
  } catch (e: unknown) {
    const error = e as ErrorResponse;
    yield toast.error(error.message);
  } finally {
    yield put(apiCategoriesProductsActions.setIsLoadingProducts(false));
  }
}

function* watchStartAuthFetchSaga() {
  yield takeEvery(apiAuthActions.startAuth, workStartAuthFetchSaga);
}

function* watchStartGetCategoriesFetchSaga() {
  yield takeEvery(
    apiCategoriesProductsActions.startCategoriesFetch,
    workStartGetCategoriesFetchSaga,
  );
}

function* watchStartGetProductsFetchSaga() {
  yield takeEvery(apiCategoriesProductsActions.startProductsFetch, workStartGetProductsFetchSaga);
}

export default function* rootSaga() {
  yield all([
    watchStartAuthFetchSaga(),
    watchStartGetCategoriesFetchSaga(),
    watchStartGetProductsFetchSaga(),
  ]);
}
