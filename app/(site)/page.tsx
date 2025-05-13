import AuthForm from "./components/AuthForm";

const Auth = () => {
  return (
    <div 
      className="flex flex-col justify-center min-h-full py-12 bg-gray-100 sm:px-6 lg:px-8"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        <h2 
          className="mt-6 text-3xl font-bold tracking-tight text-center text-gray-900 "
          >
            Sign in to your account : Yeamazing Chat App
        </h2>
      </div>
      <AuthForm />      
  </div>
  )
}

export default Auth;
