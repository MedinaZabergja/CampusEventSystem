import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

function Home() {
  const { language } = useContext(LanguageContext);

  return (
    <div className="page">
      <section className="hero">
        <img src="/umib-logo.png" alt="UMIB Logo" className="umib-logo" />

        <p className="eyebrow">
          {language === 'en'
            ? 'University of Mitrovica "Isa Boletini"'
            : 'Universiteti i Mitrovicës "Isa Boletini"'}
        </p>

        <h1>
          {language === 'en'
            ? 'Welcome to UMIB Event Management System'
            : 'Mirësevini në Sistemin e Menaxhimit të Eventeve të UMIB'}
        </h1>

        <p className="hero-text">
          {language === 'en'
            ? 'A digital platform for managing university events, student registrations, feedback, and faculty-based activities at UMIB.'
            : 'Një platformë digjitale për menaxhimin e eventeve universitare, regjistrimeve të studentëve, feedback-ut dhe aktiviteteve sipas fakulteteve në UMIB.'}
        </p>
      </section>

      <div className="events-grid">
        <div className="card">
          <h2>📅 {language === 'en' ? 'Discover Events' : 'Zbulo Eventet'}</h2>
          <p>
            {language === 'en'
              ? 'Students can browse university events, workshops, lectures, and faculty activities.'
              : 'Studentët mund të shfletojnë evente universitare, punëtori, ligjërata dhe aktivitete të fakulteteve.'}
          </p>
        </div>

        <div className="card">
          <h2>📝 {language === 'en' ? 'Register Easily' : 'Regjistrohu Lehtë'}</h2>
          <p>
            {language === 'en'
              ? 'Logged-in users can register for events and view their personal registrations.'
              : 'Përdoruesit e kyçur mund të regjistrohen në evente dhe t’i shohin regjistrimet e tyre.'}
          </p>
        </div>

        <div className="card">
          <h2>⭐ {language === 'en' ? 'Share Feedback' : 'Jep Vlerësim'}</h2>
          <p>
            {language === 'en'
              ? 'Students can rate events and leave feedback to improve future activities.'
              : 'Studentët mund të vlerësojnë eventet dhe të japin komente për përmirësimin e aktiviteteve të ardhshme.'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;