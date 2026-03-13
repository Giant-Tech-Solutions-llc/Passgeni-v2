export const contentHtml = `
<h2>What "unbreakable" actually means</h2>
<p>Unbreakable doesn't mean impossible to crack in theory — it means the expected time to crack exceeds any meaningful planning horizon. A password that would take longer than the age of the universe to crack given all the world's computing power is, for practical purposes, unbreakable. The question is: what does it take to reach that threshold in 2025?</p>

<h2>The entropy threshold</h2>
<p>Security professionals use 80 bits of entropy as the practical threshold for "strong" password security for most applications, with 128 bits as the target for high-value accounts. At 100 billion guesses per second (fast GPU against MD5), 80 bits of entropy gives you 10^24 seconds to crack — roughly 3 × 10^16 years.</p>
<p>Here is what it takes to reach 80 bits: a random password from 95 ASCII characters needs 13 characters. A random password from 95 characters needs only 12 to exceed 78 bits. A passphrase from a 7,776-word Diceware list needs 7 words for 90 bits.</p>

<h2>The character pool math</h2>
<p>Entropy = length × log₂(pool_size). Common pool sizes:</p>
<ul>
  <li>Lowercase only (26 chars): 4.7 bits per character</li>
  <li>Alphanumeric (62 chars): 5.95 bits per character</li>
  <li>Full ASCII printable (95 chars): 6.57 bits per character</li>
  <li>Full ASCII + common symbols (96 chars): 6.58 bits per character</li>
</ul>
<p>This is why password length matters much more than character set expansion. Going from 8 to 16 characters with the same pool doubles your entropy. Adding 10 extra symbols to the pool adds less than 0.1 bits per character.</p>

<h2>What PassGeni's "Unbreakable" rating means</h2>
<p>PassGeni labels passwords as "Unbreakable" when they exceed 120 bits of entropy. At that level, even a nation-state with a dedicated GPU cluster running for a century has less than a 1-in-10^15 chance of finding the password through brute force. The crack time estimate shows "longer than the universe" — which, given the math, is accurate.</p>
<p>The <a href="/#generator">generator</a> defaults to 18 characters with full character set enabled, which consistently reaches the Unbreakable threshold. The DNA Score breaks down exactly which properties contribute to this and what could be improved.</p>
`;