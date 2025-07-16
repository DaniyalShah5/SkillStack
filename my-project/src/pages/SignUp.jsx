import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function SignUp() {
  const navigate = useNavigate();
  const { login } = useUser();

  const signupSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required')
  });

  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const response = await axios.post('http://localhost:4000/api/auth/signup', {
        name: values.name,
        email: values.email,
        password: values.password
      });
      
      login(response.data.user);
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      setStatus(err.response?.data?.error || 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="text-black">
      <Formik
        initialValues={initialValues}
        validationSchema={signupSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form className="flex flex-col justify-center items-center my-20 space-y-9 py-12 rounded-lg shadow-lg w-2/6 border mx-auto">
            <div className="w-full px-16">
              <label className="block mb-2">Name</label>
              <Field
                type="text"
                name="name"
                className="mt-2 p-2 rounded-lg w-full border-2 focus:outline-none"
                placeholder="Enter your name"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="w-full px-16">
              <label className="block mb-2">Email</label>
              <Field
                type="email"
                name="email"
                className="mt-2 p-2 rounded-lg w-full border-2 focus:outline-none"
                placeholder="Enter your email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="w-full px-16">
              <label className="block mb-2">Password</label>
              <Field
                type="password"
                name="password"
                className="mt-2 p-2 w-full rounded-lg border-2 focus:outline-none"
                placeholder="Enter your password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="w-full px-16">
              <label className="block mb-2">Confirm Password</label>
              <Field
                type="password"
                name="confirmPassword"
                className="mt-2 p-2 w-full rounded-lg border-2 focus:outline-none"
                placeholder="Confirm your password"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {status && (
              <div className="text-red-500 text-sm">{status}</div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn-normal py-3 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Signing up...' : 'Sign Up'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default SignUp;