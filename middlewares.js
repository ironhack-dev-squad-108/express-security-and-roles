module.exports = {
  // Middleware that redirects the user to '/login' is not connected
  isConnected: function(req,res,next) {
    // If we are connected, express defines a req.user
    if (req.user) {
      next()
    }
    else {
      res.redirect('/auth/login')
    }
  }
}