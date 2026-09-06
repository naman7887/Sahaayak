import { useEffect, useState } from "react";

function FindServices() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/services"
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message || "Unable to load services"
          );
          return;
        }

        setServices(data.services || []);
      } catch (error) {
        console.error("Error:", error);
        setError("Cannot connect to the backend");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = services.filter((service) => {
    const searchText = search.toLowerCase();

    return (
      service.name
        ?.toLowerCase()
        .includes(searchText) ||
      service.category
        ?.toLowerCase()
        .includes(searchText) ||
      service.description
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  const formatDuration = (minutes) => {
    if (!minutes) return "Duration not specified";

    if (minutes < 60) {
      return `${minutes} min`;
    }

    const hours = minutes / 60;

    return Number.isInteger(hours)
      ? `${hours} hour${hours > 1 ? "s" : ""}`
      : `${hours.toFixed(1)} hours`;
  };

  return (
    <main className="find-services-page">

      {/* HEADER */}

      <section className="find-services-header">

        <div>

          <p className="dashboard-label">
            FIND SERVICES
          </p>

          <h1>
            Find the right service for you
          </h1>

          <p>
            Browse available services from your local
            Sahaayak community.
          </p>

        </div>

      </section>


      {/* SEARCH */}

      <section className="service-search-section">

        <div className="service-search">

          <span>🔍</span>

          <input
            type="text"
            placeholder="Search electrician, plumber, cleaning..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <button className="filter-btn">
          ⚙ Filters
        </button>

      </section>


      <div className="service-location">
        📍 Showing services available in your community
      </div>


      {/* SERVICES */}

      <section className="providers-section">

        <div className="providers-heading">

          <h2>
            Available Services
          </h2>

          <span>
            {filteredServices.length} services found
          </span>

        </div>


        {loading && (

          <div className="no-results">

            <div>⏳</div>

            <h3>
              Loading services...
            </h3>

            <p>
              Getting the latest services from Sahaayak.
            </p>

          </div>

        )}


        {!loading && error && (

          <div className="no-results">

            <div>⚠️</div>

            <h3>
              Unable to load services
            </h3>

            <p>
              {error}
            </p>

          </div>

        )}


        {!loading && !error && (

          <div className="providers-grid">

            {filteredServices.map((service) => (

              <div
                className="provider-card"
                key={service._id}
              >

                <div className="provider-top">

                  <div className="provider-avatar">
                    🛠️
                  </div>

                  <div className="verified-badge">
                    ✓ Available
                  </div>

                </div>


                <h3>
                  {service.name}
                </h3>


                <p className="provider-service">
                  {service.category}
                </p>


                <div className="provider-info">

                  <span>
                    ₹{service.basePrice}
                  </span>

                  <span>
                    ⏱ {formatDuration(
                      service.estimatedDuration
                    )}
                  </span>

                </div>


                <div className="provider-location">

                  {service.description ||
                    "Professional local service"}

                </div>


                <button
                  className="view-provider-btn"
                  onClick={() => {
                    window.location.href =
                      `/service-details?id=${service._id}`;
                  }}
                >
                  View Service
                </button>

              </div>

            ))}

          </div>

        )}


        {!loading &&
          !error &&
          filteredServices.length === 0 && (

            <div className="no-results">

              <div>🔍</div>

              <h3>
                No services found
              </h3>

              <p>
                Try searching for a different service.
              </p>

            </div>

          )}

      </section>

    </main>
  );
}

export default FindServices;