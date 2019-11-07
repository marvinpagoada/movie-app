import auth from '@react-native-firebase/auth';
import { setUser } from '~/actions/auth-actions';

import {
  REGISTER_USER_CHANGE_NAME,
  REGISTER_USER_CHANGE_EMAIL,
  REGISTER_USER_CREATE_ACCOUNT,
  REGISTER_USER_CHANGE_PASSWORD,
  REGISTER_USER_CREATE_ACCOUNT_FAILURE,
  REGISTER_USER_CREATE_ACCOUNT_SUCCESS,
} from './types';

export const changeName = name => ({ type: REGISTER_USER_CHANGE_NAME, payload: name });

export const changeEmail = email => ({ type: REGISTER_USER_CHANGE_EMAIL, payload: email });

export const changePassword = password => ({
  type: REGISTER_USER_CHANGE_PASSWORD,
  payload: password,
});

export const register = ({ navigate }) => (dispatch, getState) => {
  const { registerReducer } = getState();
  const { name, email, password } = registerReducer;

  dispatch({ type: REGISTER_USER_CREATE_ACCOUNT });
  auth().createUserWithEmailAndPassword(email, password)
    .then(async ({ user }) => {
      await user.updateProfile({ displayName: name });
      dispatch(setUser(user));
      dispatch({ type: REGISTER_USER_CREATE_ACCOUNT_SUCCESS });
      navigate('home');
    })
    .catch(({ userInfo = {} }) => {
      const { message } = userInfo;

      dispatch({ type: REGISTER_USER_CREATE_ACCOUNT_FAILURE, payload: message });
    });
};