import { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { LanguageContext } from '../context/LanguageContext';

function Feedback() {
  const { language } = useContext(LanguageContext);

  const [events, setEvents] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  const [form, setForm] = useState({
    eventId: '',
    rating: 5,
    comment: '',
  });

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    API.get('/events')
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err));

    API.get('/feedbacks')
      .then((res) => setFeedbacks(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert(language === 'en' ? 'Please login first.' : 'Ju lutem kyçuni së pari.');
      return;
    }

    try {
      await API.post('/feedbacks', {
        userId: user.id,
        eventId: form.eventId,
        rating: Number(form.rating),
        comment: form.comment,
      });

      alert(
        language === 'en'
          ? 'Feedback submitted successfully!'
          : 'Vlerësimi u dërgua me sukses!'
      );

      setForm({
        eventId: '',
        rating: 5,
        comment: '',
      });

      const res = await API.get('/feedbacks');
      setFeedbacks(res.data);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          (language === 'en'
            ? 'Failed to submit feedback.'
            : 'Dështoi dërgimi i vlerësimit.')
      );
    }
  };

  return (
    <div className="page">
      <section className="hero">
        <p className="eyebrow">
          {language === 'en' ? 'Student Feedback' : 'Vlerësimet e Studentëve'}
        </p>

        <h1>
          {language === 'en' ? 'Event Feedback' : 'Vlerësimet për Eventet'}
        </h1>

        <p className="hero-text">
          {language === 'en'
            ? 'Share your experience and help improve future UMIB events.'
            : 'Ndani përvojën tuaj dhe ndihmoni në përmirësimin e eventeve të ardhshme në UMIB.'}
        </p>
      </section>

      <form onSubmit={handleSubmit}>
        <select
          value={form.eventId}
          onChange={(e) => setForm({ ...form, eventId: e.target.value })}
          required
        >
          <option value="">
            {language === 'en' ? 'Select Event' : 'Zgjidh Eventin'}
          </option>

          {events.map((event) => (
            <option key={event._id} value={event._id}>
              {event.title}
            </option>
          ))}
        </select>

        <select
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: e.target.value })}
        >
          <option value="5">
            {language === 'en' ? '5 - Excellent' : '5 - Shkëlqyeshëm'}
          </option>
          <option value="4">
            {language === 'en' ? '4 - Very Good' : '4 - Shumë mirë'}
          </option>
          <option value="3">
            {language === 'en' ? '3 - Good' : '3 - Mirë'}
          </option>
          <option value="2">
            {language === 'en' ? '2 - Fair' : '2 - Mjaftueshëm'}
          </option>
          <option value="1">
            {language === 'en' ? '1 - Poor' : '1 - Dobët'}
          </option>
        </select>

        <input
          placeholder={
            language === 'en'
              ? 'Write your comment'
              : 'Shkruani komentin tuaj'
          }
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          required
        />

        <button type="submit">
          {language === 'en' ? 'Submit Feedback' : 'Dërgo Vlerësimin'}
        </button>
      </form>

      <h2 className="section-title">
        {language === 'en' ? 'Recent Feedback' : 'Vlerësimet e Fundit'}
      </h2>

      <div className="events-grid">
        {feedbacks.map((feedback) => (
          <div className="card event-card" key={feedback._id}>
            <span className="badge">⭐ {feedback.rating}/5</span>

            <h2>{feedback.eventId?.title}</h2>

            <p>{feedback.comment}</p>

            <div className="event-info">
              <p>
                👤 {feedback.userId?.fullName}
              </p>
              <p>
                📧 {feedback.userId?.email}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feedback;