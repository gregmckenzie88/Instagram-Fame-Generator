//initiate with:
// while true; do casperjs index.js; sleep 2; done

var username = 'YOUR_USERNAME';
var password = 'YOUR_PASSWORD';

var fs = require('fs');
var path = 'output/';
var webPage = require('webpage');
var casper = require('casper').create(
    {
        pageSettings: {
            loadImages: false,//The script is much faster when this field is set to false
            loadPlugins: false,
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36'
        },
        logLevel: 'debug',
        verbose: false,
        viewportSize: {
            width: 1920,
            height: 1080
        }
    }
);

//////////////
/// LOG IN ///
//////////////

casper.start('https://www.instagram.com/accounts/login/?force_classic_login', function () {
    this.echo("loaded login");

    this.fill('form[action="/accounts/login/?force_classic_login"]', {
        username: username,
        password: password
    }, true);
    this.capture('login1.png');
});

// casper.options.silentErrors = true;

casper.options.pageSettings.resourceTimeout = 20000;

casper.setMaxListeners(100);

casper.waitForSelector('._ohbcb', //follow button
    function pass () {

        var iterations = 0;

        casper.repeat(60, function() {

            var date = new Date();
            var hour = date.getHours();
            var day = date.getDay();
            var bool = false;


            if (
                day === 0 ||
                day === 1 ||
                day === 3 ||
                day === 5
                ){
                bool = true;
            } else {
                bool = false;
            }

            if(bool){

                var t0 = performance.now();

                ///////////////////
                /// FOLLOW USER ///
                ///////////////////

                this.open('https://www.instagram.com/explore/tags/love/').then( function() {

                    this.waitForSelector('article div:nth-child(2) ._6d3hm ._mck9w a', //follow button
                        function pass () {
                            this.echo(this.getTitle());
                            this.echo(new Date());
                            this.capture('screenshots/follow/f4f-list.png');
                            this.click('article div:nth-child(2) ._6d3hm ._mck9w a');
                            // this.echo("    💅    post selected");
                        },
                        function fail () {
                            this.echo(this.getTitle());
                            this.echo(new Date());
                            this.capture('screenshots/follow/f4f-list.png');
                            this.echo("💩 💩 💩 Did not load element first user");
                        }
                    );

                    this.waitForSelector("button._qv64e", //follow button
                        function pass () {
                            // this.capture('screenshots/follow/f4f-user');
                            this.click('button._qv64e');
                            this.echo("    👣    followed user");
                            this.capture('screenshots/follow/f4f-clicked.png');
                        },
                        function fail () {
                            this.echo("Did not load element follow btn");
                            this.capture('screenshots/follow/f4f-clicked.png');
                        }
                    );
                });

                casper.then(function() {
                    this.echo("- - - - - - - - - - - - - - - - - - - - - - - - -");
                    this.capture('screenshots/follow/f4f-done.png');
                });

                /////////////////////
                /// LIKE FOR LIKE ///
                /////////////////////
                casper.then(function(){
                    this.waitForSelector("a.coreSpriteRightPaginationArrow", //follow button
                        function pass () {
                            this.echo("    👣    Next Post");
                            this.click('a.coreSpriteRightPaginationArrow');
                        },
                        function fail () {
                            this.echo("Did not load next user button");
                            // this.capture('screenshots/follow/f4f-clicked.png');
                        }
                    );
                });

                this.waitForSelector("a._eszkz._l9yih", //follow button
                    function pass () {
                        // this.capture('screenshots/unfollow/l4l-panel.png');
                        this.click('a._eszkz._l9yih');
                        this.echo("    📷    photo liked");
                        this.capture('screenshots/unfollow/l4l-clicked.png');
                    },
                    function fail () {
                        // this.capture('screenshots/unfollow/l4l-panel.png');
                        this.echo("💩 💩 💩 Did not load element follow btn");
                    }
                );

                this.then(function(){
                  if(Math.floor(Math.random() * 100) < 25){
                    this.waitForSelector("form._b6i0l", //comment form
                      function pass () {
                              this.fillSelectors("form._b6i0l", {
                                  '._bilrf' : "Great pic!"
                              }, true);
                              this.echo("    💬    'Great pic!'");
                              this.capture('screenshots/comment-entered-following.png');
                      },
                      function fail () {
                          this.echo("Did not load comment form");
                      }
                    );
                  }
                });


                casper.then(function() {
                    var t1 = performance.now();
                    var timeDifference = parseInt((t1 - t0) / 1000);
                    this.echo("It took " + timeDifference + " seconds.")
                    iterations++;
                    this.echo("- - - - - - - - - - -👉  " + iterations + " 👈- - - - - - - - - - -");
                });

            } else {

              var iterations = 0;


              var t0 = performance.now();

              /////////////////////
              /// UNFOLLOW USER ///
              /////////////////////

              this.open('https://www.instagram.com/' + username + '/').then( function() {

                  // Show following list
                  this.waitForSelector('._h9luf li:nth-child(3) ._t98z6',
                      function pass () {
                          this.echo(new Date());
                          this.echo(this.getTitle());
                          this.capture('screenshots/unfollow/branx-panel.png');
                          this.click('._h9luf li:nth-child(3) ._t98z6');
                      },
                      function fail () {
                          this.echo(new Date());
                          this.echo(this.getTitle());
                          this.capture('screenshots/unfollow/branx-panel.png');
                          this.echo("💩💩💩Did not load element first user");
                      }
                  );

                  // Scroll down
                  this.wait(2000, function() {
                    this.repeat(250, function(){
                      this.evaluate(function(){
                        function Scroll() {
                          var obj = document.getElementsByClassName('_gs38e');
                          obj[0].scrollTop = obj[0].scrollHeight;

                        }
                        Scroll();
                      });
                    });
                  });

                  //scroll copy
                  // this.wait(2000, function() {
                  //     this.evaluate(function(){
                  //       function Scroll() {
                  //         var obj = document.getElementsByClassName('_gs38e');
                  //             obj[0].scrollTop = obj[0].scrollHeight;

                  //       }
                  //       while(this.getElementsInfo('._8q670._b9n99 li').length < 500){
                  //         Scroll();
                  //       }

                  //     });
                  // });

                  // Am I getting the same number of buttons?
                  this.wait(1000, function() {
                    console.log(this.getElementsInfo('._8q670._b9n99 li').length);
                  });

                  // Loop
                  casper.then(function() {
                      var current = 1;
                      var end = 60;
                      for (;current < end;) {
                      (function(cntr) {
                        casper.then(function(){
                          this.wait(61000, function(){


                            console.log(cntr);
                            casper.click('._8q670._b9n99 li:nth-last-child(' + cntr + ') ._qv64e');
                            this.echo("    🔫 user unfollowed");
                            this.echo(new Date());



                          })
                        })
                      })(current);
                      current++;
                      }
                  });



                  // Click
                  // this.then(function(){
                  //   this.waitForSelector("._539vh li:last-child ._rmr7s",
                  //     function pass () {
                  //       this.capture('screenshots/unfollow/branx-list.png');
                  //       this.click('._539vh li:first-child ._ah57t');
                  //       this.echo("    🔫 user unfollowed");
                  //     },
                  //     function fail () {
                  //       this.capture('screenshots/unfollow/branx-list.png');
                  //       this.echo("💩 💩 💩 Did not load element follow btn");
                  //     }
                  //   );
                  // });

                  // Take picture
                  this.wait(1000, function() {
                    this.capture('screenshots/scroll-test.png');
                    this.evaluate(function(){

                    });
                  });

              }); // branx page close

              casper.then(function() {
                var t1 = performance.now();
                var timeDifference = parseInt((t1 - t0) / 1000);
                this.echo("It took " + timeDifference + " seconds.")
                iterations++;
                this.echo("- - - - - - - - - - -👉  " + iterations + " 👈- - - - - - - - - - -");
              });
            }

            ///////////////////
            /// TIME OFFSET ///
            ///////////////////

            casper.then(function(){
                this.wait(64000, function(){
                    this.echo("                        👏  NEW INSTANCE!");
                });
            });

        }); //END LOOP

        this.then(function(){
            casper.exit();
            this.die("Fail.", 1);
        });


    },
    function fail () {
        this.capture('./out/loginFail.png');
        this.echo("Did not load login state");
        casper.exit();
        this.die("Fail.", 1);

    }


);

casper.on('error', function(msg,backtrace) {
  this.capture('./out/error.png');
  this.echo(msg);
  casper.exit();
  this.die("Fail.", 1);
});



casper.run();
