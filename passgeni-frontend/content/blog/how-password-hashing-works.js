export const contentHtml = `
<h2>Why passwords are hashed, not encrypted</h2>
<p>Encryption is reversible — you need the original value back later. Password verification doesn't require the original password; it requires checking whether a provided password matches the stored one. Hashing is one-way: you hash the login attempt and compare hashes. If your database is breached, attackers get hashes, not passwords. The security question becomes: how hard is it to reverse those hashes?</p>

<h2>Why MD5 and SHA-1 are broken for passwords</h2>
<p>MD5 and SHA-1 are fast general-purpose hashes designed for data integrity, not password storage. Fast is the problem. A modern GPU can compute 100 billion MD5 hashes per second. A cracker with a GPU rig and the common password wordlists can crack a significant fraction of MD5-hashed passwords from a real breach database within hours. Do not use MD5, SHA-1, or SHA-256 for password storage.</p>

<h2>bcrypt: the workhorse</h2>
<p>bcrypt was designed in 1999 specifically for password hashing. It's deliberately slow, parameterised by a cost factor. At cost factor 10, a modern CPU performs about 100 hashes/second. At cost factor 12, about 25/second. This is intentional: slow hashing makes brute force infeasible regardless of computational advances, because you can increase the cost factor as hardware improves.</p>
<p>bcrypt has a 72-character password limit (passwords longer than 72 bytes are silently truncated) and uses an older cipher (Blowfish). It remains acceptable in 2025 but has been superseded for new implementations.</p>

<h2>Argon2: the current standard</h2>
<p>Argon2 won the Password Hashing Competition in 2015 and is the current recommendation for new implementations. It has three variants: Argon2d (GPU-resistant, for applications without side-channel risk), Argon2i (side-channel resistant), and Argon2id (the recommended hybrid for most uses). Argon2 is parameterised on time cost, memory cost, and parallelism — making it resistant to hardware-accelerated attacks in ways bcrypt is not.</p>
<p>For new applications in 2025: use Argon2id with at minimum m=47104 (46 MB), t=1, p=1. These are OWASP's 2025 recommendations for interactive logins with 1GB+ server RAM available.</p>

<h2>Migrating legacy MD5 hashes</h2>
<p>If you inherited a system with MD5 password hashes, migrate on login: when a user successfully authenticates with their MD5 hash, immediately re-hash their plaintext password with Argon2 and update the stored value. Over time your database migrates from MD5 to Argon2 without requiring a forced password reset or a plaintext password export.</p>
<p>The PassGeni Team API stores all API key hashes as SHA-256 with a high-entropy random salt — appropriate for API keys (which are longer and more random than user passwords) but not a substitute for Argon2 on user password storage.</p>
`;