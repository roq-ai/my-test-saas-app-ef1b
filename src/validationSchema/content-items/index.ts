import * as yup from 'yup';

export const contentItemValidationSchema = yup.object().shape({
  title: yup.string().required(),
  content: yup.string().required(),
  status: yup.string().required(),
  creator_id: yup.string().nullable(),
  editor_id: yup.string().nullable(),
  reviewer_id: yup.string().nullable(),
  company_id: yup.string().nullable(),
});
