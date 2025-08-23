import { useState } from 'react';
import { Button, Label, TextInput, Checkbox } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple demo: accept any non-empty username/password
    if (username && password) {
      setError('');
      navigate('/');
    } else {
      setError('Please enter username and password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <div className="mb-4">
          <Label htmlFor="username">Username</Label>
          <TextInput id="username" type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div className="mb-4">
          <Label htmlFor="password">Password</Label>
          <TextInput id="password" type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div className="flex items-center mb-4">
          <Checkbox id="remember" />
          <Label htmlFor="remember" className="ml-2">Remember me</Label>
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <Button type="submit" className="w-full">Login</Button>
      </form>
    </div>
  );
}
