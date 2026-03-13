export const contentHtml = `
<h2>The XKCD passphrase revisited</h2>
<p>The 2011 XKCD comic "correct horse battery staple" popularised the passphrase concept. The argument: four random common words gives approximately 44 bits of entropy (assuming a dictionary of about 2,000 words), which is harder to crack than the typical 8-character complex password while being much easier to remember.</p>
<p>Thirteen years of evolution in dictionary attacks and hardware has changed some of the math. Here is the updated picture.</p>

<h2>What changed: smarter dictionary attacks</h2>
<p>Modern password cracking tools don't just test single words — they generate multi-word combinations. Hashcat's combinator attack and rule-based attack modes can efficiently test common word pair and word triple combinations. A passphrase built from the most common English words (from the top 1,000) faces a meaningfully reduced search space against a sophisticated attacker.</p>
<p>The critical variable is word selection method. A passphrase chosen by a human from words they find memorable ("sun cat happy blue") is predictable. A passphrase generated from a large wordlist using genuine cryptographic randomness is not.</p>

<h2>What didn't change: random passphrases are still excellent</h2>
<p>A passphrase generated from a 7,776-word Diceware list using cryptographic randomness gives approximately 12.9 bits of entropy per word. Four words: ~51 bits. Five words: ~64 bits. Six words: ~77 bits — which exceeds NIST's 80-bit strong threshold.</p>
<p>PassGeni's <a href="/#generator">passphrase mode</a> uses NIST SP 800-63B methodology: cryptographically random word selection from a calibrated wordlist, optional profession-aware seeding for memorability without reducing entropy, and live entropy display so you know exactly where you stand.</p>

<h2>When passphrases fail</h2>
<p>Passphrases underperform in three scenarios: sites with short password length limits (some still cap at 16 characters, which cuts a 5-word passphrase); systems that require symbols and numbers in a way that forces awkward modification of the passphrase; and cases where the user selects words non-randomly (favourites, song lyrics, proper names).</p>
<p>For maximum compatibility, PassGeni's passphrase mode can output in a hyphenated format (correct-horse-battery-staple) or with a number and symbol appended for sites that require them — while preserving the core entropy.</p>
`;