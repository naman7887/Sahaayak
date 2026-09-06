function Home() {
  return (
    <main>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">

          <p className="hero-tag">
            Your community. Your services. Your Sahaayak.
          </p>

          <h1>
            Find trusted services
            <span> near you.</span>
          </h1>

          <p className="hero-description">
            Connect with skilled local service providers for your
            everyday needs — quickly, safely and conveniently.
          </p>

          <div className="search-box">
            <input
              type="text"
              placeholder="What service are you looking for?"
            />

            <button>
              Search
            </button>
          </div>

          <div className="hero-actions">
            <button className="primary-action">
              Find a Service
            </button>

            <button className="secondary-action">
              Become a Service Provider
            </button>
          </div>

        </div>
      </section>


      {/* Services Section */}
      <section className="services-section">

        <div className="section-heading">
          <p>EXPLORE</p>
          <h2>Popular Services</h2>
          <span>
            Find skilled people for your everyday needs.
          </span>
        </div>

        <div className="services-grid">

          <div className="service-card">
            <div className="service-icon">🔧</div>
            <h3>Repair & Maintenance</h3>
            <p>Get help with repairs and maintenance.</p>
          </div>

          <div className="service-card">
            <div className="service-icon">🏠</div>
            <h3>Home Services</h3>
            <p>Reliable help for your household needs.</p>
          </div>

          <div className="service-card">
            <div className="service-icon">⚡</div>
            <h3>Electrical</h3>
            <p>Find skilled electrical service providers.</p>
          </div>

          <div className="service-card">
            <div className="service-icon">🚚</div>
            <h3>Delivery</h3>
            <p>Local delivery and transportation services.</p>
          </div>

          <div className="service-card">
            <div className="service-icon">🧹</div>
            <h3>Cleaning</h3>
            <p>Find trusted cleaning professionals.</p>
          </div>

          <div className="service-card">
            <div className="service-icon">💻</div>
            <h3>Digital Services</h3>
            <p>Get help with digital and technical work.</p>
          </div>

        </div>

      </section>

    </main>
  );
}

export default Home;