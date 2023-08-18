import * as yup from 'yup';

const validate = (fields, i18nextInstance, existingUrls) => {
  const schema = yup.object().shape({
    input: yup.string()
      .url(i18nextInstance.t('inputNotValid'))
      .notOneOf(existingUrls, i18nextInstance.t('inputExist'))
      .required(i18nextInstance.t('inputNotValid')),

  });

  return schema.validate(fields, i18nextInstance);
};

export default validate;
