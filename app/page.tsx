"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Camera,
  Check,
  Instagram,
  Mail,
  Menu,
  Moon,
  Send,
  Sun,
  X,
} from "lucide-react";
import { supabase } from "../lib/supabase";

/* =========================================================
   CONFIG
========================================================= */

const INSTAGRAM_URL = "https://www.instagram.com/auliafairosa/";

const navItems = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Communication", id: "communication" },
  { label: "Journey", id: "journey" },
  { label: "Photography", id: "photography" },
  { label: "Editing", id: "editing" },
  { label: "Contact", id: "contact" },
];

/* =========================================================
   TYPES
========================================================= */

type Comment = {
  id: number;
  name: string;
  message: string;
  created_at?: string;
  date?: string;
};

/* =========================================================
   DATA
========================================================= */

const journey = [
  {
    number: "01",
    year: "01",
    title: "Ilmu Komunikasi",
    text: "Mempelajari cara menyampaikan pesan, membangun hubungan, dan memahami komunikasi dalam berbagai situasi.",
  },
  {
    number: "02",
    year: "02",
    title: "Visual Storytelling",
    text: "Menggabungkan komunikasi dengan visual untuk menciptakan cerita yang mudah dipahami dan memiliki karakter.",
  },
  {
    number: "03",
    year: "03",
    title: "Photography",
    text: "Mengembangkan kemampuan menangkap momen melalui komposisi, lighting, perspektif, dan storytelling.",
  },
  {
    number: "04",
    year: "04",
    title: "Photo & Video Editing",
    text: "Mengolah visual agar memiliki mood, warna, dan pesan yang sesuai dengan konsep yang ingin disampaikan.",
  },
];

const communicationSkills = [
  "Public Speaking",
  "Storytelling",
  "Presentation",
  "Copywriting",
  "Content Planning",
  "Visual Communication",
];

const photographySkills = [
  "Portrait",
  "Street Photography",
  "Event Documentation",
  "Composition",
  "Lighting",
  "Visual Storytelling",
];

const editingSkills = [
  "Photo Editing",
  "Video Editing",
  "Color Grading",
  "Visual Retouching",
  "Content Editing",
  "Creative Direction",
];

const projects = [
  {
    number: "01",
    category: "PHOTOGRAPHY",
    title: "Human Stories",
    description:
      "Eksplorasi karakter manusia melalui portrait dan pendekatan visual yang natural.",
  },
  {
    number: "02",
    category: "PHOTOGRAPHY",
    title: "Everyday Frames",
    description:
      "Dokumentasi momen sehari-hari dengan pendekatan sederhana dan storytelling.",
  },
  {
    number: "03",
    category: "PHOTO EDITING",
    title: "Visual Mood",
    description:
      "Eksperimen warna, tone, dan retouching untuk menciptakan mood visual tertentu.",
  },
  {
    number: "04",
    category: "VIDEO EDITING",
    title: "Moving Stories",
    description:
      "Eksplorasi video pendek dengan ritme editing, musik, transisi, dan visual storytelling.",
  },
];

const photos = [
  {
    src: "/photo1.jpg",
    title: "Portrait",
    category: "Photography",
  },
  {
    src: "/photo-2.jpg",
    title: "Visual Story",
    category: "Photography",
  },
  {
    src: "/photo-3.jpg",
    title: "Everyday Moment",
    category: "Photography",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);

  const [name, setName] = useState("");
  const [comment, setComment] = useState("");

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentSent, setCommentSent] = useState(false);

  const heroPhotoRef = useRef<HTMLImageElement>(null);

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    const savedTheme = localStorage.getItem("aulia-theme");

    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    const timer = window.setTimeout(() => {
      setLoaded(true);
    }, 900);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  /* =========================================================
     BODY SCROLL
  ========================================================= */

  useEffect(() => {
    document.body.style.overflow = loaded ? "" : "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [loaded]);

  /* =========================================================
     SCROLL
  ========================================================= */

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress =
        documentHeight > 0
          ? (scrollTop / documentHeight) * 100
          : 0;

      setScrolled(scrollTop > 30);
      setScrollProgress(progress);

      if (heroPhotoRef.current) {
        const offset = Math.min(scrollTop * 0.08, 80);
        heroPhotoRef.current.style.transform =
          `translateY(${offset}px)`;
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* =========================================================
     ACTIVE SECTION
  ========================================================= */

  useEffect(() => {
    if (!loaded) return;

    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (visible[0]) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, [loaded]);

  /* =========================================================
     REVEAL ANIMATION
  ========================================================= */

  useEffect(() => {
    if (!loaded) return;

    const elements = document.querySelectorAll(".reveal");

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [loaded]);

  /* =========================================================
     THEME
  ========================================================= */

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      darkMode
    );

    localStorage.setItem(
      "aulia-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  /* =========================================================
     LOAD COMMENTS FROM SUPABASE
  ========================================================= */

  useEffect(() => {
    if (!loaded) return;

    const loadComments = async () => {
      setCommentsLoading(true);

      try {
        const { data, error } = await supabase
          .from("comments")
          .select(
            "id, name, message, created_at"
          )
          .order("created_at", {
            ascending: false,
          });

        if (error) {
          console.error(
            "Gagal mengambil komentar:",
            error
          );

          setComments([]);
          return;
        }

        if (data) {
          setComments(data as Comment[]);
        }
      } catch (error) {
        console.error(
          "Error mengambil komentar:",
          error
        );

        setComments([]);
      } finally {
        setCommentsLoading(false);
      }
    };

    loadComments();
  }, [loaded]);

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);

    if (!target) return;

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setMenuOpen(false);
  };

  /* =========================================================
     THEME TOGGLE
  ========================================================= */

  const toggleTheme = () => {
    setDarkMode((current) => !current);
  };

  /* =========================================================
     SUBMIT COMMENT
  ========================================================= */

  const handleComment = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanComment = comment.trim();

    if (
      !cleanName ||
      !cleanComment ||
      commentLoading
    ) {
      return;
    }

    setCommentLoading(true);

    try {
      const { data, error } = await supabase
        .from("comments")
        .insert({
          name: cleanName,
          message: cleanComment,
        })
        .select(
          "id, name, message, created_at"
        )
        .single();

      if (error) {
        console.error(
          "Gagal menyimpan komentar:",
          error
        );

        alert(
          "Komentar gagal disimpan. Cek koneksi Supabase dan RLS."
        );

        return;
      }

      if (data) {
        setComments((current) => [
          data as Comment,
          ...current,
        ]);
      }

      setName("");
      setComment("");
      setCommentSent(true);

      window.setTimeout(() => {
        setCommentSent(false);
      }, 2500);
    } catch (error) {
      console.error("Error:", error);

      alert(
        "Terjadi kesalahan saat mengirim komentar."
      );
    } finally {
      setCommentLoading(false);
    }
  };

  /* =========================================================
     DELETE COMMENT
  ========================================================= */

  const deleteComment = async (id: number) => {
    const confirmed = window.confirm(
      "Yakin ingin menghapus komentar ini?"
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(
          "Gagal menghapus komentar:",
          error
        );

        alert(
          "Komentar gagal dihapus. Cek permission Supabase."
        );

        return;
      }

      setComments((current) =>
        current.filter(
          (item) => item.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Error menghapus komentar:",
        error
      );

      alert(
        "Terjadi kesalahan saat menghapus komentar."
      );
    }
  };

  /* =========================================================
     FORMAT DATE
  ========================================================= */

  const formatDate = (date?: string) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat(
      "id-ID",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(parsedDate);
  };

  /* =========================================================
     LOADING SCREEN
  ========================================================= */

  if (!loaded) {
    return (
      <div className="loading-screen">
        <div className="loader-content">
          <p className="loader-small">
            PORTFOLIO / 2026
          </p>

          <h1 className="loader-name">
            AULIA
            <span>FAIROSA NUR AINI</span>
          </h1>

          <div className="loader-line">
            <span />
          </div>

          <p className="loader-small">
            ILMU KOMUNIKASI · PHOTOGRAPHY · EDITING
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <main>
      {/* SCROLL PROGRESS */}

      <div
        className="scroll-progress"
        style={{
          width: `${scrollProgress}%`,
        }}
      />

      {/* HEADER */}

      <header
        className={`site-header ${
          scrolled ? "is-scrolled" : ""
        }`}
      >
        <div className="header-inner">
          <button
            className="brand"
            onClick={() =>
              scrollToSection("home")
            }
            aria-label="Kembali ke Home"
          >
            <span>A.</span>
            <strong>AULIA</strong>
          </button>

          <nav className="desktop-nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={
                  activeSection === item.id
                    ? "active"
                    : ""
                }
                onClick={() =>
                  scrollToSection(item.id)
                }
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="header-actions">
            <button
              className="theme-button"
              onClick={toggleTheme}
              aria-label="Ganti tema"
            >
              {darkMode ? (
                <Sun size={17} />
              ) : (
                <Moon size={17} />
              )}
            </button>

            <button
              className="header-contact"
              onClick={() =>
                scrollToSection("contact")
              }
            >
              LET&apos;S TALK
              <ArrowUpRight size={15} />
            </button>

            <button
              className="mobile-menu-button"
              onClick={() =>
                setMenuOpen(
                  (value) => !value
                )
              }
              aria-label="Menu"
            >
              {menuOpen ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}

        {menuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-inner">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    scrollToSection(item.id)
                  }
                >
                  <span>{item.label}</span>
                  <ArrowUpRight size={17} />
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* HERO */}

      <section
        id="home"
        className="hero"
      >
        <div className="hero-noise" />

        <div className="hero-container">
          <div className="hero-top">
            <p className="hero-label">
              <span className="label-line" />
              PORTFOLIO — 2026
            </p>

            <p className="hero-location">
              INDONESIA / CREATIVE PRACTICE
            </p>
          </div>

          <div className="hero-layout">
            <div className="hero-copy reveal">
              <p className="eyebrow">
                ILMU KOMUNIKASI
              </p>

              <h1 className="hero-title">
                AULIA
                <em>FAIROSA</em>
                NUR AINI
              </h1>

              <p className="hero-description">
                Communication student with a
                passion for photography, visual
                storytelling, and photo &amp;
                video editing.
              </p>

              <div className="hero-buttons">
                <button
                  className="primary-button"
                  onClick={() =>
                    scrollToSection(
                      "photography"
                    )
                  }
                >
                  EXPLORE WORK
                  <ArrowUpRight size={17} />
                </button>

                <button
                  className="text-button"
                  onClick={() =>
                    scrollToSection("about")
                  }
                >
                  DISCOVER MORE
                  <ArrowDown size={15} />
                </button>
              </div>
            </div>

            <div className="hero-photo-wrap reveal">
              <img
                ref={heroPhotoRef}
                src="/photo-1.jpg"
                alt="Aulia Fairosa Nur Aini"
                className="hero-photo"
              />

              <div className="hero-photo-caption">
                <span>01</span>
                <span>
                  AULIA / PORTRAIT
                </span>
              </div>
            </div>
          </div>

          <div className="hero-bottom">
            <div className="scroll-indicator">
              <span className="scroll-circle">
                <ArrowDown size={15} />
              </span>
              SCROLL TO EXPLORE
            </div>

            <div className="hero-bottom-text">
              COMMUNICATION
              <span>×</span>
              PHOTOGRAPHY
              <span>×</span>
              EDITING
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}

      <section className="marquee-section">
        <div className="marquee-track">
          <span>COMMUNICATION</span>
          <b>✦</b>
          <span>PHOTOGRAPHY</span>
          <b>✦</b>
          <span>VISUAL STORYTELLING</span>
          <b>✦</b>
          <span>PHOTO &amp; VIDEO EDITING</span>
          <b>✦</b>
          <span>COMMUNICATION</span>
          <b>✦</b>
          <span>PHOTOGRAPHY</span>
          <b>✦</b>
        </div>
      </section>

      {/* ABOUT */}

      <section
        id="about"
        className="section about-section"
      >
        <div className="section-container">
          <div className="section-heading reveal">
            <span className="section-index">
              01 / ABOUT
            </span>

            <div className="heading-side">
              <span>WHO I AM</span>
            </div>
          </div>

          <div className="about-grid">
            <h2 className="about-big reveal">
              Every message
              <br />
              has a <em>story.</em>
            </h2>

            <div className="about-copy reveal">
              <p>
                Saya percaya bahwa komunikasi
                bukan hanya tentang berbicara.
                Cara kita menyampaikan pesan,
                memilih visual, dan membangun
                sebuah cerita juga menjadi
                bagian penting dari komunikasi.
              </p>

              <p>
                Saya memiliki ketertarikan pada
                Ilmu Komunikasi, fotografi,
                visual storytelling, serta
                proses editing foto dan video.
                Portfolio ini menjadi ruang
                untuk menampilkan proses belajar
                dan karya yang saya kembangkan.
              </p>

              <button
                className="line-link"
                onClick={() =>
                  scrollToSection(
                    "communication"
                  )
                }
              >
                EXPLORE MY SKILLS
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>

          <div className="about-stats reveal">
            <div>
              <strong>01</strong>
              <span>COMMUNICATION</span>
            </div>

            <div>
              <strong>02</strong>
              <span>PHOTOGRAPHY</span>
            </div>

            <div>
              <strong>03</strong>
              <span>EDITING</span>
            </div>

            <div>
              <strong>∞</strong>
              <span>CREATIVE PROCESS</span>
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNICATION */}

      <section
        id="communication"
        className="section communication-section"
      >
        <div className="section-container">
          <div className="section-heading reveal">
            <span className="section-index">
              02 / COMMUNICATION
            </span>

            <div className="heading-side">
              <span>
                THE WAY I CONNECT
              </span>
            </div>
          </div>

          <div className="communication-intro reveal">
            <h2>
              Communication
              <br />
              is <em>connection.</em>
            </h2>

            <p>
              Kemampuan komunikasi saya
              dikembangkan melalui proses
              belajar, presentasi,
              storytelling, membuat konsep,
              dan memahami bagaimana sebuah
              pesan dapat diterima oleh
              audiens.
            </p>
          </div>

          <div className="skill-list reveal">
            {communicationSkills.map(
              (skill, index) => (
                <div
                  className="skill-row"
                  key={skill}
                >
                  <span>
                    {String(
                      index + 1
                    ).padStart(2, "0")}
                  </span>

                  <strong>{skill}</strong>

                  <ArrowUpRight size={17} />
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* JOURNEY */}

      <section
        id="journey"
        className="section journey-section"
      >
        <div className="section-container">
          <div className="section-heading reveal">
            <span className="section-index">
              03 / JOURNEY
            </span>

            <div className="heading-side">
              <span>LEARNING PROCESS</span>
            </div>
          </div>

          <div className="journey-list">
            {journey.map((item) => (
              <article
                className="journey-item reveal"
                key={item.number}
              >
                <span className="journey-number">
                  {item.number}
                </span>

                <span className="journey-year">
                  {item.year}
                </span>

                <div className="journey-content">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>

                <ArrowUpRight
                  className="journey-arrow"
                  size={21}
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PHOTOGRAPHY */}

      <section
        id="photography"
        className="section photography-section"
      >
        <div className="section-container">
          <div className="section-heading reveal">
            <span className="section-index">
              04 / PHOTOGRAPHY
            </span>

            <div className="heading-side">
              <span>
                CAPTURE THE MOMENT
              </span>
            </div>
          </div>

          <div className="photo-intro reveal">
            <div>
              <p className="eyebrow">
                PHOTOGRAPHY
              </p>

              <h2>
                Moments
                <br />
                worth{" "}
                <em>remembering.</em>
              </h2>
            </div>

            <p>
              Fotografi menjadi salah satu
              cara saya menggabungkan
              komunikasi dan visual. Saya
              tertarik pada portrait,
              dokumentasi, street
              photography, serta visual
              storytelling.
            </p>
          </div>

          <div className="photo-horizontal">
            {photos.map((photo, index) => (
              <article
                className="photo-card reveal"
                key={photo.src}
              >
                <div className="photo-image">
                  <img
                    src={photo.src}
                    alt={photo.title}
                  />

                  <div className="photo-overlay">
                    <span>
                      {String(
                        index + 1
                      ).padStart(2, "0")}
                    </span>

                    <Camera size={20} />
                  </div>
                </div>

                <div className="photo-meta">
                  <div>
                    <h3>{photo.title}</h3>
                    <p>{photo.category}</p>
                  </div>

                  <ArrowUpRight size={18} />
                </div>
              </article>
            ))}
          </div>

          <div className="photo-skills reveal">
            {photographySkills.map(
              (skill) => (
                <span key={skill}>
                  {skill}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* EDITING */}

      <section
        id="editing"
        className="section editing-section"
      >
        <div className="section-container">
          <div className="section-heading reveal">
            <span className="section-index">
              05 / EDITING
            </span>

            <div className="heading-side">
              <span>
                SHAPE THE VISUAL
              </span>
            </div>
          </div>

          <div className="editing-layout">
            <div className="editing-copy reveal">
              <p className="eyebrow">
                PHOTO &amp; VIDEO EDITING
              </p>

              <h2 className="editing-title">
                From raw
                <br />
                to <em>story.</em>
              </h2>

              <p className="editing-description">
                Editing bukan hanya
                memperbaiki gambar. Saya
                menggunakan warna, tone,
                composition, rhythm, dan
                detail untuk membuat visual
                memiliki mood serta pesan
                yang lebih kuat.
              </p>

              <div className="editing-tools">
                {editingSkills.map(
                  (skill) => (
                    <span key={skill}>
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="editing-visual reveal">
              <img
                src="/photo-2.jpg"
                alt="Aulia editing photography"
                className="editing-image-main"
              />

              <div className="editing-image-label">
                <span>
                  BEFORE / AFTER
                </span>

                <ArrowUpRight size={17} />
              </div>

              <img
                src="/photo3.jpg"
                alt="Aulia visual work"
                className="editing-image-small"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SELECTED WORK */}

      <section className="section projects-section">
        <div className="section-container">
          <div className="section-heading reveal">
            <span className="section-index">
              06 / SELECTED WORK
            </span>

            <div className="heading-side">
              <span>
                RECENT CREATIVE DIRECTION
              </span>
            </div>
          </div>

          <div className="projects-list">
            {projects.map((project) => (
              <article
                className="project-row reveal"
                key={project.number}
              >
                <span className="project-number">
                  {project.number}
                </span>

                <div className="project-main">
                  <span>
                    {project.category}
                  </span>

                  <h3>{project.title}</h3>

                  <p>
                    {project.description}
                  </p>
                </div>

                <button
                  className="project-action"
                  onClick={() =>
                    scrollToSection(
                      "contact"
                    )
                  }
                  aria-label={`Hubungi Aulia tentang ${project.title}`}
                >
                  <ArrowUpRight size={21} />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}

      <section
        id="contact"
        className="section contact-section"
      >
        <div className="section-container">
          <div className="section-heading reveal">
            <span className="section-index">
              07 / CONTACT
            </span>

            <div className="heading-side">
              <span>
                LET&apos;S CONNECT
              </span>
            </div>
          </div>

          <div className="contact-top reveal">
            <p className="eyebrow">
              HAVE A PROJECT / IDEA?
            </p>

            <h2 className="contact-title">
              Let&apos;s create
              <br />
              something{" "}
              <em>meaningful.</em>
            </h2>
          </div>

          <div className="contact-grid">
            {/* CONTACT LINKS */}

            <div className="contact-links reveal">
              <a href="mailto:aulia@example.com">
                <span>
                  <Mail size={18} />
                  EMAIL
                </span>

                <strong>
                  aulia@example.com
                </strong>

                <ArrowUpRight size={17} />
              </a>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>
                  <Instagram size={18} />
                  INSTAGRAM
                </span>

                <strong>
                  @auliafairosa
                </strong>

                <ArrowUpRight size={17} />
              </a>
            </div>

            {/* COMMENT FORM */}

            <form
              className="contact-form reveal"
              onSubmit={handleComment}
            >
              <div className="form-row">
                <label htmlFor="name">
                  NAMA
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="Nama kamu"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  required
                  maxLength={80}
                />
              </div>

              <div className="form-row">
                <label htmlFor="comment">
                  PESAN / KOMENTAR
                </label>

                <textarea
                  id="comment"
                  placeholder="Tulis pesan atau komentar..."
                  rows={5}
                  value={comment}
                  onChange={(event) =>
                    setComment(
                      event.target.value
                    )
                  }
                  required
                  maxLength={500}
                />
              </div>

              <button
                className="submit-button"
                type="submit"
                disabled={commentLoading}
              >
                {commentLoading ? (
                  <>
                    MENGIRIM...
                    <Send size={16} />
                  </>
                ) : commentSent ? (
                  <>
                    TERKIRIM
                    <Check size={17} />
                  </>
                ) : (
                  <>
                    KIRIM KOMENTAR
                    <Send size={16} />
                  </>
                )}
              </button>

              <p className="form-note">
                Komentar akan disimpan ke
                database dan langsung
                ditampilkan di halaman ini.
              </p>
            </form>
          </div>

          {/* COMMENTS */}

          <div className="comments-area reveal">
            <div className="comments-header">
              <div>
                <p className="eyebrow">
                  VISITOR COMMENTS
                </p>

                <h3>
                  What people
                  <br />
                  <em>say.</em>
                </h3>
              </div>

              <span>
                {comments.length} COMMENTS
              </span>
            </div>

            {commentsLoading ? (
              <div className="empty-comments">
                <p>
                  Memuat komentar...
                </p>

                <span>
                  Mohon tunggu sebentar.
                </span>
              </div>
            ) : comments.length === 0 ? (
              <div className="empty-comments">
                <p>
                  Belum ada komentar.
                </p>

                <span>
                  Jadilah orang pertama
                  yang meninggalkan pesan.
                </span>
              </div>
            ) : (
              <div className="comments-list">
                {comments.map((item) => (
                  <article
                    className="comment-item"
                    key={item.id}
                  >
                    <div className="comment-avatar">
                      {item.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="comment-content">
                      <div className="comment-top">
                        <strong>
                          {item.name}
                        </strong>

                        <span>
                          {formatDate(
                            item.created_at ??
                              item.date
                          )}
                        </span>
                      </div>

                      <p>
                        {item.message}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          deleteComment(
                            item.id
                          )
                        }
                      >
                        HAPUS
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span>A.</span>

            <div>
              <strong>
                AULIA FAIROSA NUR AINI
              </strong>

              <p>
                Communication · Photography
                <br />
                Photo &amp; Video Editing
              </p>
            </div>
          </div>

          <div className="footer-info">
            <span>powered by</span>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              INSTAGRAM
              <ArrowUpRight size={14} />
            </a>
          </div>

          <button
            className="back-top"
            onClick={() =>
              scrollToSection("home")
            }
          >
            BACK TO TOP
            <ArrowUp size={15} />
          </button>
        </div>

        <div className="footer-bottom">
          <span>
            © 2026 AULIA FAIROSA NUR AINI
          </span>

          <span>
            BY KUKZ 2026
          </span>
        </div>
      </footer>
    </main>
  );
}