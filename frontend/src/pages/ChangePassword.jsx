import { useState, useContext } from 'react';
import API from '../services/api';
import { LanguageContext } from '../context/LanguageContext';

function ChangePassword() {
  const { language } = useContext(LanguageContext);
  const user = JSON.parse(localStorage.getItem('user'));

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      alert(
        language === 'en'
          ? 'New passwords do not match.'
          : 'Fjalëkalimet e reja nuk përputhen.'
      );
      return;
    }

    try {
      await API.put('/auth/change-password', {
        userId: user.id,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      alert(
        language === 'en'
          ? 'Password changed successfully!'
          : 'Fjalëkalimi u ndryshua me sukses!'
      );

      setForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      alert(
        error.response?.data?.message ||
          (language === 'en'
            ? 'Failed to change password.'
            : 'Ndryshimi i fjalëkalimit dështoi.')
      );
    }
  };

  return (
    <div className="page">
      <section className="hero">
        <p className="eyebrow">
          {language === 'en' ? 'Account Settings' : 'Cilësimet e Llogarisë'}
        </p>

        <h1>
          {language === 'en' ? 'Change Password' : 'Ndrysho Fjalëkalimin'}
        </h1>

        <p className="hero-text">
          {language === 'en'
            ? 'Update your account password securely.'
            : 'Përditësoni fjalëkalimin e llogarisë suaj në mënyrë të sigurt.'}
        </p>
      </section>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder={
            language === 'en'
              ? 'Current Password'
              : 'Fjalëkalimi Aktual'
          }
          value={form.currentPassword}
          onChange={(e) =>
            setForm({
              ...form,
              currentPassword: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder={
            language === 'en'
              ? 'New Password'
              : 'Fjalëkalimi i Ri'
          }
          value={form.newPassword}
          onChange={(e) =>
            setForm({
              ...form,
              newPassword: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder={
            language === 'en'
              ? 'Confirm New Password'
              : 'Konfirmo Fjalëkalimin e Ri'
          }
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({
              ...form,
              confirmPassword: e.target.value,
            })
          }
        />

        <button type="submit">
          {language === 'en'
            ? 'Change Password'
            : 'Ndrysho Fjalëkalimin'}
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;