import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

const inputClass = 'w-full border-4 border-black bg-white px-4 py-3 font-bold outline-none focus:bg-yellow-100'

function Account() {
  const { customer, changePassword, logout } = useAuth()
  const navigate = useNavigate()
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' })
  const [isSaving, setIsSaving] = useState(false)

  const updatePassword = (event) => setPasswords({ ...passwords, [event.target.name]: event.target.value })

  const handlePasswordChange = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    try {
      const { message } = await changePassword(passwords)
      toast.success(message)
      setPasswords({ oldPassword: '', newPassword: '' })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to change password.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('You are logged out.')
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to log out.')
    }
  }

  return (
    <section className="mx-auto max-w-5xl py-8 md:py-16">
      <div className="mb-8 border-4 border-black bg-cyan-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:p-10">
        <p className="font-black uppercase tracking-widest">Your account</p>
        <h1 className="mt-2 text-5xl font-black uppercase leading-none">Hi, {customer.fullName.split(' ')[0]}.</h1>
        <p className="mt-4 font-bold">{customer.email} / {customer.phone}</p>
        <div className="mt-6">
          <button onClick={() => navigate('/orders')} className="border-4 border-black bg-white px-6 py-2.5 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-all cursor-pointer">
            📦 View My Orders
          </button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <form onSubmit={handlePasswordChange} className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-6 text-2xl font-black uppercase">Change password</h2>
          <label className="mb-4 block font-black uppercase">Current password<input className={inputClass} type="password" name="oldPassword" value={passwords.oldPassword} onChange={updatePassword} required /></label>
          <label className="mb-6 block font-black uppercase">New password<input className={inputClass} type="password" name="newPassword" minLength="6" value={passwords.newPassword} onChange={updatePassword} required /></label>
          <button className="w-full border-4 border-black bg-yellow-300 px-5 py-3 font-black uppercase shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none" disabled={isSaving}>{isSaving ? 'Saving...' : 'Update password'}</button>
        </form>

        <div className="flex flex-col justify-between border-4 border-black bg-pink-400 p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div><h2 className="text-2xl font-black uppercase">Session control</h2><p className="mt-3 font-bold">Your session is protected by a server-side httpOnly cookie.</p></div>
          <button onClick={handleLogout} className="mt-8 border-4 border-black bg-black px-5 py-3 font-black uppercase text-white transition-all hover:bg-white hover:text-black">Log out</button>
        </div>
      </div>
    </section>
  )
}

export default Account
