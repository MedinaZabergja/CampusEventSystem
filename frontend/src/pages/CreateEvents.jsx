import { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { LanguageContext } from '../context/LanguageContext';

function CreateEvent() {
  const { language } = useContext(LanguageContext);

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    capacity: '',
    image: '',
    categoryId: '',
    building: '',
    room: '',
    address: '',
  });

  useEffect(() => {
    API.get('/categories')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post('/events', {
        title: form.title,
        description: form.description,
        date: form.date,
        capacity: Number(form.capacity),
        image: form.image,
        categoryId: form.categoryId,
        location: {
          building: form.building,
          room: form.room,
          address: form.address,
        },
      });

      alert(
        language === 'en'
          ? 'Event created successfully!'
          : 'Eventi u krijua me sukses!'
      );

      setForm({
        title: '',
        description: '',
        date: '',
        capacity: '',
        image: '',
        categoryId: '',
        building: '',
        room: '',
        address: '',
      });
    } catch (error) {
      alert(
        error.response?.data?.message ||
          (language === 'en'
            ? 'Failed to create event.'
            : 'Krijimi i eventit dështoi.')
      );
    }
  };

  return (
    <div className="page">
      <section className="hero">
        <p className="eyebrow">
          {language === 'en' ? 'Admin Panel' : 'Paneli i Administratorit'}
        </p>

        <h1>
          {language === 'en' ? 'Create Event' : 'Krijo Event'}
        </h1>

        <p className="hero-text">
          {language === 'en'
            ? 'Add new university events to the system.'
            : 'Shtoni evente të reja universitare në sistem.'}
        </p>
      </section>

      <form onSubmit={handleSubmit}>
        <input
          placeholder={language === 'en' ? 'Event title' : 'Titulli i eventit'}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          placeholder={language === 'en' ? 'Description' : 'Përshkrimi'}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <input
          type="number"
          placeholder={language === 'en' ? 'Capacity' : 'Kapaciteti'}
          value={form.capacity}
          onChange={(e) => setForm({ ...form, capacity: e.target.value })}
        />

        <input
          placeholder={language === 'en' ? 'Image URL' : 'URL e imazhit'}
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />

        <select
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
        >
          <option value="">
            {language === 'en' ? 'Select Category' : 'Zgjidh Kategorinë'}
          </option>

          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          placeholder={language === 'en' ? 'Building' : 'Objekti'}
          value={form.building}
          onChange={(e) => setForm({ ...form, building: e.target.value })}
        />

        <input
          placeholder={language === 'en' ? 'Room' : 'Salla'}
          value={form.room}
          onChange={(e) => setForm({ ...form, room: e.target.value })}
        />

        <input
          placeholder={language === 'en' ? 'Address' : 'Adresa'}
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <button type="submit">
          {language === 'en' ? 'Create Event' : 'Krijo Event'}
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;