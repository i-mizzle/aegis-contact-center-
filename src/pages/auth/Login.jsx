import { useState } from 'react'
import TextField from '../../components/elements/form/TextField';
import PasswordField from '../../components/elements/form/PasswordField';
import FormButton from '../../components/elements/form/FormButton';
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import ThemeToggler from '../../components/elements/ThemeToggler';
import { ERROR } from '../../store/types';
import axios from 'axios';
import { baseUrl } from '../../utils/utils';
import { useDispatch } from 'react-redux';
// import DartLogo from '../../assets/images/dart-logo-colored.svg'


const Login = () => {

  const [validationErrors, setValidationErrors] = useState({})
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [processing, setProcessing] = useState(false)
  const dispatch = useDispatch()

  const validateForm = () => {
    const errors = {}

    if (!email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Invalid email format'
    }

    if (!password) {
      errors.password = 'Password is required'
    }

    setValidationErrors(errors)

    return Object.keys(errors).length === 0
  }

  const navigate = useNavigate()
  const [ searchParams, setSearchParams ] = useSearchParams();

  const login = async () => {
    // e.preventDefault()
    if (!validateForm()) {
      return
    } 
    navigate('/admin')

    // Perform login action
    // try {
    //   const payload = {
    //     email,
    //     password
    //   }

    //   setProcessing(true)

    //   const response = await axios.post(`${baseUrl}/auth/back-office/login`, payload)

    //   localStorage.setItem('user', JSON.stringify(response.data.data))
    //   localStorage.setItem('token', response.data.token)

    //   // console.log(response.data)
    //   setProcessing(false)
    //   if(searchParams.get('returnUrl') && searchParams.get('returnUrl') !== '' && searchParams.get('returnUrl') !== '/') {
    //     navigate(searchParams.get('returnUrl'))
    //   } else {
    //     navigate('/admin')
    //   }
    // } catch (error) {
    //   console.log('login error: ', error)
    //   dispatch({
    //     type: ERROR,
    //     error
    //   })
    //   setProcessing(false)
    // }
  }

  return (
    <div className='min-h-screen'>
      <header className='p-4 border-stone-300 dark:border-stone-700 mb-6'>
        <div className="w-full flex items-center justify-between">
          <div />
          <ThemeToggler />
        </div>

      </header>

      <div className='w-[90%] lg:w-1/2 xl:w-4/12 mx-auto p-8 rounded shadow-md min-h-125 h-inherit shadow-stone-900/5 dark:shadow-black/50 bg-white dark:bg-stone-900/30 border-stone-300 dark:border-stone-700 mt-10'>
        
        {/* <img src={DartLogo} alt="Dart Digital Logo" className="h-10 w-22" /> */}

        <h1 className="text-2xl font-semibold">A.E.G.I.S</h1>
        <p className="text-sm">Advanced Emergency Governance & Integrated Security</p>
        <div className='w-full pt-6 border-t border-stone-200 dark:border-stone-700 mt-4'>
          <h3 className="text-md font-medium">Welcome back!</h3>
          <p className="text-sm text-stone-500 dark:text-stone-300">Please provide your registered email address and password to securely log in.</p>
        </div>

        <div className='mt-4'>
          <TextField 
            inputLabel="Email address" 
            fieldId="username" 
            inputType="text" 
            preloadValue={''}
            inputPlaceholder={'Your registered email address'}
            hasError={validationErrors && validationErrors.email} 
            returnFieldValue={(value)=>{setEmail(value)}}
          />
        </div>
        
        <div className='mt-4'>
          <PasswordField
            inputLabel="Password" 
            fieldId="password" 
            inputType="password" 
            inputPlaceholder={'Your password'}
            preloadValue={''}
            hasError={validationErrors && validationErrors.password} 
            returnFieldValue={(value)=>{setPassword(value)}}
          />
        </div>

        <p className="mb-3 pt-5 text-sm text-opacity-70 block">Forgot your password? <Link to="/password-reset" className="text-blue-500 dark:text-blue-300">Click here to reset it</Link></p>

        <div className='mt-5'>
          <FormButton buttonAction={login} buttonLabel={`Login to your account`} processing={processing} />
        </div>

        <div className='w-full text-center mt-4'>
          <p className="my-3 text-sm text-opacity-70 block text-left text-gray-400">Don't have an account? Notify an administrator to get you started</p>
        </div>
      </div>
    </div>
  )
}

export default Login