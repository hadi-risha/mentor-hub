
import {FlatColorIconsGoogle}  from "../../assets/usersIcons/LoginIcons";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { registerUser } from '../../slices/userSlice';
import { useState } from "react";
import ErrorModal from "../../utils/users/ErrorModal";
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '', 
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [serverError, setServerError] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, user } = useSelector((state: RootState) => state.user);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear the error for the specific field being changed
    setErrors({
      ...errors,
      [e.target.name]: '',
    });
  };


  // Function to validate names (only alphabetic characters)
  const isValidName = (name: string) => /^[A-Za-z]+$/.test(name);

  // Function to validate strong passwords
  const isValidPassword = (password: string) => {
    return password.length >= 8;
  };
  

  // Handle form submission
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    // Clear all errors first
    setErrors({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

  // Check if any field is just spaces
    for (const [key, value] of Object.entries(formData)) {
      if (!value.trim()) {
        setErrors((prev) => ({
          ...prev,
          [key]: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} is required and cannot be empty`,
        }));
        hasError = true;
      }
    }

    // Name Validation (Alphabetic only)
    if (!isValidName(formData.firstName)) {
      setErrors((prev) => ({
        ...prev,
        firstName: 'First name must contain only alphabetic characters',
      }));
      hasError = true;
    }
    
    if (!isValidName(formData.lastName)) {
      setErrors((prev) => ({
        ...prev,
        lastName: 'Last name must contain only alphabetic characters',
      }));
      hasError = true;
    }

     // Password and Confirm Password Validation
    if (!isValidPassword(formData.password)) {
      setErrors((prev) => ({
        ...prev,
        password: 'Password must be at least 8 characters long',
      }));
      hasError = true;
    }

    // Password and Confirm Password Validation
    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match!" }));
      hasError = true;
    }

    // Check for required fields
    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        setErrors((prev) => ({ ...prev, [key]: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} is required` }));
        hasError = true;
      }
    }

    if (hasError) return; // Stop submission if there are validation errors

    // Dispatch the registration action
    const { firstName, lastName, email, password, confirmPassword } = formData;
    // dispatch(registerUser({ firstName, lastName, email, password, confirmPassword }));


    try {
      await dispatch(registerUser({ firstName, lastName, email, password, confirmPassword })).unwrap();
      // navigate(`/otp-verification/${encodeURIComponent(email)}`);
      navigate(`/otp-verification/${encodeURIComponent(email)}?timeractive=true`);
    } catch (err: any) {
      if (err.message && err.message.includes('already exists')) {
        setServerError("User already exists!"); 
        setModalOpen(true); // Open the modal
      } else {
        setServerError("An unknown error occurred.");
        setModalOpen(true);
      }
      console.error('Error occurred:', err); // Log error for debugging
    }
  };

  const closeModal = () => {
    setModalOpen(false); // Function to close the modal
    setServerError(''); // Clear the error message
  };

  // const loginwithgoogle = ()=>{
  //   window.open("http://localhost:3001/api/auth/google/callback","_self")
  // }

  return (
    <div className="h-screen bg-gray-100">

        <h1 className="text-center py-14  text-black text-2xl font-bold">Sign up</h1>
        <div className="rounded-xl flex -mt-6 ml-96 signup-container shadow-2xl shadow-slate-400 bg-white w-2/4 h-4/6 justify-center items-center">

          {/* right side */}
          <div className="w-1/2 h-full rounded-tl-xl rounded-bl-xl bg-login-custom-gradient items-center justify-center">
            <h1 className="text-3xl font-bold text-white ml-28 mt-36">Welcome!</h1>
            <p className="text-white text-sm w-80 text-center ml-8 mt-4">Unlock your potential—let's dive into learning together!</p>

            <a href="/login">
              <button className="ml-28 mt-10 rounded-full border-2 border-white text-white px-11 py-2 text-xs font-bold">SIGN IN</button>
            </a>
          </div>

          {/* left side */}
          <div className="w-1/2 h-full rounded-tr-xl  rounded-br-xl ">
            <h1 className="text-black font-bold font-sans text-3xl mt-16 ml-32">Sign up</h1>

            <form onSubmit={handleSubmit}>
              <input
                  type="text" 
                  name="firstName"
                  value={formData.firstName} 
                  onChange={handleChange} 
                  
                  placeholder="First Name"
                  className=" ml-9 mt-11 w-72 p-2 text-sm flex-grow bg-gray-100 text-black focus:outline-none placeholder-gray-500 placeholder:text-xs"
                />
                {errors.firstName && <p className="text-red-500 text-xs ml-11">{errors.firstName}</p>}

              <input
                type="text" 
                name="lastName"
                value={formData.lastName} 
                onChange={handleChange} 
                
                placeholder="Last Name"
                className="ml-9 mt-2 w-72 p-2 text-sm flex-grow bg-gray-100 text-black focus:outline-none placeholder-gray-500 placeholder:text-xs"
              />
              {errors.lastName && <p className="text-red-500 text-xs ml-11">{errors.lastName}</p>}


              <input
                type="email" 
                name="email"
                value={formData.email} 
                onChange={handleChange} 
                
                placeholder="Email"
                className="ml-9 mt-2 w-72 p-2 text-sm flex-grow bg-gray-100 text-black focus:outline-none placeholder-gray-500 placeholder:text-xs"
              />
              {errors.email && <p className="text-red-500 text-xs ml-11">{errors.email}</p>}

              <input
                type="Password" 
                name="password"
                value={formData.password} 
                onChange={handleChange} 
                
                placeholder="Password"
                className="ml-9 mt-2 w-72 p-2 text-sm flex-grow bg-gray-100 text-black focus:outline-none placeholder-gray-500 placeholder:text-xs"
              />
              {errors.password && <p className="text-red-500 text-xs ml-11">{errors.password}</p>}


              <input
                type="Password" 
                name="confirmPassword"
                value={formData.confirmPassword} 
                onChange={handleChange} 
                
                placeholder="Confirm password"
                className="ml-9 mt-2 w-72 p-2 text-sm flex-grow bg-gray-100 text-black focus:outline-none placeholder-gray-500 placeholder:text-xs"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs ml-11">{errors.confirmPassword}</p>}

              
              <button 
                type="submit" 
                disabled={loading} 
                className="ml-28 mt-5 rounded-full bg-primary-orange border-2 border-primary-orange text-white px-11 py-2 text-xs font-bold">
                SIGN UP
              </button>
              {/* custom modal */}
              <ErrorModal
                message={serverError}
                isOpen={isModalOpen}
                onClose={closeModal}
              />
            </form>

            {/* <div className="mt-4 flex items-center justify-center space-x-4">
              <hr className="w-32 border-gray-300" />
              <span className="text-black text-sm">or</span>
              <hr className="w-28 border-gray-300" />
            </div> */}
{/* 
            <div className="mt-4 ml-9 w-72 flex items-center rounded-full border-2 border-gray-300 px-3 py-2 w-94 h-7 ">
              <FlatColorIconsGoogle className="ml-16" /> */}
              {/* <a href="/google-auth">
                <button className="-ml-9  text-black px-11 py-2 text-xs ">Sign up with Google</button>
              </a> */}

              {/* <button className="-ml-9  text-black px-11 py-2 text-xs" onClick={loginwithgoogle}>
                  Sign up with Google
                </button> */}
            {/* </div> */}
          
          </div>
          
          
        </div>
      
    </div>
    
  );
};
  
  export default Register;

  
