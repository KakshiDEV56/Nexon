import React, { useState } from 'react';
import { Box, Button, Flex, Heading, Image, Link, Text } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { Link as RLink, useNavigate } from 'react-router-dom';
import { InputField } from '../components/common/InputField';
import { toErrorMap } from '../lib/utils/toErrorMap';
import { userStore } from '../lib/stores/userStore';
import { RegisterSchema } from '../lib/utils/validation/auth.schema';
import { register } from '../lib/api/handler/auth';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const setUser = userStore((state) => state.setUser);
  const [error, showError] = useState(false);

  return (
    <Flex minHeight="100vh" width="full" align="center" justifyContent="center" bg="#09090b">
      <Box px={4} width="full" maxWidth="450px" textAlign="center">
        <Flex mb="8" justify="center">
          <Image src={`${process.env.PUBLIC_URL}/logo.png`} w="80px" />
        </Flex>
        <Box 
          p={8} 
          borderRadius="4px" 
          background="#18181b" 
          border="1px solid #27272a"
          boxShadow="0 4px 20px -2px rgba(0,0,0,0.5)"
        >
          <Box textAlign="center" mb={6}>
            <Heading fontSize="24px" fontWeight="600" color="#fafafa">Welcome to Nexon</Heading>
          </Box>
          <Box textAlign="left">
            <Formik
              initialValues={{
                email: '',
                username: '',
                password: '',
              }}
              validationSchema={RegisterSchema}
              onSubmit={async (values, { setErrors }) => {
                try {
                  const { data } = await register(values);
                  if (data) {
                    setUser(data);
                    navigate('/channels/me');
                  }
                } catch (err: any) {
                  if (err?.response?.status === 500) {
                    showError(true);
                  }
                  if (err?.response?.data?.errors) {
                    const errors = err?.response?.data?.errors;
                    setErrors(toErrorMap(errors));
                  }
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Box mb={4}>
                    <InputField label="Email" name="email" autoComplete="email" type="email" />
                  </Box>
                  <Box mb={4}>
                    <InputField label="username" name="username" />
                  </Box>
                  <Box mb={6}>
                    <InputField label="password" name="password" autoComplete="password" type="password" />
                  </Box>

                  <Button
                    background="highlight.standard"
                    color="white"
                    width="full"
                    type="submit"
                    size="lg"
                    borderRadius="4px"
                    fontWeight="500"
                    isLoading={isSubmitting}
                    _hover={{ 
                      bg: 'highlight.hover', 
                      transform: 'translateY(-2px)', 
                      boxShadow: '0 4px 12px rgba(20, 110, 245, 0.3)' 
                    }}
                    transition="all 0.2s"
                    _active={{ bg: 'highlight.active' }}
                    _focus={{ boxShadow: 'none' }}
                  >
                    Register
                  </Button>
                  {error && (
                    <Text mt={4} color="menuRed" align="center" fontSize="14px" fontWeight="500">
                      Server Error. Try again later.
                    </Text>
                  )}
                  <Text mt={6} textAlign="center" fontSize="14px" color="brandGray.accent">
                    Already have an account?{' '}
                    <Link 
                      as={RLink} 
                      to="/login" 
                      textColor="highlight.standard" 
                      fontWeight="500" 
                      _focus={{ outline: 'none' }} 
                      _hover={{ textDecor: 'underline' }}
                    >
                      Sign In
                    </Link>
                  </Text>
                </Form>
              )}
            </Formik>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};
