// @flow
import type {
  AuthFormFields,
  Dispatch,
  Form as FormType,
  State,
} from '../types';
import Form from './form';
import Set from './set';
import TextInputBig from './text-input-big';
import withTheme, { type ThemeContext } from './with-theme';
import { SignInButton, SignUpButton } from './buttons';
import { compose } from 'ramda';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, type IntlShape } from 'react-intl';
import { initialFormId } from '../lib/form';

const messages = defineMessages({
  emailPlaceholder: {
    defaultMessage: 'email',
    id: 'authForm.emailPlaceholder',
  },
  passowordPlaceholder: {
    defaultMessage: 'password',
    id: 'authForm.passowordPlaceholder',
  },
});

// https://blog.mariusschulz.com/2016/03/20/how-to-remove-webkits-banana-yellow-autofill-background
const overrideWebkitYellowAutofill = theme => ({
  WebkitBoxShadow: `inset 0 0 0px 9999px ${theme.colors[
    theme.page.backgroundColor
  ]}`,
  WebkitTextFillColor: theme.colors[theme.text.color],
});

const TextInputBigAuth = ({ theme, ...props }) =>
  <TextInputBig
    {...props}
    maxWidth={26}
    style={overrideWebkitYellowAutofill(theme)}
  />;

type AuthFormProps = {
  dispatch: Dispatch,
  form: FormType<AuthFormFields>,
  intl: IntlShape,
};

const AuthForm = (
  { dispatch, form, intl }: AuthFormProps,
  { theme }: ThemeContext,
) => {
  const setUserForm = (prop: $Keys<AuthFormFields>) => value => {
    dispatch({
      type: 'SET_AUTH_FORM',
      // $FlowFixMe Flow bug.
      fields: { ...form.fields, [prop]: value },
    });
  };

  return (
    <Form>
      <Set vertical spaceBetween={0}>
        <TextInputBigAuth
          error=""
          name="email"
          onChange={setUserForm('email')}
          placeholder={intl.formatMessage(messages.emailPlaceholder)}
          theme={theme}
          type="email"
          value={form.fields.email}
        />
        <TextInputBigAuth
          error=""
          name="password"
          onChange={setUserForm('password')}
          placeholder={intl.formatMessage(messages.passowordPlaceholder)}
          theme={theme}
          type="password"
          value={form.fields.password}
        />
      </Set>
      <Set>
        <SignInButton primary />
        <SignUpButton primary />
      </Set>
    </Form>
  );
};

withTheme(AuthForm);

export default compose(
  connect(({ auth: { form } }: State) => ({
    form: form.changed[initialFormId] || form.initial,
  })),
  injectIntl,
)(AuthForm);