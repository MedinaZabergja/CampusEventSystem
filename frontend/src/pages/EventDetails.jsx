import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import { LanguageContext } from '../context/LanguageContext';

function EventDetails() {
  const { language } = useContext(LanguageContext);
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    API.get(`/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch((err) => console.error(err));

    API.get(`/feedbacks/event/${id}`)
      .then((res) => setFeedbacks(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!event) {
    return (
      <p className="page">
        {language === 'en' ? 'Loading event...' : 'Duke u ngarkuar eventi...'}
      </p>
    );
  }

  const averageRating =
    feedbacks.length === 0
      ? language === 'en'
        ? 'No reviews yet'
        : 'Ende pa vlerësime'
      : (
          feedbacks.reduce((sum, item) => sum + item.rating, 0) /
          feedbacks.length
        ).toFixed(1);

  return (
    <div className="page">
      <section className="hero">
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="details-image"
          />
        )}

        <p className="eyebrow">{event.categoryId?.name}</p>

        <h1>{event.title}</h1>

        <p className="hero-text">{event.description}</p>
      </section>

      <div className="card">
        <h2>
          {language === 'en'
            ? 'Event Information'
            : 'Informacionet e Eventit'}
        </h2>

        <p>
          ⭐ {language === 'en' ? 'Rating' : 'Vlerësimi'}: {averageRating}
        </p>

        <p>
          📅 {language === 'en' ? 'Date' : 'Data'}:{' '}
          {new Date(event.date).toLocaleDateString()}
        </p>

        <p>
          👥 {language === 'en' ? 'Capacity' : 'Kapaciteti'}:{' '}
          {event.capacity}
        </p>

        <p>
          📍 {language === 'en' ? 'Location' : 'Lokacioni'}:{' '}
          {event.location?.building},{' '}
          {language === 'en' ? 'Room' : 'Salla'} {event.location?.room},{' '}
          {event.location?.address}
        </p>
      </div>

      <h2 className="section-title">
        {language === 'en' ? 'Feedback' : 'Vlerësime'}
      </h2>

      {feedbacks.length === 0 ? (
        <div className="card">
          <h2>
            {language === 'en'
              ? 'No feedback yet'
              : 'Ende nuk ka vlerësime'}
          </h2>

          <p>
            {language === 'en'
              ? 'Student feedback will appear here after it is submitted.'
              : 'Vlerësimet e studentëve do të shfaqen këtu pasi të dërgohen.'}
          </p>
        </div>
      ) : (
        <div className="events-grid">
          {feedbacks.map((feedback) => (
            <div className="card" key={feedback._id}>
              <span className="badge">⭐ {feedback.rating}/5</span>

              <p>{feedback.comment}</p>

              <p>
                👤 {feedback.userId?.fullName}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventDetails;