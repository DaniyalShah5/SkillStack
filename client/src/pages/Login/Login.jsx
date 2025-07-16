import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useUser();

  const loginSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
  });

  const initialValues = {
    email: '',
    password: ''
  };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, values);
      login(response.data.user);
      localStorage.setItem('token', response.data.token);
      if (response.data.user.role === 'mentor') {
        navigate('/mentor-dashboard');
      } else if(response.data.user.role === 'admin'){
        navigate('/admin')
      }
      else
      navigate('/');
    } catch (err) {
      setStatus(err.response?.data?.error || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="text-black">
      <Formik
        initialValues={initialValues}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form className="flex flex-col justify-center items-center my-20 space-y-9 py-12 rounded-lg shadow-lg w-2/6 border mx-auto">
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

            {status && (
              <div className="text-red-500 text-sm">{status}</div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn-normal py-3 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Login;