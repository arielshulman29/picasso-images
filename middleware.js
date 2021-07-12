

//is the user logged in
module.exports.isLoggedIn = (req, res, next) => {    
    if (req.isAuthenticated()) {
        return next()
      } else {
        res.redirect('/auth/github');
      }
}