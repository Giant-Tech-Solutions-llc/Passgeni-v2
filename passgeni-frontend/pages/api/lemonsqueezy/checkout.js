// Redirect legacy LemonSqueezy checkout URL to the current Paddle flow
export default function handler(req, res) {
  res.redirect(302, "/checkout");
}
