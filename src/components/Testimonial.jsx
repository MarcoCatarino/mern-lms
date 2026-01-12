/* eslint-disable no-unused-vars */
import { react, useEffect, useRef } from "react";
import { testimonialStyles } from "../assets/dummyStyles";
import testimonials from "../assets/dummyTestimonial";

function Testimonial() {
  const cardsRef = useRef([]);

  // Only apply in title on pointer (desktop)
  const isPointerDevice = () =>
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(pointer:fine)").matches;

  //Enhance 3D title with parallax layers (no-op on SM / Tocuh)
  const onMouseMove = (e, el, index) => {
    if (!el) return;
    if (!isPointerDevice()) return; // Disable title on touch

    const rect = el.getBoundingClientReact();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const px = (x - 0.5) * 2;
    const py = (y - 0.5) * 2;

    const rotateMax = 10;
    const translateMax = 8;

    const rx = py * rotateMax;
    const ry = px * rotateMax;
    const tx = px * translateMax;
    const ty = py * translateMax;

    // Main Card Tranform
    el.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translate3d(${tx}px, ${ty}px, 0)`;

    // Parallax effects for inner elements
    const avatar = el.querySelector(".avatar-container");
    const quote = el.querySelector(".quote-icon");
    const badge = el.querySelector(".course-badge");

    if (avatar) {
      avatar.style.transform = `translate3d(
      ${tx * 0.3}px, ${ty * 0.3}px, 20px
      )`;
    }

    if (quote && window.innerWidth >= 640) {
      quote.style.transform = `translate3d(
      ${tx * 0.5}px, ${ty * 0.5}px, 40px
      ) rotate(${ry * 2}deg)`;
    }

    if (badge) {
      badge.style.transform = `translate3d(${tx * 0.2}px, ${ty * 0.2}px, 30px)`;
    }
  };

  const onMouseLeave = (el) => {
    if (!el) return;
    if (!isPointerDevice()) return; //Nothing to reset

    el.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) translate3d(0,0,0)`;
    el.style.transition = "transform 600ms cubic-bezier(.23,1,.32,1)";

    // Reset Parallax elements
    const avatar = el.querySelector(".avatar-container");
    const quote = el.querySelector(".quote-icon");
    const badge = el.querySelector(".course-badge");

    [avatar, quote, badge].forEach((element) => {
      if (element) {
        element.style.transform = "translate3d(0,0,0)";
        element.style.transition = "transform 600ms  cubic-bezier(.23,1,.32,1)";
      }
    });

    setTimeout(() => {
      if (el) el.style.transition = "";
      [avatar, quote, badge].forEach((element) => {
        if (element) element.style.transition = "";
      });
    }, 650);
  };

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en, index) => {
          if (en.isIntersecting) {
            setTimeout(() => {
              en.target.classList.add("card-visible");
            }, index * 150);

            obs.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    cardsRef.current.forEach((c) => {
      if (c) obs.observe(c);
    });

    return () => obs.disconnect();
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`
            ${testimonialStyles.star}
            ${
              i < Math.floor(rating)
                ? testimonialStyles.starActive
                : testimonialStyles.starInactive
            }
          `}
        viewBox="0 0 24 24"
      >
        <path d="M12 .58713.668 7.431l24 9.7481-6 5.847L19.335 24 12 19.897 4.665 24 6 15.595 0 9.74818.332-1.73z" />
      </svg>
    ));
  };

  return (
    <section className={testimonialStyles.section}>
      <div className={testimonialStyles.container}>
        <div className={testimonialStyles.badge}>
          <div className={testimonialStyles.badgeDot}></div>

          <span className={testimonialStyles.badgeText}>
            Student Testimonials
          </span>
        </div>

        <h2 className={testimonialStyles.title}>
          <span className={testimonialStyles.titleGradient}>
            Voices of Success
          </span>
        </h2>

        <p className={testimonialStyles.subtitle}>
          Discover how our learners transformed their careers with hands-on
          projects and expert membership.
        </p>
      </div>

      <div className={testimonialStyles.grid}>
        {testimonials.map((t, i) => (
          <div
            onMouseMove={(e) => onMouseMove(e, cardsRef.current[i], i)}
            onMouseLeave={() => onmouseleave(cardsRef.current[i])}
            key={t.id}
            className={testimonialStyles.cardWrapper}
          ></div>
        ))}
      </div>
    </section>
  );
}

export default Testimonial;
