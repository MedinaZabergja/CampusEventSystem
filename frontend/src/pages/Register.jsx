import { useState, useContext } from 'react';
import toast from 'react-hot-toast';
import API from '../services/api';
import { LanguageContext } from '../context/LanguageContext';

function Register() {
  const { language } = useContext(LanguageContext);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post('/auth/register', form);

      toast.success(
        language === 'en'
          ? 'Registration successful!'
          : 'Regjistrimi u krye me sukses!'
      );

      setForm({
        fullName: '',
        email: '',
        password: '',
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          (language === 'en'
            ? 'Registration failed'
            : 'Regjistrimi dështoi')
      );
    }
  };

  return (
    <div className="page">
      <section className="hero">
        <p className="eyebrow">
          {language === 'en' ? 'Create Account' : 'Krijo Llogari'}
        </p>

        <h1>{language === 'en' ? 'Register' : 'Regjistrohu'}</h1>

        <p className="hero-text">
          {language === 'en'
            ? 'Create an account to join university events and activities.'
            : 'Krijoni një llogari për të marrë pjesë në evente dhe aktivitete universitare.'}
        </p>
      </section>

      <form onSubmit={handleSubmit}>
        <input
          placeholder={language === 'en' ? 'Full Name' : 'Emri i Plotë'}
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />

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
          {language === 'en' ? 'Register' : 'Regjistrohu'}
        </button>
      </form>
    </div>
  );
}

export default Register;