import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createContentItem } from 'apiSdk/content-items';
import { Error } from 'components/error';
import { contentItemValidationSchema } from 'validationSchema/content-items';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { CompanyInterface } from 'interfaces/company';
import { getUsers } from 'apiSdk/users';
import { getCompanies } from 'apiSdk/companies';
import { ContentItemInterface } from 'interfaces/content-item';

function ContentItemCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ContentItemInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createContentItem(values);
      resetForm();
      router.push('/content-items');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ContentItemInterface>({
    initialValues: {
      title: '',
      content: '',
      status: '',
      creator_id: (router.query.creator_id as string) ?? null,
      editor_id: (router.query.editor_id as string) ?? null,
      reviewer_id: (router.query.reviewer_id as string) ?? null,
      company_id: (router.query.company_id as string) ?? null,
    },
    validationSchema: contentItemValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Content Item
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="title" mb="4" isInvalid={!!formik.errors?.title}>
            <FormLabel>Title</FormLabel>
            <Input type="text" name="title" value={formik.values?.title} onChange={formik.handleChange} />
            {formik.errors.title && <FormErrorMessage>{formik.errors?.title}</FormErrorMessage>}
          </FormControl>
          <FormControl id="content" mb="4" isInvalid={!!formik.errors?.content}>
            <FormLabel>Content</FormLabel>
            <Input type="text" name="content" value={formik.values?.content} onChange={formik.handleChange} />
            {formik.errors.content && <FormErrorMessage>{formik.errors?.content}</FormErrorMessage>}
          </FormControl>
          <FormControl id="status" mb="4" isInvalid={!!formik.errors?.status}>
            <FormLabel>Status</FormLabel>
            <Input type="text" name="status" value={formik.values?.status} onChange={formik.handleChange} />
            {formik.errors.status && <FormErrorMessage>{formik.errors?.status}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'creator_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'editor_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'reviewer_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <AsyncSelect<CompanyInterface>
            formik={formik}
            name={'company_id'}
            label={'Select Company'}
            placeholder={'Select Company'}
            fetcher={getCompanies}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'content_item',
  operation: AccessOperationEnum.CREATE,
})(ContentItemCreatePage);
