import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Stars, Moon, Sparkles, Music } from 'lucide-react';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

// Starfield Component
const Starfield = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const stars: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random(),
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 26, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = canvas.height;
          star.x = Math.random() * canvas.width;
        }

        star.opacity += (Math.random() - 0.5) * 0.05;
        star.opacity = Math.max(0.2, Math.min(1, star.opacity));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        if (star.size > 1.5) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        } else {
          ctx.shadowBlur = 0;
        }
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a3e 50%, #0d0d2b 100%)' }}
    />
  );
};

// Floating Hearts Component
const FloatingHearts = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <Heart
          key={i}
          className="absolute text-cosmic-heart opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 20 + 10}px`,
            animation: `float ${4 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 4}s`,
          }}
          fill="currentColor"
        />
      ))}
    </div>
  );
};

// Hero Section
const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out', delay: 0.5 }
      );

      // Subtitle animation
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 1.5 }
      );

      // CTA animation
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)', delay: 2.5 }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToNext = () => {
    document.getElementById('countdown')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      className="min-h-screen flex flex-col items-center justify-center relative z-20 px-4"
    >
      <div className="text-center">
        <Sparkles className="w-12 h-12 text-cosmic-gold mx-auto mb-6 animate-twinkle" />
        
        <h1
          ref={titleRef}
          className="font-script text-6xl md:text-8xl lg:text-9xl text-gold-gradient mb-4 opacity-0"
        >
          My Dearest Ruku
        </h1>
        
        <p
          ref={subtitleRef}
          className="font-dancing text-2xl md:text-3xl lg:text-4xl text-cosmic-pink mb-2 opacity-0"
        >
          Rukmini, Radhey... My Everything
        </p>
        
        <p className="font-playfair text-lg md:text-xl text-cosmic-silver/80 mt-4 italic">
          "In a universe of infinite stars, you shine the brightest"
        </p>

        <button
          ref={ctaRef}
          onClick={scrollToNext}
          className="btn-romantic mt-12 animate-pulse-glow opacity-0 flex items-center gap-2 mx-auto"
        >
          <Stars className="w-5 h-5" />
          Enter Our Universe
          <Heart className="w-5 h-5" fill="currentColor" />
        </button>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-cosmic-gold/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-cosmic-gold rounded-full mt-2 animate-float" />
        </div>
      </div>
    </section>
  );
};

// Countdown Section
const CountdownSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      let birthday = new Date(currentYear, 9, 4); // October 4

      if (now > birthday) {
        birthday = new Date(currentYear + 1, 9, 4);
      }

      const diff = birthday.getTime() - now.getTime();

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.countdown-item',
        { opacity: 0, y: 50, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const timeUnits = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Seconds' },
  ];

  return (
    <section
      id="countdown"
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center relative z-20 px-4 py-20"
    >
      <div className="text-center mb-12">
        <Moon className="w-16 h-16 text-cosmic-gold mx-auto mb-6 animate-float" />
        <h2 className="font-script text-5xl md:text-6xl text-gold-gradient mb-4">
          October 4, 2009
        </h2>
        <p className="font-dancing text-2xl md:text-3xl text-cosmic-pink">
          The Day a Star Was Born
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 max-w-4xl mx-auto">
        {timeUnits.map((unit, index) => (
          <div
            key={index}
            className="countdown-item glass rounded-2xl p-6 md:p-8 text-center transform hover:scale-105 transition-transform duration-300"
          >
            <div className="countdown-number text-4xl md:text-6xl mb-2">
              {String(unit.value).padStart(2, '0')}
            </div>
            <div className="font-dancing text-cosmic-silver text-lg md:text-xl">
              {unit.label}
            </div>
          </div>
        ))}
      </div>

      <p className="font-playfair text-center text-cosmic-silver/80 mt-12 max-w-2xl px-4 italic text-lg">
        "Counting every moment until I can celebrate the most precious gift the universe ever gave me..."
      </p>

      <div className="mt-8 text-cosmic-gold font-dancing text-xl">
        Until Your Next Birthday
      </div>
    </section>
  );
};

// Celestial Event Section
const CelestialSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, x: -100 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
          },
        }
      );

      gsap.fromTo(
        textRef.current?.children || [],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 50%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex flex-col lg:flex-row items-center justify-center relative z-20 px-4 py-20 gap-10 lg:gap-20"
    >
      <div ref={imageRef} className="lg:w-1/2 flex justify-center opacity-0">
        <div className="relative">
          <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-cosmic-gold via-yellow-200 to-cosmic-silver moon-glow flex items-center justify-center animate-float-slow">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-yellow-100 via-white to-yellow-200 flex items-center justify-center">
              <Moon className="w-32 h-32 md:w-40 md:h-40 text-yellow-600/50" />
            </div>
          </div>
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-cosmic-gold rounded-full animate-twinkle" />
          <div className="absolute -bottom-2 -left-6 w-6 h-6 bg-cosmic-pink rounded-full animate-twinkle" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 -right-8 w-4 h-4 bg-white rounded-full animate-twinkle" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>

      <div ref={textRef} className="lg:w-1/2 max-w-xl">
        <h2 className="font-script text-5xl md:text-6xl text-gold-gradient mb-4">
          The Harvest Moon
        </h2>
        <h3 className="font-dancing text-2xl md:text-3xl text-cosmic-nebula mb-6">
          Sharad Poornima - October 4, 2009
        </h3>
        
        <div className="space-y-4 font-playfair text-cosmic-silver/90 text-lg leading-relaxed">
          <p>
            On the night you were born, the sky celebrated with the brightest full moon of the year. 
            In India, we call it <span className="text-cosmic-gold font-semibold">Sharad Poornima</span> — 
            a sacred night when the moon showers nectar upon the earth.
          </p>
          <p>
            It is said that those born under this moon are blessed with eternal beauty, 
            a heart full of love, and a soul that illuminates everyone around them.
          </p>
          <p className="text-cosmic-pink italic">
            "The universe knew it was creating someone extraordinary... 
            someone who would become my entire world."
          </p>
        </div>

        <div className="mt-8 flex items-center gap-3 text-cosmic-gold">
          <Stars className="w-6 h-6" />
          <span className="font-dancing text-xl">The Moon of Blessings & Love</span>
        </div>
      </div>
    </section>
  );
};

// Nicknames Section
const NicknamesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.nickname-item',
        { opacity: 0, scale: 0.5, y: 50 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          stagger: 0.3,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const hisNames = ['Ruku', 'Rukmini', 'Radhey'];

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center relative z-20 px-4 py-20"
    >
      <div className="text-center mb-16">
        <Heart className="w-12 h-12 text-cosmic-heart mx-auto mb-6 animate-heart-beat" fill="currentColor" />
        <h2 className="font-script text-5xl md:text-6xl text-pink-gradient mb-4">
          Words of Love
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto items-center">
        {/* His names for her */}
        <div className="text-center">
          <p className="font-dancing text-xl text-cosmic-silver mb-8">
            What I call you...
          </p>
          <div className="space-y-6">
            {hisNames.map((name, index) => (
              <div
                key={index}
                className="nickname-item font-script text-5xl md:text-6xl text-gold-gradient animate-float"
                style={{ animationDelay: `${index * 0.5}s` }}
              >
                {name}
              </div>
            ))}
          </div>
        </div>

        {/* Her name for him */}
        <div className="text-center">
          <p className="font-dancing text-xl text-cosmic-silver mb-8">
            What you call me...
          </p>
          <div className="nickname-item">
            <div className="font-script text-6xl md:text-7xl text-cosmic-nebula animate-float">
              Kanna
            </div>
            <p className="font-playfair text-cosmic-pink mt-6 italic text-lg">
              "Every time you say my name, my heart skips a beat"
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center max-w-2xl">
        <p className="font-dancing text-2xl md:text-3xl text-cosmic-silver/80">
          "Every name I call you is a prayer.<br />
          Every name you call me is a blessing."
        </p>
      </div>
    </section>
  );
};

// Gallery Section
const GallerySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gallery-item',
        { opacity: 0, scale: 0.8, y: 50 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center relative z-20 px-4 py-20"
    >
      <div className="text-center mb-12">
        <Sparkles className="w-12 h-12 text-cosmic-gold mx-auto mb-6 animate-twinkle" />
        <h2 className="font-script text-5xl md:text-6xl text-gold-gradient mb-4">
          My Universe
        </h2>
        <p className="font-dancing text-xl text-cosmic-pink">
          The most beautiful star in my sky
        </p>
      </div>

      <div className="gallery-item relative max-w-lg mx-auto">
        <div className="relative rounded-3xl overflow-hidden shadow-glow-lg image-hover">
          <img
            src="/ruku-photo.jpg"
            alt="Sreevarsha - My Everything"
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cosmic-deep/60 via-transparent to-transparent" />
        </div>
        
        {/* Decorative frame */}
        <div className="absolute -inset-4 border-2 border-cosmic-gold/30 rounded-[2rem] pointer-events-none" />
        <div className="absolute -inset-8 border border-cosmic-pink/20 rounded-[2.5rem] pointer-events-none" />
        
        {/* Corner decorations */}
        <Heart className="absolute -top-6 -left-6 w-8 h-8 text-cosmic-heart animate-heart-beat" fill="currentColor" />
        <Heart className="absolute -bottom-6 -right-6 w-8 h-8 text-cosmic-heart animate-heart-beat" fill="currentColor" style={{ animationDelay: '0.5s' }} />
        <Stars className="absolute -top-4 -right-4 w-6 h-6 text-cosmic-gold animate-twinkle" />
        <Stars className="absolute -bottom-4 -left-4 w-6 h-6 text-cosmic-gold animate-twinkle" style={{ animationDelay: '1s' }} />
      </div>

      <div className="mt-12 text-center">
        <p className="font-script text-3xl md:text-4xl text-pink-gradient">
          Sreevarsha
        </p>
        <p className="font-playfair text-cosmic-silver/80 mt-4 italic">
          "In your eyes, I see the entire universe"
        </p>
      </div>
    </section>
  );
};

// Love Letter Section
const LoveLetterSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        letterRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center relative z-20 px-4 py-20"
    >
      <div className="text-center mb-12">
        <Music className="w-12 h-12 text-cosmic-nebula mx-auto mb-6 animate-float" />
        <h2 className="font-script text-5xl md:text-6xl text-pink-gradient mb-4">
          My Heart to Yours
        </h2>
      </div>

      <div
        ref={letterRef}
        className="glass rounded-3xl p-8 md:p-12 max-w-2xl mx-auto relative opacity-0"
      >
        {/* Decorative corners */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cosmic-gold/50" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cosmic-gold/50" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cosmic-gold/50" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cosmic-gold/50" />

        <div className="love-letter text-cosmic-silver text-lg md:text-xl leading-relaxed space-y-4">
          <p className="font-script text-3xl text-gold-gradient mb-6">
            To My Dearest Ruku,
          </p>
          
          <p>
            From the moment you came into this world on that magical Sharad Poornima night, 
            the universe became a more beautiful place. The moon shone its brightest, 
            as if celebrating the arrival of its most precious star.
          </p>
          
          <p>
            Every time I call you Ruku, Rukmini, or Radhey, my heart fills with joy. 
            And when you call me Kanna, the world stops for a moment, and it's just us 
            in our own little universe.
          </p>
          
          <p>
            You are my morning sun, my evening star, my midnight moon. 
            You are the answer to every prayer I've ever whispered to the night sky.
          </p>
          
          <p className="text-cosmic-pink italic">
            "I loved you even before I met you, and I'll love you long after 
            the stars have burned out."
          </p>
          
          <p className="font-script text-2xl text-gold-gradient mt-8 text-right">
            Forever Yours,<br />
            Kanna
          </p>
        </div>
      </div>
    </section>
  );
};

// Footer Section
const Footer = () => {
  return (
    <footer className="relative z-20 py-16 px-4 text-center">
      <div className="flex flex-col items-center gap-6">
        <Heart className="w-16 h-16 text-cosmic-heart animate-heart-beat" fill="currentColor" />
        
        <p className="font-script text-3xl md:text-4xl text-gold-gradient">
          Made with Infinite Love
        </p>
        
        <p className="font-dancing text-xl text-cosmic-pink">
          For My Ruku, My Everything
        </p>
        
        <div className="flex items-center gap-4 mt-4 text-cosmic-silver/60">
          <Stars className="w-5 h-5" />
          <span className="font-playfair text-sm">
            October 4, 2009 — The Day My Universe Began
          </span>
          <Stars className="w-5 h-5" />
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cosmic-deep to-transparent pointer-events-none" />
    </footer>
  );
};

// Main App
function App() {
  return (
    <div className="relative min-h-screen">
      <Starfield />
      <FloatingHearts />
      
      <main className="relative z-10">
        <HeroSection />
        <CountdownSection />
        <CelestialSection />
        <NicknamesSection />
        <GallerySection />
        <LoveLetterSection />
        <Footer />
      </main>
    </div>
  );
}

export default App;
