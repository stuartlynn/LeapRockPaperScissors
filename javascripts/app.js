(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"application": function(exports, require, module) {
  (function() {
    var App, LeapListener, RockPaperScissorsController,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    LeapListener = require('models/LeapListener');

    RockPaperScissorsController = require('controllers/RockPaperScissorsController');

    App = (function(_super) {

      __extends(App, _super);

      function App() {
        var RPSC;
        App.__super__.constructor.apply(this, arguments);
        LeapListener.setup('ws://localhost:6437');
        RPSC = new RockPaperScissorsController();
        this.append(RPSC);
      }

      return App;

    })(Spine.Controller);

    module.exports = App;

  }).call(this);
  
}});

window.require.define({"controllers/RockPaperScissorsController": function(exports, require, module) {
  (function() {
    var LeapListener, RPSGame, RockPaperScissorsController,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    RPSGame = require('models/RPSGame');

    LeapListener = require('models/LeapListener');

    RockPaperScissorsController = (function(_super) {

      __extends(RockPaperScissorsController, _super);

      RockPaperScissorsController.prototype.className = "fight";

      RockPaperScissorsController.prototype.elements = {
        '.player1 .move img': 'player1',
        '.player2 .move img': 'player2',
        '.player1 .lifebar .lifebarInner': 'player1Lifebar',
        '.player2 .lifebar .lifebarInner': 'player2Lifebar',
        '.countdown h1': 'countdown',
        '.countdown ': 'countdownOverlay',
        '.player img': 'hands'
      };

      RockPaperScissorsController.prototype.events = {
        'click .countdown h1': 'startGame'
      };

      function RockPaperScissorsController() {
        this.startCountdown = __bind(this.startCountdown, this);
        this.endGame = __bind(this.endGame, this);
        this.updateScore = __bind(this.updateScore, this);
        this.endRound = __bind(this.endRound, this);
        this.startRound = __bind(this.startRound, this);
        this.startGame = __bind(this.startGame, this);
        this.updateMove = __bind(this.updateMove, this);
        this.render = __bind(this.render, this);      RockPaperScissorsController.__super__.constructor.apply(this, arguments);
        this.render();
        LeapListener.onAnything(this.updateMove);
        this.game = new RPSGame();
      }

      RockPaperScissorsController.prototype.render = function() {
        return this.html(require('views/game'));
      };

      RockPaperScissorsController.prototype.updateMove = function(data) {
        var move;
        move = this.game.recognise(data);
        if (move != null) {
          this.move = move;
          return this.player1.attr('src', move.image);
        }
      };

      RockPaperScissorsController.prototype.startGame = function() {
        this.game = new RPSGame();
        this.updateScore();
        return this.startCountdown();
      };

      RockPaperScissorsController.prototype.startRound = function() {
        var _this = this;
        $(".player img").removeClass('shake');
        $(".player img").addClass('bounce');
        return setTimeout(function() {
          return _this.endRound();
        }, 3500);
      };

      RockPaperScissorsController.prototype.endRound = function() {
        var p2Choice, winner,
          _this = this;
        this.hands.removeClass('bounce');
        p2Choice = this.game.randomChoice();
        winner = this.game.selectLooser(this.move.name, p2Choice.name);
        console.log(winner);
        if (winner != null) $("." + winner + " img").addClass('shake');
        this.player2.attr("src", p2Choice.image);
        this.updateScore();
        if (this.game.winner() != null) {
          return this.endGame();
        } else {
          return setTimeout(function() {
            return _this.startRound();
          }, 200);
        }
      };

      RockPaperScissorsController.prototype.updateScore = function() {
        this.player1Lifebar.css('width', "" + this.game.p1Score + "%");
        return this.player2Lifebar.css('width', "" + this.game.p2Score + "%");
      };

      RockPaperScissorsController.prototype.endGame = function() {
        this.countdownOverlay.css('display', 'block');
        return this.countdown.html("Player " + (this.game.winner()) + " won!!!!!! Click to restart");
      };

      RockPaperScissorsController.prototype.startCountdown = function() {
        var _this = this;
        setTimeout(function() {
          return _this.countdown.html("3");
        }, 1000);
        setTimeout(function() {
          return _this.countdown.html("2");
        }, 2000);
        setTimeout(function() {
          return _this.countdown.html("1");
        }, 3000);
        setTimeout(function() {
          return _this.countdown.html("FIGHT!!!!!!");
        }, 4000);
        return setTimeout(function() {
          _this.countdownOverlay.css('display', "none");
          return _this.startRound();
        }, 5000);
      };

      return RockPaperScissorsController;

    })(Spine.Controller);

    module.exports = RockPaperScissorsController;

  }).call(this);
  
}});

window.require.define({"models/LeapListener": function(exports, require, module) {
  (function() {
    var LeapListener;

    LeapListener = (function() {

      function LeapListener() {}

      LeapListener.fingerCallbacks = [];

      LeapListener.handCallbacks = [];

      LeapListener.anythingCallbacks = [];

      LeapListener.setup = function(url) {
        var counter, ws,
          _this = this;
        console.log("connecting");
        ws = new WebSocket(url);
        counter = 0;
        return ws.onmessage = function(e) {
          var cb, data, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3, _results;
          data = JSON.parse(e.data);
          counter += 1;
          _ref = _this.fingerCallbacks;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            cb = _ref[_i];
            cb(data.pointables);
          }
          _ref2 = _this.handCallbacks;
          for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
            cb = _ref2[_j];
            cb(data.hands);
          }
          _ref3 = _this.anythingCallbacks;
          _results = [];
          for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
            cb = _ref3[_k];
            _results.push(cb(data));
          }
          return _results;
        };
      };

      LeapListener.onFingers = function(cb) {
        return this.fingerCallbacks.push(cb);
      };

      LeapListener.onAnything = function(cb) {
        return this.anythingCallbacks.push(cb);
      };

      LeapListener.onHands = function(cb) {
        return this.handCallbacks.push(cb);
      };

      LeapListener.pointDistance = function(finger1, finger2) {
        var dx, dy, dz, tip1, tip2;
        tip1 = finger1.tipPosition;
        tip2 = finger2.tipPosition;
        dx = tip1[0] - tip2[0];
        dy = tip1[1] - tip2[1];
        dz = tip1[2] - tip2[2];
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
      };

      return LeapListener;

    }).call(this);

    module.exports = LeapListener;

  }).call(this);
  
}});

window.require.define({"models/RPSGame": function(exports, require, module) {
  (function() {
    var RPSGame,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

    RPSGame = (function() {

      RPSGame.prototype.choices = {
        rock: {
          name: 'rock',
          beats: ["scissors"],
          image: 'images/rock.png'
        },
        paper: {
          name: 'paper',
          beats: ["rock"],
          image: 'images/paper.png'
        },
        scissors: {
          name: 'scissors',
          beats: ['paper'],
          image: 'images/scissors.png'
        }
      };

      function RPSGame() {
        this.recognise = __bind(this.recognise, this);
        this.winner = __bind(this.winner, this);      this.p1Score = 100;
        this.p2Score = 100;
      }

      RPSGame.prototype.randomChoice = function() {
        var key, keys, result, val;
        keys = (function() {
          var _ref, _results;
          _ref = this.choices;
          _results = [];
          for (key in _ref) {
            val = _ref[key];
            _results.push(key);
          }
          return _results;
        }).call(this);
        result = keys[Math.floor(Math.random() * keys.length)];
        return this.choices[result];
      };

      RPSGame.prototype.selectLooser = function(choice1, choice2) {
        console.log("choicees ", choice1, choice2);
        if (choice1 === choice2) {
          return 'stalemate';
        } else if (this.choices[choice1].beats.indexOf(choice2) !== -1) {
          this.p2Score -= 10;
          return "player2";
        } else {
          this.p1Score -= 10;
          return "player1";
        }
      };

      RPSGame.prototype.winner = function() {
        if (this.p1Score <= 0) {
          return 'player2';
        } else if (this.p2Score <= 0) {
          return 'player1';
        } else {
          return null;
        }
      };

      RPSGame.prototype.recognise = function(details) {
        if (details.pointables.length === 2) {
          return this.choices.scissors;
        } else if (details.pointables.length > 2) {
          return this.choices.paper;
        } else if (details.hands.length === 1 && details.hands[0].sphereRadius < 100) {
          return this.choices.rock;
        } else {
          return null;
        }
      };

      return RPSGame;

    })();

    module.exports = RPSGame;

  }).call(this);
  
}});

window.require.define({"views/game": function(exports, require, module) {
  module.exports = function (__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
      
        __out.push('<div class=\'countdown\'><h1>Click to START FIGHT!</h1></div>\n\n<div class=\'player1 player\'>\n\t\n\t<div class=\'upper\'>\n\n\t\t<div class=\'lifebar\'>\n\t\t\t<div class=\'lifebarInner\'></div>\n\t\t</div>\n\t\t<h1>Player 1</h1>\n\t</div>\n\n\t<div class=\'move\'>\n\t\t<img src=\'images/paper.png\'></img>\n\t</div>\n</div>\n\n<div class=\'player2 player\'>\n\t<div class=\'upper\'>\n\t\t\n\t\t<div class=\'lifebar\'>\n\t\t\t<div class=\'lifebarInner\'></div>\n\t\t</div>\n\t\t<h1>Computer AI</h1>\n\t</div>\n\t\n\t<div class=\'move\'>\n\t\t<img src=\'images/rock.png\'></img>\n\t</div>\n\n</div>\n\n<div class=\'vs\'>\t\n\t<h2>VS</h2>\n</div>');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  }
}});

