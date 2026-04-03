import { ArrowRightIcon, CodeIcon, SparklesIcon } from '@/components/icons';
import { FadeInScale, FadeInUp, FloatingOrb } from '@/components/motion-wrappers';
import { SnakeBoard } from '@/components/SnakeBoard';
import { Button, Card, CardContent } from '@/components/ui';

export default function Page() {
  const featureCards = [
    {
      title: 'Ingeniería con criterio',
      text: 'Me gusta construir productos digitales sólidos, rápidos y bien pensados, cuidando tanto la arquitectura como la experiencia final.',
    },
    {
      title: 'Personalidad sin artificios',
      text: 'No busco una web fría ni estándar: prefiero una experiencia elegante, clara y con identidad propia, sin artificios innecesarios.',
    },
    {
      title: 'Mentalidad de producto',
      text: 'No me centro solo en escribir código. También valoro rendimiento, claridad, mantenibilidad y el impacto real de lo que se lanza.',
    },
  ];

  const featuredProjects = [
    {
      title: 'Frontend Engineering',
      description:
        'Desarrollo de interfaces cuidadas, mantenibles y rápidas, con foco en experiencia de usuario, rendimiento y calidad de código.',
      tags: ['Next.js', 'React', 'TypeScript'],
    },
    {
      title: 'Arquitectura y rendimiento',
      description:
        'Interés especial por la escalabilidad del frontend, la organización del código, el caching y la optimización real en producción.',
      tags: ['Performance', 'Caching', 'DX'],
    },
    {
      title: 'Producto digital',
      description:
        'Me gusta trabajar pensando no solo en implementar, sino en construir soluciones útiles, claras y sostenibles en el tiempo.',
      tags: ['Product', 'UX', 'Impact'],
    },
    {
      title: 'Side projects',
      description:
        'Exploro ideas propias, experimentos visuales y pequeños productos con potencial de crecer más allá de una simple demo.',
      tags: ['Indie hacking', 'Games', 'Experiments'],
    },
  ];

  const socialLinks = [
    { label: 'Email', href: 'mailto:hola@carlosperezroca.com' },
    { label: 'GitHub', href: 'https://github.com/carlosperezroca' },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/developercarlosperez/',
    },
  ];

  return (
    <div className="min-h-screen bg-[#07070a] text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.18),_transparent_30%),radial-gradient(circle_at_80%_20%,_rgba(255,255,255,0.08),_transparent_20%),linear-gradient(to_bottom,_rgba(255,255,255,0.02),_transparent)]" />
      <FloatingOrb className="w-72 h-72 bg-fuchsia-500/20 top-8 -left-12" />
      <FloatingOrb className="w-96 h-96 bg-cyan-500/10 bottom-12 right-0" />

      <div className="relative max-w-7xl mx-auto px-6 py-8 md:px-10 md:py-10">
        <header className="flex items-center justify-between gap-4 mb-14">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shadow-lg">
              <SparklesIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm text-white/60">carlosperezroca.com</div>
              <div className="font-semibold tracking-wide">
                Carlos Pérez Roca · Senior Software Engineer
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-3 text-sm text-white/70">
            <a href="#about" className="hover:text-white transition-colors">
              Sobre mí
            </a>
            <a href="#projects" className="hover:text-white transition-colors">
              Proyectos
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Contacto
            </a>
          </nav>
        </header>

        <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center min-h-[70vh]">
          <div>
            <FadeInUp>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 mb-6">
                <CodeIcon className="w-4 h-4" />
                Software, producto y experiencias digitales bien pensadas.
              </div>

              <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[0.95] max-w-3xl">
                Frontend, producto y experiencias web
                <span className="text-white/55"> con criterio, claridad </span>y
                atención al detalle.
              </h1>

              <p className="mt-6 max-w-2xl text-lg md:text-xl text-white/65 leading-relaxed">
                Soy Carlos Pérez Roca, ingeniero de software centrado en
                frontend y producto digital. Disfruto construyendo experiencias
                bien pensadas, rápidas y mantenibles, sin renunciar a una capa
                visual con personalidad. Esta web mezcla presentación personal,
                enfoque profesional y una forma de construir con detalle,
                claridad y personalidad.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#projects">
                  <Button className="px-6 py-4 text-base">
                    Ver enfoque
                    <ArrowRightIcon className="w-4 h-4" />
                  </Button>
                </a>
                <a href="#contact">
                  <Button variant="outline" className="px-6 py-4 text-base">
                    Contactar
                  </Button>
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-3 text-sm text-white/60">
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  Next.js
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  React
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  TypeScript
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  Performance
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  Product mindset
                </span>
              </div>
            </FadeInUp>
          </div>

          <FadeInScale>
            <SnakeBoard />
          </FadeInScale>
        </section>

        <section id="about" className="grid md:grid-cols-3 gap-5 mt-16">
          {featureCards.map((item) => (
            <Card key={item.title} className="bg-white/5 backdrop-blur-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-white/65 leading-relaxed">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section id="projects" className="mt-20">
          <div className="flex items-end justify-between gap-6 mb-6">
            <div>
              <div className="text-sm uppercase tracking-[0.25em] text-white/45 mb-2">
                Showcase
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold">
                Qué puedo aportar
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
            {featuredProjects.map((item) => (
              <Card
                key={item.title}
                className="bg-white/[0.04] hover:bg-white/[0.06] transition-colors"
              >
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3 text-white">
                    {item.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed mb-4">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/65"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="contact" className="mt-20 mb-8">
          <Card className="rounded-[2rem] bg-gradient-to-br from-white/10 to-white/[0.03] backdrop-blur-xl overflow-hidden">
            <CardContent className="p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="text-sm uppercase tracking-[0.25em] text-white/45 mb-2">
                  Contacto
                </div>
                <h2 className="text-3xl font-semibold mb-3">Hablemos</h2>
                <p className="text-white/65 max-w-2xl">
                  Si te interesa mi perfil, quieres hablar de frontend,
                  arquitectura, producto o simplemente te ha gustado la idea de
                  esta web, aquí tienes una forma directa de contactar conmigo.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="outline" className="px-4 py-3">
                      {item.label}
                    </Button>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
