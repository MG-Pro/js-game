'use strict';

loadLevels()
  .then(result => {
    return JSON.parse(result);
  });
