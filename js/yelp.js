var yelp = function(title, callback){

  var auth = {
    consumerKey: "pmlvdKRS3vqtInCSKRRnPw",
    consumerSecret: "FsHlkEt8hzRyjsINtrDN1RYnS3Q",
    accessToken: "0XXzQzKxDthEY9XciDnJJ12xv0Ux3BxW",
    accessTokenSecret: "l8__RRcnMsZUsuwCWFHTu735KRs",
    serviceProvider: {
      signatureMethod: "HMAC-SHA1"
    }
  };

  var accessor = {
    consumerSecret: auth.consumerSecret,
    tokenSecret: auth.accessTokenSecret
  };

  myParameters = [];

  myParameters.push(['term', title]);
  myParameters.push(['location', "Oak Park, IL"]);
  myParameters.push(['callback', 'cb']);
  myParameters.push(['oauth_consumer_key', auth.consumerKey]);
  myParameters.push(['oauth_consumer_secret', auth.consumerSecret]);
  myParameters.push(['oauth_token', auth.accessToken]);
  myParameters.push(['oauth_signature_method', 'HMAC-SHA1']);

  var myMessage = {
    'action': 'http://api.yelp.com/v2/search',
    'method': 'GET',
    'parameters': myParameters
  };

  OAuth.setTimestampAndNonce(myMessage);
  OAuth.SignatureMethod.sign(myMessage, accessor);

  var parameterMap = OAuth.getParameterMap(myMessage.parameters);
  parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);

  $.ajax({
    'url': myMessage.action,
    'data': parameterMap,
    'cache': true,
    'dataType': 'jsonp',
    'success': function(data, textStats, XMLHttpRequest) {
      callback(data.businesses[0]);
    }
  }).fail(function(e){
    $('#yelpWindow').replaceWith("<h5>Error: Yelp data could not be loaded</h5>");
  });                                                               
};