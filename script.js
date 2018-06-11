$(function() {

  /**** Variables ****/

  // saving dom objects to variables
  var container = $('#container');
  var bird = $('#bird');
  var pole = $('.pole');
  var pole_1 = $('#pole_1');
  var pole_2 = $('#pole_2');
  var score_display = $('#score');
  var high_score_display = $('#high_score');
  var speed_display = $('#speed');
  var restart = $('#restart');

  // sound effects
  var score_sound = document.createElement('audio');
  score_sound.setAttribute('src', 'score.wav');
  var death_sound = document.createElement('audio');
  death_sound.setAttribute('src', 'death.wav');


  // saving initial setups
  var container_width = parseInt(container.width());
  var container_height = parseInt(container.height());
  var pole_init_position = parseInt(pole.css('right'));
  var pole_init_height = parseInt(pole.height());
  var bird_init_top = parseInt(bird.css('top'));
  var bird_left = parseInt(bird.css('left'));
  var bird_height = parseInt(bird.height());
  var speed = 5;

  // state variables
  var player_input = false;
  var score_updated = false;
  var game_over = false;



  /**** Game ****/

  var game = setInterval(start_game , 1000/60);

  /**** Functions ****/

  $(document).on('keypress', function(e){
    var key = e.keyCode;
    if (key === 32 && player_input === false && !game_over){
      var i = 0;
      player_input = setInterval(function(){
        upward();
        if (++i >= 5) {
          clearInterval(player_input);
          player_input = false;
        }
      }, 1000/60);
    }
  });

  // Alternative control method that allows the player to hold down
  // spacebar to keep going up.
  // $(document).on('keydown', function(e){
  //   var key = e.keyCode;
  //   if (key === 32 && player_input === false && !game_over){
  //     player_input = setInterval(upward, 1000/60);
  //   }
  // });
  //
  // $(document).on('keyup', function(e){
  //   var key = e.keyCode;
  //   if (key === 32){
  //     clearInterval(player_input);
  //     player_input = false;
  //   }
  // });

  $(document).on('tap', function(e){
    var tap = e.type;
    if (tap && player_input === false && !game_over){
      var i = 0;
      player_input = setInterval(function(){
        upward();
        if (++i >= 5) {
          clearInterval(player_input);
          player_input = false;
        }
      }, 1000/60);
    }
  });

  $('#restart').on('click', function(){
    restart.fadeOut();
    restart_game();
    // location.reload();
  });

  // start game
  function start_game(){

    /* Check for game end */
    if (collision(bird, pole_1) || collision(bird, pole_2) ||
        parseInt(bird.css('top')) <= 0 ||
        parseInt(bird.css('top')) >= container_height - bird_height) {
      game_over = true;
      clearInterval(player_input);
      player_input = false;
      death_sound.play();
      end_game();
    } else {


      /* Pole Mechanics */
      var pole_current_position = parseInt(pole.css('right'));

      // update the score and high score
      if (pole_current_position > container_width - bird_left){
        if (!score_updated){
          var current_score = parseInt(score_display.text()) + 1;
          score_sound.play();
          score_display.text(current_score);
          score_updated = true;
          if (current_score > parseInt(high_score_display.text())) {
            high_score_display.text(current_score);
            high_score_display.css('color', 'brown');
          }
        }
      }

      // check if poles are in the container
      // if not, reset poles' positions, give them random new heights
      // and increase speed of the game
      if (pole_current_position > container_width) {
        var new_height = parseInt((Math.random() - 1/2) * 200);
        pole_1.css('height', pole_init_height + new_height);
        pole_2.css('height', pole_init_height - new_height);
        speed = speed + 1/2;
        speed_display.text(speed * 2);
        pole_current_position = pole_init_position;
        score_updated = false;
      }

      // if poles are still in the container, move them to the left
      pole.css('right', pole_current_position + speed);


      /* Bird Mechanics */

      // if there is no user input, move the bird downward
      // if there is, move the bird upward (using the event listener)
      if (!player_input) {
        downward();
      }
    }
  }

  // move the bird upward
  function upward(){
    bird.css('top', parseInt(bird.css('top')) - 10);
  }

  // move the bird downward
  function downward(){
    bird.css('top', parseInt(bird.css('top')) + 5);
  }

  // collision detection
  function collision($div1, $div2) {
    var x1 = $div1.offset().left;
    var y1 = $div1.offset().top;
    var h1 = $div1.outerHeight(true);
    var w1 = $div1.outerWidth(true);
    var b1 = y1 + h1;
    var r1 = x1 + w1;
    var x2 = $div2.offset().left;
    var y2 = $div2.offset().top;
    var h2 = $div2.outerHeight(true);
    var w2 = $div2.outerWidth(true);
    var b2 = y2 + h2;
    var r2 = x2 + w2;

    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
    return true;
  }

  // game over
  function end_game(){
    clearInterval(game);
    game = false;
    restart.fadeIn();
  }

  // reset object positions & state variables
  // restart game
  function restart_game(){
    bird.css('top', bird_init_top);
    pole.css('right', pole_init_position);
    pole.css('height', pole_init_height);
    score_display.text(0);
    high_score_display.css('color', 'black');
    speed = 5;
    speed_display.text(10);
    if (player_input != false){
      clearInterval(player_input);
      player_input = false;
    }
    score_updated = false;
    game_over = false;
    if (game === false){
     game = setInterval(start_game , 1000/60);
    }
  }

});
