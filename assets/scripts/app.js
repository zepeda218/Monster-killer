
const attackValue = 10; //It randomises in vendor.js
const monsterAttackValue = 20;
const strongAttackValue = 17;
const healValue = 20;
const mode_attack = "ATTACK";
const mode_strong_attack = "STRONG_ATTACK";
const log_event_player_attack = "PLAYER_ATTACK";
const log_event_player_strong_attack = "PLAYER_STRONG_ATTACK";
const log_event_monster_attack = "MONSTER_ATTACK";
const log_event_player_heal = "PLAYER_HEAL";
const log_event_game_over = "GAME_OVER";
let battleLog = [];
let lastLoggedEntry;


function getMaxLifeValues() {
  const enteredValue = prompt("Maximum life for you and the monster.", "100"); //Alert with an input
  const parsedValue = parseInt(enteredValue);

  if (isNaN(parsedValue) || parsedValue <= 0) {
    throw { message: "Invalid user input, not a number" };
  }
  return parsedValue;
}

let chosenMaxLife;

try {
  chosenMaxLife = getMaxLifeValues();
} catch (error) {
  console.log(error);
  chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;
const initialPlayerHealth = chosenMaxLife;

adjustHealthBars(chosenMaxLife);

function writeToLog(ev, val, monsterHealth, playerHealth) {
  let logEntry = {
    event: ev,
    value: val,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth,
  };

  switch (ev) {
    case log_event_player_attack:
      logEntry.target = "MONSTER";
      break;
    case log_event_player_strong_attack:
      logEntry.target = "MONSTER";
      break;
    case log_event_monster_attack:
      logEntry.target = "PLAYER";
      break;
    case log_event_player_heal:
      logEntry.target = "PLAYER";
      break;
    default:
      logEntry = {};
  }
  battleLog.push(logEntry);
}

//Resets the game
function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}


//Decides who wins
function endRound() {
  const playerDamage = dealPlayerDamage(monsterAttackValue);
  currentPlayerHealth -= playerDamage;
  
  writeToLog(
    log_event_monster_attack,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert("You would be dead but the bonus life saved you!");
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You won!");
    writeToLog(
      log_event_game_over,
      "PLAYER WON",
      currentMonsterHealth,
      currentPlayerHealth
    );
    reset();
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("You lost!");
    writeToLog(
      log_event_game_over,
      "MONSTER WON",
      currentMonsterHealth,
      currentPlayerHealth
    );
    reset();
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    writeToLog(
      log_event_game_over,
      "A DRAW",
      currentMonsterHealth,
      currentPlayerHealth
    );
    alert("You have a draw");
    reset();
  }
}

//Use of ternary operator: ?
function attackMonster(attackType) {
  // You can change the var from let to const bc you never change the value in another line
  const maxDamage =
    attackType === mode_attack ? attackValue : strongAttackValue;
  const logEvent =
    attackType === mode_attack
      ? log_event_player_attack
      : log_event_player_strong_attack;

  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
  endRound();
}

attackBtn.addEventListener("click", () => {
  attackMonster(mode_attack);
});

strongAttackBtn.addEventListener("click", () => {
  attackMonster(mode_strong_attack);
});

healBtn.addEventListener("click", () => {
  let healValue_;
  //Makes it dynamic. Increases the player health depending on its current health
  if (currentPlayerHealth >= chosenMaxLife - healValue) {
    alert("You cant heal to more than your max initial health");
    healValue_ = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue_ = healValue;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;

  writeToLog(
    log_event_player_heal,
    healValue_,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
});

//Key: event, target, value, etc. What's stored in the logEntry
//LogEntry[key]: Gives the value of the key in logEntry
//The name inside of [] has to be a string
//Condition: if its a number && its different from 0 OR
logBtn.addEventListener("click", () => {
  let i = 0;
  for (const logEntry of battleLog) {
    if ((!lastLoggedEntry && lastLoggedEntry !== 0) || lastLoggedEntry < i) {
      console.log(`Log Entry No.${i}`);
      for (const key in logEntry) {
        console.log(`-${key} -> ${logEntry[key]}`);
      }
      console.log('');
      lastLoggedEntry = i;
      break;
    }

    i++;
  }
  if (i == 0){
    alert("Remember to open you dev tools!");
  }
});

