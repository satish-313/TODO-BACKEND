const jwt = require('jsonwebtoken');

module.exports = function(req,res,next){
  
  const token = req.header('auth-token')
  if(!token) return res.send('Acces denied')

  try {
    const verified = jwt.verify(token,process.env.TOKEN_SECRET)
    req.username = verified;
    next()
  } catch (error) {
    res.status(404).send('Invalid token')
  }
}