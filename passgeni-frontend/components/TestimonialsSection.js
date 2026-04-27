import { useRef } from 'react';
import { IcStar } from '../lib/icons.js';

/**
 * TestimonialsSection — drop-in replacement for the homepage proof section.
 *
 * Fixes applied:
 *  1. Heading: "Real users. Real opinions." — "Real opinions." in #C8FF00
 *  2. Scroll speed: 80s (was 22s / too fast)
 *  3. Pauses on hover
 *  4. Infinite horizontal marquee (two cloned rows for seamless loop)
 *  5. Matches global proof-card style
 */

const TESTIMONIALS = [
  { name: 'Sadia R.',       role: 'Security Engineer',       stars: 5, text: "Finally a generator that doesn't give me 'T#k9!mQz'. The profession seeding is subtle but I actually remember my passwords now." },
  { name: 'Marcus T.',      role: 'Freelance Designer',      stars: 5, text: "The passphrase mode is what got me. I can actually say it over the phone. Used to hate that moment." },
  { name: 'Priya N.',       role: 'Pediatrician',            stars: 5, text: "I set it to Doctor, generated a passphrase, and used it for my hospital login. Haven't had to reset my password in 4 months." },
  { name: 'Dmitri K.',      role: 'Backend Developer',       stars: 5, text: "The DNA Score is the part I didn't know I needed. It helped me see that my 'strong' passwords were actually just long weak ones." },
  { name: 'Fatima A.',      role: 'Compliance Officer',      stars: 5, text: "We switched our team to PassGeni for credential generation. The HIPAA preset alone saves us a policy review every time someone onboards." },
  { name: 'James W.',       role: 'Penetration Tester',      stars: 5, text: "I test password generators for a living. PassGeni's client-side architecture is the real thing — checked the network tab, nothing leaves the browser." },
  { name: 'Sara M.',        role: 'Product Designer',        stars: 5, text: "Every other generator gives me a random string I immediately paste and forget. PassGeni gives me something I can actually recall when I need it offline." },
  { name: 'Ali H.',         role: 'SRE at a SaaS company',  stars: 5, text: "Bulk generation for staging environments used to take 20 minutes of scripting. Now it's one click and a CSV download." },
  { name: 'Chen L.',        role: 'CTO — HealthTech startup',stars: 5, text: "Zero storage is not a marketing claim here. I've verified the source. This is architecturally impossible to breach in the traditional sense." },
  { name: 'Rachel P.',      role: 'Lawyer',                  stars: 5, text: "I set it to Legal and got a passphrase I could actually type on my phone. That had never happened to me before with a generator." },
  { name: 'Kofi A.',        role: 'IT Administrator',        stars: 5, text: "Rolled this out to 40 staff members. Password reset tickets dropped 60% in the first month. The memorability thing is real." },
  { name: 'Isabella R.',    role: 'PhD Researcher',          stars: 5, text: "I appreciate that this is honest about what it does. Client-side, no storage, NIST-compliant. No overselling. Rare in this space." },
];

function StarRating({ count }) {
  return (
    <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
      {Array(count).fill(null).map((_, i) => (
        <IcStar key={i} size={12} color="#C8FF00" />
      ))}
    </div>
  );
}

function TestimonialCard({ item }) {
  return (
    <article className="testimonial-card" style={{ width: 300, flexShrink: 0 }}>
      <StarRating count={item.stars} />
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#999', lineHeight: 1.8, marginBottom: 20, fontStyle: 'italic' }}>
        "{item.text}"
      </p>
      <div>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 13, color: '#fff' }}>
          {item.name}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#666', marginTop: 4, letterSpacing: '0.06em' }}>
          {item.role}
        </div>
      </div>
    </article>
  );
}

export default function TestimonialsSection() {
  // Double the array so the marquee loops seamlessly
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section
      style={{ padding: '0 0 clamp(80px,10vw,120px)', overflow: 'hidden' }}
      aria-labelledby="testimonials-heading"
    >
      {/* Header */}
      <div style={{ padding: '0 clamp(20px,5vw,60px)', maxWidth: 1200, margin: '0 auto 48px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#888', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>
          what people say
        </div>
        <h2
          id="testimonials-heading"
          style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(26px,3.5vw,40px)', color: '#fff' }}
        >
          Real users.{' '}
          <span style={{ color: '#C8FF00' }}>Real opinions.</span>
        </h2>
      </div>

      {/* Marquee track — pauses on hover */}
      <div
        style={{ overflow: 'hidden', maskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)' }}
        aria-hidden="true"  /* decorative — screen readers skip */
      >
        <div className="testimonial-track">
          {doubled.map((item, i) => (
            <TestimonialCard key={i} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
