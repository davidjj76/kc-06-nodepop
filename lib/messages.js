/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

const acceptedLangs = require('../localConfig').languages;

// language and messages middleware
module.exports = (req, res, next) => {
  // get client first accepted language from request
  const lang = req.acceptsLanguages(acceptedLangs) || acceptedLangs[0];

  // attach language and messages to response
  res.language = lang;
  res.messages = require(`./messages/${lang.toUpperCase()}`);
  next();
};
/* eslint-enable global-require */
/* eslint-enable import/no-dynamic-require */
