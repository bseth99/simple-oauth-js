/* OAuth Authorization Header Hook for jQuery
*
*  This will sign requests and set the Authorization header on each request sent to the
*  server.  Since the header can only be set on non-cross site requests, you will have
*  to reverse proxy requests to other providers.  The oauthProxyPath and oauthRewrite
*  settings allows you to control the actual URL used to sign requests so they will
*  match on the server side once passing through your proxy/rewrite rules.
*  Note that Rack::Request will use HTTP_X_FORWARDED_HOST to construct the URL
*  for an incoming request.  Be sure to account for that when using these settings.
*
*  Copyright (c) 2013, Ben Olson (github.com/bseth99/simple-oauth)
*
*  Basic Usage:
*
*     options = {
*            consumer_key: 'R1Y3QW1L15uw8X0t5ddJbQ',
*            consumer_secret: '7xKJvmTCKm97WBQQllji9Oz8DRQHJoN1svhiY8vo'
*       };
*
*     $.ajaxSetup({
*            oauthOptions: options,
*            oauthProxyPath: 'http://api.example.com/',
*            oauthRewrite: '/example'
*         });
*
*     $.ajax({
*             url: "/example/oauth/request_token",
*             type: "POST",
*             contentType: "application/json; charset=utf-8",
*             dataType: "json",
*             processdata: false
*         }))
*       .done( function (data, textStatus, jqXHR) {
*               console.log('Success');
*          })
*       .fail( function (jqXHR, textStatus, errorThrown) {
*               console.log('Failure');
*          });
*
*  Dependancies:
*     underscore.js >= 1.4.3 (http://underscorejs.org)
*     simple-oauth.js >= 0.1.0 (github.com/bseth99/simple-oauth)
*
*
*  THIS SOFTWARE IS PROVIDED BY UNITEDHEROES.NET ''AS IS'' AND ANY
*  EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
*  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
*  DISCLAIMED. IN NO EVENT SHALL UNITEDHEROES.NET BE LIABLE FOR ANY
*  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
*  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
*  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
*  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
*  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
*  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


(function($) {

var ajaxOAuth = function ( jqXHR, settings ) {

   var base = settings.oauthProxyPath || location.protocol + '//' + location.host + (location.port ? ':' + location.port : ''),
       rewrite = settings.oauthRewrite || '',
       header = new SimpleOAuth.Header(
               settings.type,
               base + settings.url.replace(rewrite, ''),
               (settings.contentType.indexOf('application/x-www-form-urlencoded') > -1 ? URI.parseQuery(settings.data) : null),
               settings.oauthOptions
          );

   jqXHR.setRequestHeader('Authorization', header.build());

}

$.ajaxSetup({ beforeSend: ajaxOAuth });

})(jQuery);