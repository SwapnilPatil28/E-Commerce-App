import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

const inputClass = 'w-full border-4 border-black bg-white px-4 py-3 font-bold outline-none focus:bg-yellow-100'
const buttonClass = 'w-full border-4 border-black bg-cyan-400 px-5 py-3 font-black uppercase shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none'

function Auth({ mode = 'login' }) {
  const isRegistering = mode === 'register'
  const { customer, isLoading, login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isLoading) {
    return <div className="py-24 text-center font-black uppercase">Checking your account...</div>
  }

  if (customer) {
    return <Navigate to="/me" replace />
  }

  const updateField = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      if (isRegistering) {
        await register(form)
        await login({ email: form.email, password: form.password })
        toast.success('Account created. Welcome to Neo Mart!')
      } else {
        await login({ email: form.email, password: form.password })
        toast.success('Welcome back!')
      }
      navigate(location.state?.from?.pathname || '/me', { replace: true })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto grid max-w-5xl gap-8 py-8 md:grid-cols-[1fr_1.2fr] md:items-center md:py-16">
      <div className="border-4 border-black bg-yellow-300 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:p-10">
        <p className="mb-3 font-black uppercase tracking-widest">Neo Mart / {isRegistering ? 'Join the club' : 'Member access'}</p>
        <h1 className="text-5xl font-black uppercase leading-[0.9] md:text-7xl">{isRegistering ? 'Make it yours.' : 'Welcome back.'}</h1>
        <p className="mt-6 max-w-sm font-bold">{isRegistering ? 'Create an account, keep your cart close, and shop with a little more electricity.' : 'Your saved shopping world is waiting. Sign in to see your profile and manage your account.'}</p>
      </div>

      <form onSubmit={handleSubmit} className="border-4 border-black bg-pink-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:p-10">
        <h2 className="mb-6 text-3xl font-black uppercase">{isRegistering ? 'Create account' : 'Sign in'}</h2>
        {isRegistering && <label className="mb-4 block font-black uppercase">Full name<input className={inputClass} name="fullName" value={form.fullName} onChange={updateField} required /></label>}
        <label className="mb-4 block font-black uppercase">Email<input className={inputClass} type="email" name="email" value={form.email} onChange={updateField} required /></label>
        {isRegistering && <label className="mb-4 block font-black uppercase">Phone<input className={inputClass} name="phone" value={form.phone} onChange={updateField} required /></label>}
        <label className="mb-6 block font-black uppercase">Password<input className={inputClass} type="password" name="password" minLength="6" value={form.password} onChange={updateField} required /></label>
        <button className={buttonClass} disabled={isSubmitting}>{isSubmitting ? 'Working...' : isRegistering ? 'Create my account' : 'Enter Neo Mart'}</button>
        <p className="mt-6 text-center font-bold">
          {isRegistering ? 'Already a member? ' : 'New here? '}
          <Link className="font-black underline" to={isRegistering ? '/login' : '/register'}>{isRegistering ? 'Sign in' : 'Register'}</Link>
        </p>
      </form>
    </section>
  )
}

export default Auth
