Simple OAuth
=========

#### Helper Library for Signing OAuth Requests ####

OAuth 1.0 requires that requests made to an OAuth compliant API service
be signed using specific attributes from the request and the different keys
registered to the consumer/owner.  This library provides a simple means to 
sign those requests by simply providing it with the keys and necessary parameters
involved in the signing process.  It will produce either the header or query
string necessary to send with the request to the API.

The library is modeled after a [Ruby Gem implementation](https://github.com/laserlemon/simple_oauth/blob/master/lib/simple_oauth/header.rb) 
of the same name and the test cases were compared to the output produced by the Ruby version.
UnderscoreJS made the most sense to replicate some the features of the Ruby language.  Some gaps remained
like a SHA1-HMAC signing function and various URI handling functions.  


Usage
---------------

To use SimpleOAuthJS in your application, either download the 
[Minified](https://raw.github.com/bseth99/simple-oauth-js/master/simple-oauth.min.js) or 
[Full](https://raw.github.com/bseth99/simple-oauth-js/master/simple-oauth.js) version and copy it to a suitable location. 
Then include it in your HTML like so:

    <script type="text/javascript" src="/path/to/simple-oauth.js"></script>

The library does depend on UnderscoreJS (http://underscorejs.org) so make sure to include that as well.


### Basics ###

The basic usage is fairly straight forward.

      var header = new SimpleOAuth.Header(method, path, params, options);
      
      var auth = header.build();
      
`method` is the type of request (ie GET/POST).

`path` is the full URL to the resource (review 3.4.1.2. Base String URI of the [RFC](http://tools.ietf.org/html/rfc5849))

`params`, for form posts, is a key/value hash of the post vars.  This should be null for
everything except when content type is application/x-www-form-urlencoded

`options` is a key/value hash of valid OAuth header variables without the oauth_ prefix.  
Generally, these are the consumer/owner keys but the other values can be specified (like callback,
verifier, nonce, etc).


### Alternatives ###

By default `build` will output the Authorization header string which will include the OAuth and comma
separated variables.  Alternatively, you can pass "query" to the `build` function which will return the
string such that it could be used in the query string of a request.  Some APIs allow/require this approach
to validating requests.


Example
---------------

This is a basic example using jQuery to make an AJAX request to a remote API.  An important
point to keep in mind is the path must be the full URL to the resource.  If you are using
a reverse proxy to avoid cross-site calls, you may have to tweak what you use here.  It
has to match what the server will see or it will fail.


        var keys = {
               consumer_key: 'R1Y3QW1L15uw8X0t5ddJbQ',
               consumer_secret: '7xKJvmTCKm97WBQQllji9Oz8DRQHJoN1svhiY8vo'
          },

          base = location.protocol + '//' + location.host + (location.port ? ':' + location.port : ''),
          url = '/do_something',

          oauth = new SimpleOAuth.Header('get', base+url, null, keys);

        /**
        *  Map requests to /api path for reverse proxy
        *  They must be signed using the path the server will
        *  see when checking the signature.
        */
        $.ajax({
                url: '/api' + url,
                type: "GET",
                processData: false,
                headers: { 'Authorization' : oauth.build() }
              })
             .done( function (data, textStatus, jqXHR) {
                     console.log('Success: ' + data);
                })
             .fail( function (jqXHR, textStatus, errorThrown) {
                     console.log('Fail: ' + jqXHR.status);
                });

License
---------------

Copyright (c) 2013, Ben Olson  
Licensed under the MIT license  
