// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import Header from './component/Header'
// import HackathonRegistration from './component/HackathonRegistration'
// import AdminPanel from './component/AdminPanel'
import { Provider } from 'react-redux'
import { store } from '../store/store'
import RegisterForm from './component/Form'
function App() {
  

  return (
    <>
    <Provider store={store}>
 {/* <Header/> */}
 {/* <HackathonRegistration/> */}
 {/* <AdminPanel/> */}
 <RegisterForm/>
 </Provider>
    </>
  )
}

export default App
