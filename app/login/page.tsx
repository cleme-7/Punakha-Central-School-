import { signIn } from './actions'

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <h1 className="text-3xl font-serif mb-8">Sign in</h1>
      <form action={signIn} className="flex flex-col gap-4 w-full max-w-sm">
        <div>
          <label className="block text-sm mb-1" htmlFor="email">Email</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            required 
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="password">Password</label>
          <input 
            id="password" 
            name="password" 
            type="password" 
            required 
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <button 
          type="submit" 
          className="bg-[#6b1c50] text-white p-2 rounded mt-4 hover:bg-[#52133c]"
        >
          Sign in
        </button>
      </form>
    </div>
  )
}