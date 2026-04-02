// Redirect legacy LemonSqueezy portal URL to the dashboard
export default function handler(req, res) {
  res.redirect(302, "/dashboard");
}
