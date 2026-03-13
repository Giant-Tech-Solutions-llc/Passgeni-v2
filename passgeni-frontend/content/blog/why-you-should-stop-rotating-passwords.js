export const contentHtml = `
<h2>Where the rotation requirement came from</h2>
<p>Mandatory password rotation became IT policy orthodoxy in the 1980s and 1990s, based on the theory that even if a password was compromised, the attacker would lose access at the next rotation. This made sense when passwords were often stored in plaintext and offline cracking wasn't fast enough to defeat long complex passwords.</p>
<p>In 2025, neither assumption holds.</p>

<h2>What the research actually shows</h2>
<p>A landmark 2010 study from Carnegie Mellon University found that users who were forced to change passwords regularly converged on predictable patterns: incrementing a number, changing a letter to a symbol variant, appending the current month. Forced rotation didn't produce better passwords — it produced worse ones with a veneer of change.</p>
<p>Microsoft's Security team published similar findings in 2019, announcing they were removing periodic password expiration from their baseline security recommendations. NIST followed with explicit guidance against mandatory rotation in SP 800-63B. The UK's NCSC (National Cyber Security Centre) made the same recommendation. The consensus among security standards bodies is now clear.</p>

<h2>The current NIST position</h2>
<p>NIST SP 800-63B Section 5.1.1.2 states: "Verifiers SHOULD NOT require memorized secrets to be changed arbitrarily (e.g., periodically). However, verifiers SHALL force a change if there is evidence of compromise of the authenticator."</p>
<p>The operative word is "evidence." Don't rotate on a calendar — rotate when you know or strongly suspect a breach.</p>

<h2>When to actually change your password</h2>
<p>There are four legitimate reasons to change a password: the site was breached and your credentials may have been exposed; you shared the password with someone and that access should be revoked; you typed the password on an untrusted device; or you suspect your device has malware.</p>
<p>Outside of these cases, changing a strong unique password that hasn't been compromised provides no security benefit and actively encourages the patterns that make passwords weaker.</p>
`;