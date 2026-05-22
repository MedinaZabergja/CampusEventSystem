import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { LanguageContext } from '../context/LanguageContext';

function Events() {
  const { language } = useContext(LanguageContext);

  const [events, setEvents] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    API.get('/events')
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err));

    API.get('/feedbacks')
      .then((res) => setFeedbacks(res.data))
      .catch((err) => console.error(err));

    if (user) {
      API.get('/registrations')
        .then((res) => {
          const userRegistrations = res.data.filter(
            (registration) =>
              registration.userId?._id === user.id ||
              registration.userId === user.id
          );

          const registeredIds = userRegistrations.map((registration) =>
            typeof registration.eventId === 'object'
              ? registration.eventId._id
              : registration.eventId
          );

          setRegisteredEvents(registeredIds);
        })
        .catch((err) => console.error(err));
    }
  }, []);

  const handleRegister = async (eventId) => {
    if (!user) {
      alert(language === 'en' ? 'Please login first.' : 'Ju lutem kyçuni së pari.');
      return;
    }

    try {
      await API.post('/registrations', {
        userId: user.id,
        eventId,
      });

      alert(
        language === 'en'
          ? 'Successfully registered for the event!'
          : 'U regjistruat me sukses në event!'
      );

      setRegisteredEvents([...registeredEvents, eventId]);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          (language === 'en'
            ? 'Registration failed.'
            : 'Regjistrimi dështoi.')
      );
    }
  };

  const handleDelete = async (eventId) => {
    const confirmDelete = window.confirm(
      language === 'en'
        ? 'Are you sure you want to delete this event?'
        : 'A jeni të sigurt që dëshironi ta fshini këtë event?'
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/events/${eventId}`);

      setEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== eventId)
      );

      alert(
        language === 'en'
          ? 'Event deleted successfully!'
          : 'Eventi u fshi me sukses!'
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          (language === 'en' ? 'Delete failed.' : 'Fshirja dështoi.')
      );
    }
  };

  const getAverageRating = (eventId) => {
    const eventFeedbacks = feedbacks.filter(
      (feedback) => feedback.eventId?._id === eventId
    );

    const reviewCount = eventFeedbacks.length;

    if (reviewCount === 0) {
      return language === 'en' ? 'No reviews yet' : 'Ende pa vlerësime';
    }

    const total = eventFeedbacks.reduce(
      (sum, feedback) => sum + feedback.rating,
      0
    );

    const average = (total / reviewCount).toFixed(1);

    if (language === 'en') {
      return `${average} (${reviewCount} review${
        reviewCount > 1 ? 's' : ''
      })`;
    }

    return `${average} (${reviewCount} vlerësim${
      reviewCount > 1 ? 'e' : ''
    })`;
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === '' || event.categoryId?._id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page">
      <section className="hero">

        <h1>
          {language === 'en'
            ? 'UMIB Events'
            : 'Eventet e UMIB-it'}
        </h1>

        <p className="hero-text">
          {language === 'en'
            ? 'Discover university events, workshops, and campus activities in one place.'
            : 'Zbuloni evente universitare, punëtori dhe aktivitete kampusi në një vend.'}
        </p>
      </section>

      <h2 className="section-title">
        {language === 'en' ? 'Upcoming Campus Events' : 'Eventet e Ardhshme në Kampus'}
      </h2>

      <div className="filters">
        <input
          placeholder={language === 'en' ? 'Search events...' : 'Kërko evente...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">
            {language === 'en' ? 'All Faculties' : 'Të gjitha Fakultetet'}
          </option>

          {[...new Map(
            events.map((event) => [event.categoryId?._id, event.categoryId])
          ).values()].map((category) => (
            <option key={category?._id} value={category?._id}>
              {category?.name}
            </option>
          ))}
        </select>
      </div>

      <div className="events-grid">
        {filteredEvents.map((event) => (
          <div className="card event-card" key={event._id}>
            {event.image && (
              <img
                src={event.image}
                alt={event.title}
                className="event-image"
              />
            )}

            <span className="badge">{event.categoryId?.name}</span>

            <h2>{event.title}</h2>

            <p className="rating">⭐ {getAverageRating(event._id)}</p>

            <p>{event.description}</p>

            <div className="event-info">
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
                {event.location?.building}, {language === 'en' ? 'Room' : 'Salla'}{' '}
                {event.location?.room}
              </p>
            </div>

            <button
              disabled={registeredEvents.includes(event._id)}
              onClick={() => handleRegister(event._id)}
            >
              {registeredEvents.includes(event._id)
                ? language === 'en'
                  ? 'Registered ✅'
                  : 'I regjistruar ✅'
                : language === 'en'
                  ? 'Register for Event'
                  : 'Regjistrohu në Event'}
            </button>

            <a
              className="details-link"
              target="_blank"
              rel="noreferrer"
              href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                event.title
              )}&details=${encodeURIComponent(
                event.description
              )}&location=${encodeURIComponent(
                `${event.location?.building || ''} ${
                  event.location?.room || ''
                }`
              )}&dates=${new Date(event.date)
                .toISOString()
                .replace(/-|:|\.\d\d\d/g, '')}/${new Date(
                new Date(event.date).getTime() + 2 * 60 * 60 * 1000
              )
                .toISOString()
                .replace(/-|:|\.\d\d\d/g, '')}`}
            >
              📅{' '}
              {language === 'en'
                ? 'Add to Google Calendar'
                : 'Shto në Google Calendar'}
            </a>

            <Link to={`/events/${event._id}`} className="details-link">
              {language === 'en' ? 'View Details' : 'Shiko Detajet'}
            </Link>

            {user?.role === 'admin' && (
              <>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => handleDelete(event._id)}
                >
                  {language === 'en' ? 'Delete Event' : 'Fshi Eventin'}
                </button>

                <Link to={`/edit-event/${event._id}`} className="details-link">
                  {language === 'en' ? 'Edit Event ✏️' : 'Ndrysho Eventin ✏️'}
                </Link>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Events;