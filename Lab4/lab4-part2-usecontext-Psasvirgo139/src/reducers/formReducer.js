import { validateField } from '../utils/validators';

export const initialState = {
  values: {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
  errors: {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
  touched: {
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
  },
  status: 'idle', // 'idle' | 'submitting' | 'success' | 'error'
};

export function formReducer(state, action) {
  switch (action.type) {
    case 'CHANGE': {
      const { field, value } = action.payload;
      const newValues = {
        ...state.values,
        [field]: value,
      };

      const newErrors = { ...state.errors };

      if (state.touched[field]) {
        newErrors[field] = validateField(field, value, newValues);
      }

      if (field === 'password' && state.touched.confirmPassword) {
        newErrors.confirmPassword = validateField(
          'confirmPassword',
          state.values.confirmPassword,
          newValues
        );
      }

      return {
        ...state,
        values: newValues,
        errors: newErrors,
      };
    }

    case 'BLUR': {
      const { field } = action.payload;
      const newTouched = {
        ...state.touched,
        [field]: true,
      };

      const error = validateField(field, state.values[field], state.values);
      const newErrors = {
        ...state.errors,
        [field]: error,
      };

      return {
        ...state,
        touched: newTouched,
        errors: newErrors,
      };
    }

    case 'VALIDATE_ALL': {
      const newErrors = {
        fullName: validateField('fullName', state.values.fullName, state.values),
        email: validateField('email', state.values.email, state.values),
        password: validateField('password', state.values.password, state.values),
        confirmPassword: validateField(
          'confirmPassword',
          state.values.confirmPassword,
          state.values
        ),
      };

      const hasErrors = Object.values(newErrors).some((err) => err !== '');

      const newTouched = {
        fullName: true,
        email: true,
        password: true,
        confirmPassword: true,
      };

      return {
        ...state,
        touched: newTouched,
        errors: newErrors,
        status: hasErrors ? 'error' : state.status,
      };
    }

    case 'SET_STATUS': {
      return {
        ...state,
        status: action.payload.status,
      };
    }

    case 'RESET': {
      return { ...initialState };
    }

    default:
      return state;
  }
}
