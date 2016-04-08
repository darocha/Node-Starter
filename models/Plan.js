const lodash = require('lodash');

/* This static file contains all of your plan information,
  it should match stripe's plan id. */
const plans = [
  {
    id: "free",
    name: "Free",
    features: {
      // list out features and values    
    }
  }
]

function findByID(id){
  return lodash.some(plans, {id: id});
}