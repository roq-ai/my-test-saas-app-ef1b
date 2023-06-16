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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getContentItemById, updateContentItemById } from 'apiSdk/content-items';
import { Error } from 'components/error';
import { contentItemValidationSchema } from 'validationSchema/content-items';
import { ContentItemInterface } from 'interfaces/content-item';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { CompanyInterface } from 'interfaces/company';
import { getUsers } from 'apiSdk/users';
import { getCompanies } from 'apiSdk/companies';

function ContentItemEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ContentItemInterface>(
    () => (id ? `/content-items/${id}` : null),
    () => getContentItemById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: ContentItemInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateContentItemById(id, values);
      mutate(updated);
      resetForm();
      router.push('/content-items');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<ContentItemInterface>({
    initialValues: data,
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
            Edit Content Item
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'content_item',
  operation: AccessOperationEnum.UPDATE,
})(ContentItemEditPage);
