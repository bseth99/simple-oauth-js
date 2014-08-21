globalOptions = {
      consumer_key: 'R1Y3QW1L15uw8X0t5ddJbQ',
      consumer_secret: '7xKJvmTCKm97WBQQllji9Oz8DRQHJoN1svhiY8vo',
      nonce: 'qb1vwdqJYB4LBlw6',
      timestamp: '1367513425'
   };


module( "OAuth Section 9.1.2 Construct Request URL" );

/*
*  The Signature Base String includes the request absolute URL, tying the signature to a specific endpoint.
*  The URL used in the Signature Base String MUST include the scheme, authority, and path, and MUST exclude the
*  query and fragment as defined by [RFC3986] section 3.
*
*  If the absolute request URL is not available to the Service Provider (it is always available to the Consumer),
*  it can be constructed by combining the scheme being used, the HTTP Host header, and the relative HTTP request URL.
*  If the Host header is not available, the Service Provider SHOULD use the host name communicated to the Consumer
*  in the documentation or other means.
*
*  The Service Provider SHOULD document the form of URL used in the Signature Base String to avoid ambiguity due to
*  URL normalization. Unless specified, URL scheme and authority MUST be lowercase and include the port number; http
*  default port 80 and https default port 443 MUST be excluded.
*
*  For example, the request:
*
*                  HTTP://Example.com:80/resource?id=123
*
*  Is included in the Signature Base String as:
*
*                  http://example.com/resource
*
*
*/

test( "Basic Scheme, Authority, and Path", function() {

   header = new SimpleOAuth.Header('get', 'http://example.org/oauth/request_token', null, globalOptions);
   equal( header.url(), 'http://example.org/oauth/request_token', "http://example.org/oauth/request_token ==> http://example.org/oauth/request_token" );

   header = new SimpleOAuth.Header('get', 'http://api.example.org/oauth/request_token', null, globalOptions);
   equal( header.url(), 'http://api.example.org/oauth/request_token', "http://api.example.org/oauth/request_token ==> http://api.example.org/oauth/request_token" );

   header = new SimpleOAuth.Header('get', 'http://api.example.org/oauth/request_token.json', null, globalOptions);
   equal( header.url(), 'http://api.example.org/oauth/request_token.json', "http://api.example.org/oauth/request_token.json ==> http://api.example.org/oauth/request_token.json" );

});

test( "Scheme and Authority MUST be lower case", function() {

   header = new SimpleOAuth.Header('get', 'HTTP://Example.org/oauth/request_token', null, globalOptions);
   equal( header.url(), 'http://example.org/oauth/request_token', "HTTP://Example.org/oauth/request_token ==> http://example.org/oauth/request_token" );

});

test( "MUST not include the query string or fragment", function() {

   header = new SimpleOAuth.Header('get', 'http://example.org/oauth/request_token?id=123#bookmark', null, globalOptions);
   equal( header.url(), 'http://example.org/oauth/request_token', "http://example.org/oauth/request_token?id=123#bookmark ==> http://example.org/oauth/request_token" );

});

test( "MUST exclude the standard port 80 and 443", function() {

   header = new SimpleOAuth.Header('get', 'http://example.org:80/oauth/request_token', null, globalOptions);
   equal( header.url(), 'http://example.org/oauth/request_token', "http://example.org:80/oauth/request_token ==> http://example.org/oauth/request_token" );

   header = new SimpleOAuth.Header('get', 'https://example.org:443/oauth/request_token', null, globalOptions);
   equal( header.url(), 'https://example.org/oauth/request_token', "https://example.org:443/oauth/request_token ==> https://example.org/oauth/request_token" );

   header = new SimpleOAuth.Header('get', 'http://example.org:8080/oauth/request_token', null, globalOptions);
   equal( header.url(), 'http://example.org:8080/oauth/request_token', "http://example.org:8080/oauth/request_token ==> https://example.org:8080/oauth/request_token" );

});

module( "OAuth Section 7. Accessing Protected Resources" );

/*
*
*  After successfully receiving the Access Token and Token Secret, the Consumer is able to access the
*  Protected Resources on behalf of the User. The request MUST be signed per Signing Requests, and
*  contains the following parameters:
*
*      oauth_consumer_key:
*          The Consumer Key.
*      oauth_token:
*          The Access Token.
*      oauth_signature_method:
*          The signature method the Consumer used to sign the request.
*      oauth_signature:
*          The signature as defined in Signing Requests.
*      oauth_timestamp:
*          As defined in Nonce and Timestamp.
*      oauth_nonce:
*          As defined in Nonce and Timestamp.
*      oauth_version:
*          OPTIONAL. If present, value MUST be 1.0. Service Providers MUST assume the protocol version to be 1.0 if this parameter is not present. Service Providers’ response to non-1.0 value is left undefined.
*      Additional parameters:
*          Any additional parameters, as defined by the Service Provider.
*
*
*  Tests are compared to the equivalent output created by the Ruby Gem SimpleOAuth#to_s
*  which this library is based modeled after so it seemed fitting to match the output.
*  If you plan to use a different library on the server side, you may want to output the
*  same tests through it to compare the results.
*
*/


test( "GET, no parameters or query string", function() {

   compare = "OAuth oauth_consumer_key=\"R1Y3QW1L15uw8X0t5ddJbQ\", oauth_nonce=\"qb1vwdqJYB4LBlw6\", oauth_signature=\"QF5cF85Q%2BS8p%2B%2Fth7U6yQXK17Ac%3D\", oauth_signature_method=\"HMAC-SHA1\", oauth_timestamp=\"1367513425\", oauth_version=\"1.0\"";
   header = new SimpleOAuth.Header('get', 'http://example.org/oauth/request_token', null, globalOptions);
   equal( header.build(), compare, '' );

});

test( "GET, with reserved query values", function() {

   compare = "OAuth oauth_consumer_key=\"R1Y3QW1L15uw8X0t5ddJbQ\", oauth_nonce=\"qb1vwdqJYB4LBlw6\", oauth_signature=\"tN7q%2B56lhAUJ%2FZ6D1djtuCRePDE%3D\", oauth_signature_method=\"HMAC-SHA1\", oauth_timestamp=\"1367513425\", oauth_version=\"1.0\"";
   header = new SimpleOAuth.Header('get', 'http://example.org/oauth/request_token?q=w@&z=w?', null, globalOptions);
   equal( header.build(), compare, '' );

});

test( "POST, no parameters or query string", function() {

   compare = "OAuth oauth_consumer_key=\"R1Y3QW1L15uw8X0t5ddJbQ\", oauth_nonce=\"qb1vwdqJYB4LBlw6\", oauth_signature=\"N7LA9q7yRcM%2FZDIVwIBPPjm%2BCoo%3D\", oauth_signature_method=\"HMAC-SHA1\", oauth_timestamp=\"1367513425\", oauth_version=\"1.0\"";
   header = new SimpleOAuth.Header('post', 'http://example.org/oauth/request_token', null, globalOptions);
   equal( header.build(), compare, '' );

});


test( "POST, no parameters but with query string a=1, b=2, c=3", function() {

   compare = "OAuth oauth_consumer_key=\"R1Y3QW1L15uw8X0t5ddJbQ\", oauth_nonce=\"qb1vwdqJYB4LBlw6\", oauth_signature=\"dnSXvR6MjEGvC1E1rSHbKc58SZ8%3D\", oauth_signature_method=\"HMAC-SHA1\", oauth_timestamp=\"1367513425\", oauth_version=\"1.0\"";
   header = new SimpleOAuth.Header('post', 'http://example.org/oauth/request_token?a=1&b=2&c=3', null, globalOptions);
   equal( header.build(), compare, '' );

});

test( "POST, no parameters but with query string a=1, b=2, c=3, c=4", function() {

   compare = "OAuth oauth_consumer_key=\"R1Y3QW1L15uw8X0t5ddJbQ\", oauth_nonce=\"qb1vwdqJYB4LBlw6\", oauth_signature=\"3oQhY3f06SVS54%2F7HwZ6PRoatG0%3D\", oauth_signature_method=\"HMAC-SHA1\", oauth_timestamp=\"1367513425\", oauth_version=\"1.0\"";
   header = new SimpleOAuth.Header('post', 'http://example.org/oauth/request_token?a=1&b=2&c=3&c=4', null, globalOptions);
   equal( header.build(), compare, '' );

});

test( "POST, with parameters z=100, x=99 but no query string", function() {

   compare = "OAuth oauth_consumer_key=\"R1Y3QW1L15uw8X0t5ddJbQ\", oauth_nonce=\"qb1vwdqJYB4LBlw6\", oauth_signature=\"gMrKpfp0sF45B5t%2BLQ3zfUphs6s%3D\", oauth_signature_method=\"HMAC-SHA1\", oauth_timestamp=\"1367513425\", oauth_version=\"1.0\"";
   header = new SimpleOAuth.Header('post', 'http://example.org/oauth/request_token', { z: 100, x:99 }, globalOptions);
   equal( header.build(), compare, '' );

});

test( "POST, with parameters z=100, x=99 and query string a=1, b=2, c=3", function() {

   compare = "OAuth oauth_consumer_key=\"R1Y3QW1L15uw8X0t5ddJbQ\", oauth_nonce=\"qb1vwdqJYB4LBlw6\", oauth_signature=\"n0IuSuTq4dCTmPpft0tRa8kG6tM%3D\", oauth_signature_method=\"HMAC-SHA1\", oauth_timestamp=\"1367513425\", oauth_version=\"1.0\"";
   header = new SimpleOAuth.Header('post', 'http://example.org/oauth/request_token?a=1&b=2&c=3', { z: 100, x:99 }, globalOptions);
   equal( header.build(), compare, '' );

});
