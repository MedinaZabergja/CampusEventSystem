import { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { LanguageContext } from '../context/LanguageContext';

function MyRegistrations() {
  const { language } = useContext(LanguageContext);
  const [registrations, setRegistrations] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    API.get('/registrations')
      .then((res) => {
        const userRegistrations = res.data.filter(
          (registration) =>
            registration.userId?._id === user?.id
        );

        setRegistrations(userRegistrations);
      })
      .catch((err) => console.error(err));
  }, [user]);

  const handleUnregister = async (eventId) => {
    try {
      await API.delete(`/registrations/${user.id}/${eventId}`);

      setRegistrations(
        registrations.filter(
          (registration) => registration.eventId?._id !== eventId
        )
      );

      alert(
        language === 'en'
          ? 'Successfully unregistered from event.'
          : 'U çregjistruat me sukses nga eventi.'
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          (language === 'en'
            ? 'Unregister failed.'
            : 'Çregjistrimi dështoi.')
      );
    }
  };

  return (
    <div className="page">
      <section className="hero">
        <p className="eyebrow">
          {language === 'en' ? 'Student Dashboard' : 'Paneli i Studentit'}
        </p>

        <h1>
          {language === 'en' ? 'My Registrations' : 'Regjistrimet e Mia'}
        </h1>

        <p className="hero-text">
          {language === 'en'
            ? 'View the events you have registered for.'
            : 'Shikoni eventet në të cilat jeni regjistruar.'}
        </p>
      </section>

      {registrations.length === 0 ? (
        <div className="card">
          <h2>
            {language === 'en'
              ? 'No registrations yet'
              : 'Ende nuk keni regjistrime'}
          </h2>

          <p>
            {language === 'en'
              ? 'When you register for an event, it will appear here.'
              : 'Kur të regjistroheni në një event, ai do të shfaqet këtu.'}
          </p>
        </div>
      ) : (
        <div className="events-grid">
          {registrations.map((registration) => (
            <div className="card event-card" key={registration._id}>
              <span className="badge">
                {registration.status === 'registered'
                  ? language === 'en'
                    ? 'Registered'
                    : 'I regjistruar'
                  : language === 'en'
                    ? 'Cancelled'
                    : 'I anuluar'}
              </span>

              <h2>{registration.eventId?.title}</h2>

              <p>{registration.eventId?.description}</p>

              <div className="event-info">
                <p>
                  📅 {language === 'en' ? 'Date' : 'Data'}:{' '}
                  {new Date(
                    registration.eventId?.date
                  ).toLocaleDateString()}
                </p>

                <p>
                  📍 {language === 'en' ? 'Location' : 'Lokacioni'}:{' '}
                  {registration.eventId?.location?.building}
                </p>

                <p>
                  👥 {language === 'en' ? 'Capacity' : 'Kapaciteti'}:{' '}
                  {registration.eventId?.capacity}
                </p>
              </div>

              <button
                className="unregister-btn"
                onClick={() =>
                  handleUnregister(registration.eventId?._id)
                }
              >
                {language === 'en' ? 'Unregister ❌' : 'Çregjistrohu ❌'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRegistrations;
