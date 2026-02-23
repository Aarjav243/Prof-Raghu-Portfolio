"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import HeroAnimation from "@/components/HeroAnimation";

/* ------------------------------------------------------------------ */
/* Declare globals loaded via CDN <script> tags                       */
/* ------------------------------------------------------------------ */
declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
    LocomotiveScroll: any;
  }
}

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const locoScrollRef = useRef<any>(null);

  useEffect(() => {
    /* Wait for GSAP + Locomotive CDN scripts to load */
    const waitForLibs = setInterval(() => {
      if (window.gsap && window.ScrollTrigger && window.LocomotiveScroll) {
        clearInterval(waitForLibs);
        initSite();
      }
    }, 100);

    return () => clearInterval(waitForLibs);
  }, []);

  function initSite() {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    gsap.registerPlugin(ScrollTrigger);

    /* ============================================================
       PRELOADER
       ============================================================ */
    gsap.to(".progress-bar", {
      width: "100%",
      duration: 1.9,
      ease: "power1.inOut",
      onComplete: () => {
        gsap.to(".preloader", {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            const preloader = document.querySelector<HTMLElement>(".preloader");
            if (preloader) preloader.style.display = "none";

            /* Show main content */
            gsap.to(".main-content", {
              opacity: 1,
              duration: 1,
              ease: "power2.out",
            });

            initLocomotive();
            initAnimations();
          },
        });
      },
    });

    /* ============================================================
       LOCOMOTIVE SCROLL
       ============================================================ */
    function initLocomotive() {
      const container = scrollContainerRef.current;
      if (!container) return;

      const locoScroll = new window.LocomotiveScroll({
        el: container,
        smooth: true,
        multiplier: 1.0,
        lerp: 0.1,
        touchMultiplier: 3.5,
        tablet: {
          smooth: true,
          breakpoint: 0,
          lerp: 0.15
        },
        smartphone: {
          smooth: true,
          breakpoint: 0,
          lerp: 0.18
        }
      });

      locoScrollRef.current = locoScroll;

      locoScroll.on("scroll", ScrollTrigger.update);

      ScrollTrigger.scrollerProxy(container, {
        scrollTop(value?: number) {
          if (arguments.length && value !== undefined) {
            locoScroll.scrollTo(value, { duration: 0, disableLerp: true });
          }
          return locoScroll.scroll?.instance?.scroll?.y ?? 0;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
        pinType: container.style.transform ? "transform" : "fixed",
      });

      ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
      ScrollTrigger.defaults({ scroller: container });
      ScrollTrigger.refresh();
    }

    /* ============================================================
       GSAP ANIMATIONS
       ============================================================ */
    function initAnimations() {
      /* --- Floating orbs --- */
      (gsap.utils.toArray(".glow-orb") as HTMLElement[]).forEach((orb: HTMLElement, i: number) => {
        gsap.to(orb, {
          y: -20,
          duration: 3 + i * 0.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      });

      /* Hero text removed redundant slide-up since it is in the loading video */

      gsap.from(".hero__subtitle", {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.5,
        ease: "power3.out",
      });

      gsap.from(".hero__ctas .btn", {
        opacity: 0,
        y: 20,
        stagger: 0.15,
        duration: 0.8,
        delay: 0.8,
        ease: "power3.out",
      });

      /* --- Professional Experience: Text Flow --- */
      (gsap.utils.toArray("#experience .education__desc") as HTMLElement[]).forEach((desc) => {
        const text = desc.innerText;
        desc.innerHTML = text
          .split(" ")
          .map((word) => `<span class="word-span" style="display:inline-block; opacity:0; transform:translateY(10px)">${word}</span>`)
          .join(" ");

        gsap.to(desc.querySelectorAll(".word-span"), {
          scrollTrigger: {
            trigger: desc,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
          opacity: 1,
          y: 0,
          stagger: 0.03,
          duration: 0.5,
          ease: "power2.out",
        });
      });

      /* --- About section --- */
      gsap.from(".about__photo-wrap", {
        scrollTrigger: {
          trigger: ".about",
          start: "top 80%",
          toggleActions: "play reverse play reverse",
        },
        x: -60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".about__bio > *", {
        scrollTrigger: {
          trigger: ".about__bio",
          start: "top 80%",
          toggleActions: "play reverse play reverse",
        },
        y: 30,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out",
      });

      /* --- Education: Molecular Timeline --- */
      const eduItems = gsap.utils.toArray(".education__item") as HTMLElement[];
      const eduTimeline = document.querySelector(".education__timeline");
      const bondLine = document.querySelector(".bond-line-path");

      if (eduTimeline && bondLine && eduItems.length > 0) {
        gsap.to(bondLine, {
          scrollTrigger: {
            trigger: eduTimeline,
            start: "top 60%",
            end: "bottom 60%",
            scrub: 1.5,
          },
          strokeDashoffset: 0,
          ease: "none",
        });
      }

      // Quantum Electron Wander
      eduItems.forEach((item) => {
        const electrons = item.querySelectorAll(".electron");
        electrons.forEach((el) => {
          function moveElectron() {
            gsap.to(el, {
              x: gsap.utils.random(-100, 100),
              y: gsap.utils.random(-80, 80),
              duration: gsap.utils.random(1.5, 3),
              ease: "sine.inOut",
              onComplete: moveElectron
            });
          }
          moveElectron();
        });
      });

      eduItems.forEach((item, i) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.15,
          ease: "power3.out",
        });
      });

      /* --- Teaching cards --- */
      (gsap.utils.toArray(".teaching__card") as HTMLElement[]).forEach((card: HTMLElement, i: number) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          },
          y: 40,
          opacity: 0,
          duration: 0.7,
          delay: i * 0.1,
          ease: "power3.out",
        });
      });

      /* --- Technical Expertise: Connective Lines --- */
      const expertiseContainer = document.querySelector(".expertise-container");
      const svg = document.querySelector(".expertise-lines");
      const items = gsap.utils.toArray(".research__item") as HTMLElement[];

      if (expertiseContainer && svg && items.length > 0) {
        const rect = expertiseContainer.getBoundingClientRect();

        // Connect random pairs to simulate a web
        for (let i = 0; i < items.length; i++) {
          for (let j = i + 1; j < items.length; j++) {
            if (Math.random() > 0.6) { // Only connect some
              const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
              const start = items[i].getBoundingClientRect();
              const end = items[j].getBoundingClientRect();

              const x1 = start.left + start.width / 2 - rect.left;
              const y1 = start.top + start.height / 2 - rect.top;
              const x2 = end.left + end.width / 2 - rect.left;
              const y2 = end.top + end.height / 2 - rect.top;

              line.setAttribute("x1", x1.toString());
              line.setAttribute("y1", y1.toString());
              line.setAttribute("x2", x2.toString());
              line.setAttribute("y2", y2.toString());
              line.setAttribute("stroke", "var(--accent-cyan)");
              line.setAttribute("stroke-width", "1");
              line.setAttribute("stroke-dasharray", "1000");
              line.setAttribute("stroke-dashoffset", "1000");

              svg.appendChild(line);

              gsap.to(line, {
                scrollTrigger: {
                  trigger: expertiseContainer,
                  start: "top 80%",
                  toggleActions: "play none none reverse",
                },
                strokeDashoffset: 0,
                duration: 1.9,
                delay: Math.random() * 0.5,
                ease: "power2.out",
              });
            }
          }
        }
      }

      /* --- Research grid items --- */
      (gsap.utils.toArray(".research__item") as HTMLElement[]).forEach((item: HTMLElement, i: number) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 88%",
            toggleActions: "play reverse play reverse",
          },
          scale: 0.8,
          opacity: 0,
          duration: 0.6,
          delay: i * 0.08,
          ease: "back.out(1.4)",
        });
      });

      /* --- Publication items --- */
      (gsap.utils.toArray(".pub__item") as HTMLElement[]).forEach((item: HTMLElement, i: number) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 88%",
            toggleActions: "play reverse play reverse",
          },
          y: 25,
          opacity: 0,
          duration: 0.6,
          delay: i * 0.06,
          ease: "power3.out",
        });
      });

      /* --- Section headers --- */
      (gsap.utils.toArray(".section__label, .section__title, .section__desc") as HTMLElement[]).forEach((el: HTMLElement) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play reverse play reverse",
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      });

      /* --- Contact inputs --- */
      (gsap.utils.toArray(".contact__input, .contact__textarea") as HTMLElement[]).forEach((el: HTMLElement, i: number) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play reverse play reverse",
          },
          x: -40,
          opacity: 0,
          duration: 0.6,
          delay: i * 0.1,
          ease: "power3.out",
        });
      });

      gsap.from(".contact__submit", {
        scrollTrigger: {
          trigger: ".contact__submit",
          start: "top 92%",
          toggleActions: "play reverse play reverse",
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });

      /* --- Footer --- */
      gsap.from(".footer > *", {
        scrollTrigger: {
          trigger: ".footer",
          start: "top 90%",
          toggleActions: "play reverse play reverse",
        },
        y: 60,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      });
    }
  }

  /* ============================================================
     HAMBURGER TOGGLE
     ============================================================ */
  function toggleMenu() {
    document.querySelector(".nav__hamburger")?.classList.toggle("active");
    document.querySelector(".nav__mobile-menu")?.classList.toggle("active");
  }

  function closeMenu() {
    document.querySelector(".nav__hamburger")?.classList.remove("active");
    document.querySelector(".nav__mobile-menu")?.classList.remove("active");
  }

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, targetId: string) {
    e.preventDefault();
    closeMenu();
    if (locoScrollRef.current) {
      locoScrollRef.current.scrollTo(targetId, { offset: -80, duration: 1.2 });
    }
  }

  /* ============================================================
     CONTACT FORM SUBMIT
     ============================================================ */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const btn = document.querySelector<HTMLElement>(".contact__submit");
    if (btn && window.gsap) {
      window.gsap.fromTo(
        btn,
        { scale: 0.95 },
        {
          scale: 1,
          duration: 0.4,
          ease: "elastic.out(1, 0.5)",
        }
      );
    }
  }

  /* ============================================================
     FOOTER PARTICLES (generate positions)
     ============================================================ */
  // Use deterministic values to avoid SSR/client hydration mismatch
  const particles = Array.from({ length: 30 }, (_, i) => {
    const hash1 = ((i * 2654435761) >>> 0) / 4294967296;
    const hash2 = ((i * 2246822519 + 1) >>> 0) / 4294967296;
    const hash3 = ((i * 3266489917 + 2) >>> 0) / 4294967296;
    const hash4 = ((i * 668265263 + 3) >>> 0) / 4294967296;
    return {
      id: i,
      left: `${(hash1 * 100).toFixed(4)}%`,
      top: `${(hash2 * 100).toFixed(4)}%`,
      animDelay: `${(hash3 * 4).toFixed(4)}s`,
      size: `${(1 + hash4 * 2).toFixed(4)}px`,
    };
  });

  return (
    <>
      {/* ============================
          PRELOADER
          ============================ */}
      <div className="preloader">
        <HeroAnimation />
        <div className="preloader__bar-wrap">
          <div className="progress-bar" />
        </div>
      </div>

      {/* ============================
          NAVIGATION
          ============================ */}
      <nav className="nav">
        <div className="nav__logo">
          Raghu VM Ganesh
        </div>
        <ul className="nav__links">
          <li><a href="#about" onClick={(e) => handleNavClick(e, "#about")}>About</a></li>
          <li><a href="#education" onClick={(e) => handleNavClick(e, "#education")}>Education</a></li>
          <li><a href="#experience" onClick={(e) => handleNavClick(e, "#experience")}>Experience</a></li>
          <li><a href="#research" onClick={(e) => handleNavClick(e, "#research")}>Expertise</a></li>
          <li><a href="#publications" onClick={(e) => handleNavClick(e, "#publications")}>Publications</a></li>
        </ul>
        <div className="nav__hamburger" onClick={toggleMenu}>
          <span /><span /><span />
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className="nav__mobile-menu">
        <a href="#about" onClick={(e) => handleNavClick(e, "#about")}>About</a>
        <a href="#education" onClick={(e) => handleNavClick(e, "#education")}>Education</a>
        <a href="#experience" onClick={(e) => handleNavClick(e, "#experience")}>Experience</a>
        <a href="#research" onClick={(e) => handleNavClick(e, "#research")}>Expertise</a>
        <a href="#publications" onClick={(e) => handleNavClick(e, "#publications")}>Publications</a>
      </div>

      {/* ============================
          MAIN CONTENT
          ============================ */}
      <div
        className="main-content"
        ref={scrollContainerRef}
        data-scroll-container
      >
        {/* ── HERO ── */}
        <section className="hero" id="hero" data-scroll-section>
          <div className="hero__pattern-bg" />
          <div className="hero__overlay" />
          <div className="glow-orb glow-orb--1" />
          <div className="glow-orb glow-orb--2" />
          <div className="glow-orb glow-orb--3" />
          <div className="hero__content">
            <h1 className="hero__title">Raghu VM Ganesh</h1>
            <p className="hero__subtitle">
              Assistant Professor at Krea University &nbsp;|&nbsp; PhD in Chemistry &nbsp;|&nbsp;
              Catalysis & Nanomaterials Expert &nbsp;|&nbsp; CO₂ Utilization Focus
            </p>
            <div className="hero__ctas">
              <a href="#publications" className="btn btn--primary" onClick={(e) => handleNavClick(e, "#publications")}>
                Research Publications
              </a>
              <a href="#experience" className="btn btn--outline" onClick={(e) => handleNavClick(e, "#experience")}>
                Professional Experience
              </a>
            </div>
          </div>
        </section>

        {/* ── ABOUT / PROFILE ── */}
        <section className="section about" id="about" data-scroll-section>
          <div className="section__container">
            <div className="section__label">Profile</div>
            <div className="section__title">About Me</div>
            <div className="about__grid">
              <div className="about__photo-wrap">
                <div className="about__photo-glow" />
                <Image
                  src="/prof-raghu.jpg"
                  alt="Raghu VM Ganesh"
                  width={400}
                  height={400}
                  className="about__photo"
                  priority
                />
              </div>
              <div className="about__bio">
                <h3>Executive Summary</h3>
                <p>
                  Raghu VM Ganesh is an <strong>Assistant Professor of Chemistry</strong> at Krea University, bringing over 10 years of research experience in <strong>catalytic nanomaterials</strong> and over 7 years of teaching experience.
                </p>
                <p>
                  He has successfully procured research grants via the <strong>National Science Foundation (NSF)</strong> and the <strong>American Chemical Society (ACS)</strong>. His career is marked by a successful transition between academic environments and semi-industrial workplaces like <strong>Saudi Aramco</strong> and <strong>Breathe Applied Sciences</strong>.
                </p>

                <h3 style={{ marginTop: '2rem' }}>Research Focus</h3>
                <p>
                  Expertise in the colloidal synthesis of monodisperse metal nanoparticles and their growth in encapsulated templates like mesoporous silica and <strong>Metal-Organic Frameworks (MOFs)</strong>.
                </p>
                <p>
                  Utilizing polyol-based colloidal synthesis via heterogeneous nucleation to prepare intermetallic nanoparticles (iNPs) for high-efficiency hydrogenation and semi-hydrogenation applications.
                </p>

                <ul className="about__list">
                  <li>Thermally Stable Encapsulated Intermetallic/Bimetallic Nanoparticles</li>
                  <li>Industrial scale-up for CO₂ Utilization (Dry Reforming of Methane)</li>
                  <li>Green Hydrogen, Electrolytic Water Splitting & Ammonia Synthesis</li>
                  <li>A.I.-powered Nanotechnology Platforms & Academic Publishing</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── EDUCATION ── */}
        <section className="section" id="education" data-scroll-section>
          <div className="section__container">
            <div className="section__label">Education</div>
            <div className="section__title">Academic Qualifications</div>
            <div className="education__timeline" style={{ position: 'relative' }}>
              <svg
                className="bond-line-svg"
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '2px',
                  height: '100%',
                  overflow: 'visible',
                  pointerEvents: 'none'
                }}
              >
                <line
                  className="bond-line-path"
                  x1="0" y1="0" x2="0" y2="100%"
                  stroke="var(--accent-orange)"
                  strokeWidth="3"
                  strokeDasharray="2000"
                  strokeDashoffset="2000"
                  style={{ filter: 'drop-shadow(0 0 8px var(--accent-orange))' }}
                />
              </svg>

              <div className="education__item">
                <div className="electron" />
                <div className="electron" />
                <div className="education__card glass-card">
                  <div className="education__degree">
                    Ph.D., Chemistry
                  </div>
                  <div className="education__institution">
                    Iowa State University
                  </div>
                  <div className="education__location">Ames, IA</div>
                  <div className="education__duration">Fall 2011 – Fall 2017</div>
                  <div className="education__desc" style={{ marginTop: '0.5rem', opacity: 0.8, fontSize: '0.85rem' }}>
                    Thesis: "Thermally Stable Encapsulated Intermetallic and Bimetallic Nanoparticles for Heterogeneous Catalysis"
                  </div>
                </div>
              </div>

              <div className="education__item">
                <div className="electron" />
                <div className="education__card glass-card">
                  <div className="education__degree">
                    M.Sc., Chemistry
                  </div>
                  <div className="education__institution">
                    Vellore Institute of Technology (VIT)
                  </div>
                  <div className="education__location">Vellore, Tamil Nadu, India</div>
                  <div className="education__duration">2007 – 2009</div>
                </div>
              </div>

              <div className="education__item">
                <div className="electron" />
                <div className="education__card glass-card">
                  <div className="education__degree">
                    B.Sc., Chemistry
                  </div>
                  <div className="education__institution">
                    Loyola College, University of Madras
                  </div>
                  <div className="education__location">Chennai, Tamil Nadu</div>
                  <div className="education__duration">2004 – 2007</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PROFESSIONAL EXPERIENCE ── */}
        <section className="section" id="experience" data-scroll-section>
          <div className="section__container">
            <div className="section__label">Career Timeline</div>
            <div className="section__title">Professional Experience</div>
            <div className="teaching__grid" style={{ gridTemplateColumns: '1fr' }}>

              <div className="teaching__card glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div className="teaching__role">Assistant Professor</div>
                  <div className="teaching__duration">Jan 2024 – Present</div>
                </div>
                <div className="teaching__institution">Krea University, Sri City</div>
                <div className="education__desc" style={{ marginTop: '0.75rem', opacity: 0.9, lineHeight: 1.6 }}>
                  Currently leading research and instruction in the Chemistry department, focusing on sustainable chemical processes.
                </div>
              </div>

              <div className="teaching__card glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div className="teaching__role">Postdoctoral Fellow</div>
                  <div className="teaching__duration">Oct 2021 – Oct 2023</div>
                </div>
                <div className="teaching__institution">King Abdullah University of Science and Technology (KAUST)</div>
                <div className="education__desc" style={{ marginTop: '0.75rem', opacity: 0.9, lineHeight: 1.6 }}>
                  <p>Working on CO₂ utilization projects funded by <strong>Saudi Aramco’s Carbon Centre initiative</strong> at the Kaust Catalysis Centre (KCC).</p>
                  <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem' }}>
                    <li>Industrial scale-up of catalysts for the dry reforming of methane and syngas (CO+H₂) conversion to alcohols, olefins, and gasoline.</li>
                    <li>Developed materials for green hydrogen initiatives, specifically electrocatalytic water splitting and ammonia synthesis/decomposition.</li>
                    <li>Utilized downflow vapor-phase thermochemical reactors and microwave reactors for continuous flow processes.</li>
                  </ul>
                </div>
              </div>

              <div className="teaching__card glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div className="teaching__role">Associate Scientist</div>
                  <div className="teaching__duration">Mar 2019 – May 2020</div>
                </div>
                <div className="teaching__institution">Breathe Applied Sciences Pvt. Ltd. (JNCASR)</div>
                <div className="education__desc" style={{ marginTop: '0.75rem', opacity: 0.9, lineHeight: 1.6 }}>
                  Guided a team on a pilot-scale reactor for the thermochemical reduction of CO₂ at high pressure and temperatures in preparation for the <strong>NRG COSIA Carbon XPRIZE</strong>.
                </div>
              </div>

              <div className="teaching__card glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div className="teaching__role">Independent Consultant</div>
                  <div className="teaching__duration">Jan 2019 – Feb 2021</div>
                </div>
                <div className="teaching__institution">Springer Nature, India</div>
                <div className="education__desc" style={{ marginTop: '0.75rem', opacity: 0.9, lineHeight: 1.6 }}>
                  Focused on <strong>Nano (nano.nature.com)</strong>, an A.I.-powered nanotechnology platform, and conducted author workshops to enhance academic and industrial research publishing.
                </div>
              </div>

              <div className="teaching__card glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div className="teaching__role">Postdoctoral Fellow</div>
                  <div className="teaching__duration">Jan 2018 – Dec 2018</div>
                </div>
                <div className="teaching__institution">Iowa State University</div>
                <div className="education__desc" style={{ marginTop: '0.75rem', opacity: 0.9 }}>
                  Extended doctoral work on nanomaterials for advanced applications beyond heterogeneous catalysis.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SPECIALIZED RESEARCH & PROJECTS ── */}
        <section className="section" id="research-projects" data-scroll-section>
          <div className="section__container">
            <div className="section__label">Deep Dive</div>
            <div className="section__title">Specialized Research</div>
            <div className="research__grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="teaching__card glass-card">
                <div className="teaching__role">Encapsulated Nanostructures</div>
                <div className="education__desc" style={{ marginTop: '1rem', lineHeight: 1.6 }}>
                  Focused on the colloidal synthesis of monodisperse metal nanoparticles (Pt, Pd, Au) and their growth within encapsulated templates like <strong>mesoporous silica (mSiO2)</strong> and <strong>Metal-Organic Frameworks (MOFs)</strong>.
                  <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem' }}>
                    <li>Developed "ship-in-a-bottle" strategies (e.g., PtSn@UiO-66-NH₂) for intermetallic nanoparticles.</li>
                    <li>Expertise in polyol-based colloidal synthesis via heterogeneous nucleation for intermetallic phase control.</li>
                  </ul>
                </div>
              </div>

              <div className="teaching__card glass-card">
                <div className="teaching__role">Magnetic Resonance & Hyperpolarization</div>
                <div className="education__desc" style={{ marginTop: '1rem', lineHeight: 1.6 }}>
                  Investigation of magnetic-field based effects in heterogeneous catalysis.
                  <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem' }}>
                    <li>Utilized <strong>PHIP-based (Parahydrogen-Induced Polarization)</strong> NMR signals to probe catalytic surfaces.</li>
                    <li>Developed contrast agents for MRI applications derived from hyperpolarized catalytic processes.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TECHNICAL EXPERTISE ── */}
        <section className="section" id="research" data-scroll-section>
          <div className="section__container expertise-container" style={{ position: 'relative' }}>
            {/* SVG for Connective Lines */}
            <svg
              className="expertise-lines"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
                opacity: 0.2
              }}
            />

            <div className="section__label">Capabilities</div>
            <div className="section__title">Technical Expertise</div>
            <div className="research__grid" style={{ position: 'relative', zIndex: 1 }}>
              {[
                { icon: "⚛️", name: "Heterogeneous Catalysis" },
                { icon: "🧪", name: "Colloidal Synthesis" },
                { icon: "🔬", name: "Nanomaterial Characterization" }, // XRD, XPS, FTIR, DRIFTS
                { icon: "🏭", name: "Industrial scale-up" },
                { icon: "⚙️", name: "Reactor Assembly & Design" },
                { icon: "💨", name: "Vapor-phase Processes" },
                { icon: "💥", name: "CO₂ Hydrogenation" },
                { icon: "⚡", name: "Electrocatalysis" },
              ].map((item) => (
                <div className="research__item glass-card" key={item.name}>
                  <span className="research__icon">{item.icon}</span>
                  <div className="research__name">{item.name}</div>
                </div>
              ))}
            </div>

            <div className="expertise__details glass-card" style={{ marginTop: '2rem', padding: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--accent-cyan)' }}>Specialized Techniques</h3>
              <p style={{ opacity: 0.9, lineHeight: 1.6 }}>
                Extensive experience with batch mode and continuous gas/vapor phase catalysis at both lab and industrial scales. Expert in <strong>Propane dehydrogenation</strong>, <strong>Acetylene semi-hydrogenation</strong>, and the selective hydrogenation of α, β-unsaturated aldehydes.
              </p>
              <p style={{ opacity: 0.9, lineHeight: 1.6, marginTop: '1rem' }}>
                Highly skilled in utilizing high-throughput <strong>Avantium Reactors</strong> (4-channel and 16-channel units) for ammonia synthesis, CO₂ hydrogenation, and dry reforming of methane.
              </p>
              <p style={{ opacity: 0.9, lineHeight: 1.6, marginTop: '1rem' }}>
                Trained in the design, troubleshooting, and maintenance of in-house continuous flow reactor assemblies and vapor-phase thermochemical setups.
              </p>
            </div>
          </div>
        </section>

        {/* ── PUBLICATIONS ── */}
        <section className="section" id="publications" data-scroll-section>
          <div className="section__container">
            <div className="section__label">Scholarly Work</div>
            <div className="section__title">Selected Publications</div>

            <div className="publications__list">
              <div className="pub__category">Nature Reviews & High Impact journals</div>

              {[
                {
                  title: "Structural control over single-crystalline oxides for heterogeneous catalysis",
                  journal: "Nature Reviews Chemistry, 2025",
                  link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=YZKUSRsAAAAJ&pagesize=100&citation_for_view=YZKUSRsAAAAJ:f2PrUAIjnKUC"
                },
                {
                  title: "Review of Catalyst Design and Mechanistic Studies for the Production of Olefins from Anthropogenic CO2",
                  journal: "ACS Catalysis, 2020",
                  link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=YZKUSRsAAAAJ&pagesize=100&citation_for_view=YZKUSRsAAAAJ:NMxIlDl6LWMC"
                },
                {
                  title: "Surface-mediated hyperpolarization of liquid water from parahydrogen",
                  journal: "Chem, 2018",
                  link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=YZKUSRsAAAAJ&pagesize=100&citation_for_view=YZKUSRsAAAAJ:Se3iqnhoufwC"
                },
                {
                  title: "Silica\u2010encapsulated Pt\u2010Sn intermetallic nanoparticles: A robust catalytic platform for parahydrogen\u2010induced polarization of gases and liquids",
                  journal: "Angewandte Chemie, 2017",
                  link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=YZKUSRsAAAAJ&pagesize=100&citation_for_view=YZKUSRsAAAAJ:W7OEmFMy1HYC"
                },
                {
                  title: "A ship-in-a-bottle strategy to synthesize encapsulated intermetallic nanoparticle catalysts: exemplified for furfural hydrogenation",
                  journal: "ACS Catalysis, 2016",
                  link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=YZKUSRsAAAAJ&pagesize=100&citation_for_view=YZKUSRsAAAAJ:2osOgNQ5qMEC"
                },
                {
                  title: "Intermetallic structures with atomic precision for selective hydrogenation of nitroarenes",
                  journal: "Journal of Catalysis, 2017",
                  link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=YZKUSRsAAAAJ&pagesize=100&citation_for_view=YZKUSRsAAAAJ:WF5omc3nYNoC"
                },
                {
                  title: "Intermetallic NaAu2 as a Heterogeneous Catalyst for Low-Temperature CO Oxidation",
                  journal: "Journal of the American Chemical Society, 2013",
                  link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=YZKUSRsAAAAJ&pagesize=100&citation_for_view=YZKUSRsAAAAJ:9yKSN-GCB0IC"
                },
                {
                  title: "Electronic structure engineering for electrochemical water oxidation",
                  journal: "Journal of Materials Chemistry A, 2022",
                  link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=YZKUSRsAAAAJ&pagesize=100&citation_for_view=YZKUSRsAAAAJ:Ic1VZgkJnDsC"
                },
                {
                  title: "High\u2010Temperature\u2010Stable and Regenerable Catalysts: Platinum Nanoparticles in Aligned Mesoporous Silica Wells",
                  journal: "ChemSusChem, 2013",
                  link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=YZKUSRsAAAAJ&pagesize=100&citation_for_view=YZKUSRsAAAAJ:d1gkVwhDpl0C"
                },
                {
                  title: "Enhancing Ammonia Synthesis on Co3Mo3N via Metal Support Interactions on a Single\u2010crystalline MgO Support",
                  journal: "ChemCatChem, 2024",
                  link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=YZKUSRsAAAAJ&pagesize=100&citation_for_view=YZKUSRsAAAAJ:L7vk9XBBNxgC"
                }
              ].map((pub) => (
                <a href={pub.link} target="_blank" rel="noopener noreferrer" key={pub.title} className="pub__item glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none' }}>
                  <div>
                    <div className="pub__title">{pub.title}</div>
                    <div className="pub__year">{pub.journal}</div>
                  </div>
                  <svg className="pub__link-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '1rem', flexShrink: 0 }}>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              ))}

              <div className="pub__category">Recent Research & Contributions</div>
              <div className="publications__list-secondary" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {[
                  {
                    title: "Sub\u20105 nm Intermetallic Nanoparticles Confined in Mesoporous Silica Wells for Selective Hydrogenation of Acetylene to Ethylene",
                    journal: "ChemCatChem, 2020",
                    link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=YZKUSRsAAAAJ&pagesize=100&citation_for_view=YZKUSRsAAAAJ:iH-uZ7U-co4C"
                  },
                  {
                    title: "Utilizing mixed-linker zirconium based metal-organic frameworks to enhance the visible light photocatalytic oxidation of alcohol",
                    journal: "Chemical Engineering Science, 2015",
                    link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=YZKUSRsAAAAJ&pagesize=100&citation_for_view=YZKUSRsAAAAJ:u-x6o8ySG0sC"
                  },
                  {
                    title: "Impact of linker engineering on the catalytic activity of metal\u2013organic frameworks containing Pd (II)\u2013bipyridine complexes",
                    journal: "ACS Catalysis, 2016",
                    link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=YZKUSRsAAAAJ&pagesize=100&citation_for_view=YZKUSRsAAAAJ:Tyk-4Ss8FVUC"
                  },
                  {
                    title: "Conversion of confined metal@ ZIF-8 structures to intermetallic nanoparticles supported on nitrogen-doped carbon for electrocatalysis",
                    journal: "Nano Research, 2018",
                    link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=YZKUSRsAAAAJ&pagesize=100&citation_for_view=YZKUSRsAAAAJ:roLk4NBRz8UC"
                  }
                ].map((pub) => (
                  <a href={pub.link} target="_blank" rel="noopener noreferrer" className="pub__item glass-card" key={pub.title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none' }}>
                    <div>
                      <div className="pub__title" style={{ fontSize: '0.9rem' }}>{pub.title}</div>
                      <div className="pub__year" style={{ fontSize: '0.8rem', opacity: 0.7 }}>{pub.journal}</div>
                    </div>
                    <svg className="pub__link-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '1rem', flexShrink: 0 }}>
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <a href="https://scholar.google.com/citations?hl=en&user=YZKUSRsAAAAJ" target="_blank" className="btn btn--outline">
                View All on Google Scholar
              </a>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="footer" data-scroll-section>
          <div className="footer__particles">
            {particles.map((p) => (
              <div
                key={p.id}
                className="footer__particle"
                style={{
                  left: p.left,
                  top: p.top,
                  width: p.size,
                  height: p.size,
                  animationDelay: p.animDelay,
                }}
              />
            ))}
          </div>
          <ul className="footer__links">
            <li><a href="#about" onClick={(e) => handleNavClick(e, "#about")}>About</a></li>
            <li><a href="#education" onClick={(e) => handleNavClick(e, "#education")}>Education</a></li>
            <li><a href="#experience" onClick={(e) => handleNavClick(e, "#experience")}>Experience</a></li>
            <li><a href="#research" onClick={(e) => handleNavClick(e, "#research")}>Expertise</a></li>
            <li><a href="#publications" onClick={(e) => handleNavClick(e, "#publications")}>Publications</a></li>
          </ul>
          <div className="footer__icons">
            <a
              href="mailto:raghuvamsy.maligalganesh@krea.edu.in"
              className="footer__icon"
              aria-label="Email"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-10 7L2 7" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/raghu-ganesh"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__icon"
              aria-label="LinkedIn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a
              href="https://scholar.google.com/citations?hl=en&user=YZKUSRsAAAAJ"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__icon"
              aria-label="Google Scholar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-3a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM1 10L12 2l11 8H1z" />
              </svg>
            </a>
          </div>
          <p className="footer__copy">
            &copy; {new Date().getFullYear()} Raghu VM Ganesh. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
}
