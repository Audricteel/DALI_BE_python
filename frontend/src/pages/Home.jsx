import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>
              Mas mura sa <br />
              <span>DALI</span>
            </h1>
            <p>
              DALI is an online grocery store where convenience meets quality and
              affordability. Value for money is our passion, and we will never
              compromise on the freshness of products or their variety.
            </p>
            <div className="hero-buttons">
              <Link to="/shop" className="btn btn-primary">
                Shop now
              </Link>
              <a href="#why-choose-us" className="btn btn-secondary">
                Learn more
              </a>
            </div>
          </div>
          <div className="hero-image">
            <img src="/images/grocery-bag.png" alt="Grocery Bag with Vegetables" />
          </div>
        </div>
      </section>

      <section id="product-range" className="product-range-section">
        <div className="container">
          <h2>Discover DALI's Wide Product Range</h2>
          <p className="section-subtitle">
            Find everything you need in one place — from fresh produce to pantry
            staples, quality meats, and more.
          </p>
          <div className="category-grid">
            <div className="category-card">
              <h3>Frozen Meat</h3>
              <p>Quality cuts, kept fresh and ready to cook.</p>
            </div>
            <div className="category-card">
              <h3>Food Staples</h3>
              <p>Your everyday essentials for hearty, home-cooked meals.</p>
            </div>
            <div className="category-card">
              <h3>Health and Beauty</h3>
              <p>Care for yourself, inside and out.</p>
            </div>
            <div className="category-card">
              <h3>Other Grocery Products</h3>
              <p>All the additional essentials you need.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="why-choose-us" className="why-choose-us-section">
        <div className="container">
          <div className="features-list">
            <h3>Why Choose Us</h3>
            <div className="feature-item">
              <h4>Convenience at Your Fingertips</h4>
              <p>
                DALI brings the store closer to you, with flexible delivery or
                convenient in-store pickup.
              </p>
            </div>
            <div className="feature-item">
              <h4>Quality You Can Trust</h4>
              <p>
                We select only the best products from trusted suppliers, so you'll
                be assured of getting only the best.
              </p>
            </div>
            <div className="feature-item">
              <h4>Exceptional Customer Support</h4>
              <p>
                Our customer support team will assist you with your queries,
                concerns, or anything else.
              </p>
            </div>
          </div>
          <div className="why-choose-us-text">
            <h2>Elevate Your Shopping Journey</h2>
            <p>
              DALI is not just another grocery store-it is a shopping experience,
              convenient, trustworthy, and very tailored to make your life easy. We
              have high-quality products available at flexible delivery options, an
              easy-to-use platform, and really great service to offer peace of mind
              and satisfaction in every order with us.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
