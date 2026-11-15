import React from "react";
import {
  Calendar,
  Clock,
  Stethoscope,
  Phone,
  Star,
  Users,
  Ribbon,
  ShieldUser,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { bannerStyles } from "../../assets/dummyStyles";

const Banner = () => {
  const navigate = useNavigate();
  return (
    <div className={bannerStyles.bannerContainer}>
      {/* Main Banner Container with Animated Border */}
      <div className={bannerStyles.mainContainer}>
        {/* Auto-Animated Border Outline */}
        <div className={bannerStyles.borderOutline}>
          {/* Outer animated band (keeps your original class names to avoid style regressions) */}
          <div className={bannerStyles.outerAnimatedBand}></div>
          {/* Inner white border to separate content */}
          <div className={bannerStyles.innerWhiteBorder}></div>
        </div>

        {/* Background Image Layer */}
        <div
          className="absolute inset-0.5 rounded-3xl bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1681911046053-1d2fdce39ea0?q=80&w=1421&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D")`,
          }}
        />

        {/* Subtle Gradient Overlay for Text Readability & Contrast */}
        <div className="absolute inset-0.5 rounded-3xl bg-gradient-to-r from-white/95 via-white/85 to-white/40 lg:to-white/20 pointer-events-none" />

        {/* Content Container */}
        <div className={bannerStyles.contentContainer}>
          <div className={bannerStyles.flexContainer}>
            {/* Left Content Section */}
            <div className={`${bannerStyles.leftContent} max-w-2xl`}>
              {/* Header with Badge */}
              <div className={bannerStyles.headerBadgeContainer}>
                <div className={bannerStyles.stethoscopeContainer}>
                  <div className={bannerStyles.stethoscopeInner}>
                    <Stethoscope className={bannerStyles.stethoscopeIcon} />
                  </div>
                </div>

                <div className={bannerStyles.titleContainer}>
                  {/* Responsive heading sizes: smaller on phones, same on desktop */}
                  <h1 className={bannerStyles.title}>
                    Medi
                    <span className={bannerStyles.titleGradient}>Care+</span>
                  </h1>

                  {/* Stars */}
                  <div className={bannerStyles.starsContainer}>
                    <div className={bannerStyles.starsInner}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={bannerStyles.starIcon} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tagline */}
              <p className={bannerStyles.tagline}>
                Premium Healthcare
                <span className={`block ${bannerStyles.taglineHighlight}`}>
                  At Your Fingertips
                </span>
              </p>

              {/* Features Grid */}
              <div className={bannerStyles.featuresGrid}>
                <div
                  className={`${bannerStyles.featureItem} ${bannerStyles.featureBorderGreen}`}
                >
                  <Ribbon className={bannerStyles.featureIcon} />
                  <span className={bannerStyles.featureText}>
                    Certified Specialists
                  </span>
                </div>
                <div
                  className={`${bannerStyles.featureItem} ${bannerStyles.featureBorderBlue}`}
                >
                  <Clock className={bannerStyles.featureIcon} />
                  <span className={bannerStyles.featureText}>
                    24/7 Availability
                  </span>
                </div>
                <div
                  className={`${bannerStyles.featureItem} ${bannerStyles.featureBorderEmerald}`}
                >
                  <ShieldUser className={bannerStyles.featureIcon} />
                  <span className={bannerStyles.featureText}>
                    Safe &amp; Secure
                  </span>
                </div>
                <div
                  className={`${bannerStyles.featureItem} ${bannerStyles.featureBorderPurple}`}
                >
                  <Users className={bannerStyles.featureIcon} />
                  <span className={bannerStyles.featureText}>500+ Doctors</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className={bannerStyles.ctaButtonsContainer}>
                <button
                  onClick={() => navigate("/doctors")}
                  aria-label="Book Appointment"
                  className={bannerStyles.bookButton}
                >
                  <div className={bannerStyles.bookButtonOverlay}></div>
                  <div className={bannerStyles.bookButtonContent}>
                    <Calendar className={bannerStyles.bookButtonIcon} />
                    <span>Book Appointment Now</span>
                  </div>
                </button>

                <button
                  onClick={() => (window.location.href = "tel:+919936992241")}
                  aria-label="Emergency Call"
                  className={bannerStyles.emergencyButton}
                >
                  <div className={bannerStyles.emergencyButtonContent}>
                    <Phone className={bannerStyles.emergencyButtonIcon} />
                    <span>Emergency Call</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* end main container */}
    </div>
  );
};
export default Banner;