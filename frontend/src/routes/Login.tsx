import { Box, Button, Flex, Heading, Image, Link, Text } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react';
import { Link as RLink, useNavigate } from 'react-router-dom';
import { InputField } from '../components/common/InputField';
import { toErrorMap } from '../lib/utils/toErrorMap';
import { userStore } from '../lib/stores/userStore';
import { LoginSchema } from '../lib/utils/validation/auth.schema';
import { login } from '../lib/api/handler/auth';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const setUser = userStore((state) => state.setUser);

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
            <Heading fontSize="24px" fontWeight="600" color="#fafafa">Welcome Back</Heading>
          </Box>
          <Box textAlign="left">
            <Formik
              initialValues={{
                email: '',
                password: '',
              }}
              validationSchema={LoginSchema}
              onSubmit={async (values, { setErrors }) => {
                try {
                  const { data } = await login(values);
                  if (data) {
                    setUser(data);
                    navigate('/channels/me');
                  }
                } catch (err: any) {
                  if (err?.response?.status === 401) {
                    setErrors({ password: 'Invalid Credentials' });
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
                    <InputField label="password" name="password" autoComplete="password" type="password" />
                  </Box>

                  <Flex justify="flex-end" mt={2} mb={6}>
                    <Link 
                      as={RLink} 
                      to="/forgot-password" 
                      textColor="highlight.standard" 
                      fontWeight="500" 
                      fontSize="14px" 
                      _hover={{ textDecor: 'underline' }} 
                      _focus={{ outline: 'none' }}
                    >
                      Forgot Password?
                    </Link>
                  </Flex>

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
                    _active={{ bg: 'highlight.active' }}
                    _focus={{ boxShadow: 'none' }}
                    transition="all 0.2s"
                  >
                    Login
                  </Button>
                  <Text mt={6} textAlign="center" fontSize="14px" color="brandGray.accent">
                    Don&apos;t have an account yet?{' '}
                    <Link 
                      as={RLink} 
                      to="/register" 
                      textColor="highlight.standard" 
                      fontWeight="500" 
                      _focus={{ outline: 'none' }} 
                      _hover={{ textDecor: 'underline' }}
                    >
                      Sign Up
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
