import { useState, useContext } from 'react';
import toast from 'react-hot-toast';
import API from '../services/api';
import { LanguageContext } from '../context/LanguageContext';

function Login({ setUser }) {
  const { language } = useContext(LanguageContext);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post('/auth/login', form);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);

      toast.success(
        language === 'en' ? 'Login successful!' : 'Kyçja u krye me sukses!'
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          (language === 'en' ? 'Login failed' : 'Kyçja dështoi')
      );
    }
  };

  return (
    <div className="page">
      <section className="hero">
        <p className="eyebrow">
          {language === 'en' ? 'User Access' : 'Qasja e Përdoruesit'}
        </p>

        <h1>{language === 'en' ? 'Login' : 'Kyçu'}</h1>

        <p className="hero-text">
          {language === 'en'
            ? 'Login to register for events and manage your university activities.'
            : 'Kyçuni për t’u regjistruar në evente dhe për të menaxhuar aktivitetet tuaja universitare.'}
        </p>
      </section>

      <form onSubmit={handleSubmit}>
        <input
          placeholder={language === 'en' ? 'Email' : 'Email-i'}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder={language === 'en' ? 'Password' : 'Fjalëkalimi'}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button type="submit">
          {language === 'en' ? 'Login' : 'Kyçu'}
        </button>
      </form>
    </div>
  );
}

export default Login;