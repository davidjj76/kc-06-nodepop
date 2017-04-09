/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

const { languages } = require('../localConfig');

// language and messages middleware
module.exports = (req, res, next) => {
  // get client first accepted language from request
  const lang = req.acceptsLanguages(languages) || languages[0];

  // attach language and messages to response
  res.language = lang;
  res.messages = require(`../locale/${lang.toUpperCase()}.json`);
  next();
};
/* eslint-enable global-require */
/* eslint-enable import/no-dynamic-require */
