import {
  move
} from 'https://plugins.zkga.me/utils/queued-move.js';

import {
  eachLimit
} from 'https://cdn.skypack.dev/async-es';

import {
  UpgradeBranchName,
  canStatUpgrade,
} from 'https://plugins.zkga.me/utils/utils.js'

const MAX_LEVEL_PLANET = 9;

class Plugin {
  constructor() {
    this.minPlanetLevel = 3;
    this.maxEnergyPercent = 85;

    this.maxSilverEnergyPercent = 85;
    this.minSilverPlanetLevel = 3;
    this.maxAsteroidLevel = 2;
  }

  render(container) {
    container.style.width = '250px';

    container.appendChild(document.createElement("br"))

    const firstDiv = document.createElement("div")

    const stepperLabel = document.createElement('label');
    stepperLabel.innerText = 'Max Energy:';
    // stepperLabel.style.display = 'block';

    const stepper = document.createElement('input');
    stepper.type = 'range';
    stepper.min = '0';
    stepper.max = '100';
    stepper.step = '5';
    stepper.value = `${this.maxEnergyPercent}`;
    stepper.style.marginLeft = '5%';
    stepper.style.width = '30%';
    stepper.style.height = '24px';

    const percent = document.createElement('span');
    percent.innerText = `${stepper.value}%`;
    percent.style.marginLeft = '5%';
    stepper.onchange = (evt) => {
      percent.innerText = `${evt.target.value}%`;
      try {
        this.maxEnergyPercent = parseInt(evt.target.value, 10);
      } catch (e) {
        console.error('could not parse energy percent', e);
      }
    }

    firstDiv.appendChild(stepperLabel)
    firstDiv.appendChild(stepper)
    firstDiv.appendChild(percent)

    const secondDiv = document.createElement("div")

    const levelLabel = document.createElement('label');
    levelLabel.innerText = 'Min. Planet LV:';

    const level = document.createElement('select');
    level.style.outline = "1px solid white"
    level.style.background = 'rgb(8,8,8)';
    level.style.marginTop = '10px';
    level.style.marginBottom = '10px';
    level.style.marginLeft = '5px';
    [0, 1, 2, 3, 4, 5, 6, 7].forEach(lvl => {
      let opt = document.createElement('option');
      opt.value = `${lvl}`;
      opt.innerText = `Level ${lvl}`;
      level.appendChild(opt);
    });
    level.value = `${this.minPlanetLevel}`;

    level.onchange = (evt) => {
      try {
        this.minPlanetLevel = parseInt(evt.target.value);
      } catch (e) {
        console.error('could not parse planet level', e);
      }
    }

    secondDiv.appendChild(levelLabel)
    secondDiv.appendChild(level)

    
    const autoClawMessage = document.createElement('div');
    let autoCrawlInterval;

    const doCrawlAll = () => {
      autoClawMessage.innerText = 'Auto Crawling, Please wait...';
      let moves = 0;
      for (let planet of df.getMyPlanets()) {
        setTimeout(() => {
          moves += capturePlanets(
            planet.locationId,
            this.minPlanetLevel,
            this.maxEnergyPercent,
          );
          autoClawMessage.innerText = `Auto Crawling ${moves} planets.\n${new Date().toLocaleString()}`;
        }, 0);
      }
    }

    let autoButton = document.createElement('button');
    autoButton.style.width = '100%';
    autoButton.style.marginBottom = '10px';
    autoButton.innerHTML = 'Auto Crawl everything!'
    autoButton.onclick = () => {
      if (autoCrawlInterval == null) {
        doCrawlAll()
        autoCrawlInterval = setInterval(doCrawlAll, 1000 * 60 * 5)
        autoButton.innerHTML = 'Stop Auto Crawl'
      } else {
        clearInterval(autoCrawlInterval)
        autoCrawlInterval = null
        autoClawMessage.innerText = `Auto Crawling Stopped`
        autoButton.innerHTML = 'Auto Crawl everything!'
      } 
    }

    // Start of auto crawl
    const crawlTitle = document.createElement("span")
    crawlTitle.innerHTML = "Planets Crawler"
    container.appendChild(crawlTitle)
    container.appendChild(firstDiv)
    container.appendChild(secondDiv);
    container.appendChild(autoButton);
    container.appendChild(autoClawMessage);

    container.appendChild(document.createElement("br"))
    container.appendChild(document.createElement("hr"))
    container.appendChild(document.createElement("hr"))
    container.appendChild(document.createElement("br"))

    // Start of silver distribution
    const silverTitle = document.createElement("span")
    silverTitle.innerHTML = "Silver Distribution"
    container.appendChild(silverTitle)

    const silverFirstDiv = document.createElement("div")

    const silverStepperLabel = document.createElement('label');
    silverStepperLabel.innerText = 'Max Energy:';

    const silverStepper = document.createElement('input');
    silverStepper.type = 'range';
    silverStepper.min = '0';
    silverStepper.max = '100';
    silverStepper.step = '5';
    silverStepper.value = `${this.maxSilverEnergyPercent}`;
    silverStepper.style.marginLeft = '5%';
    silverStepper.style.width = '30%';
    silverStepper.style.height = '24px';

    const silverPercent = document.createElement('span');
    silverPercent.innerText = `${silverStepper.value}%`;
    silverPercent.style.marginLeft = '5%';
    silverStepper.onchange = (evt) => {
      silverPercent.innerText = `${evt.target.value}%`;
      try {
        this.maxSilverEnergyPercent = parseInt(evt.target.value, 10);
      } catch (e) {
        console.error('could not parse energy percent', e);
      }
    }

    silverFirstDiv.appendChild(silverStepperLabel)
    silverFirstDiv.appendChild(silverStepper)
    silverFirstDiv.appendChild(silverPercent)

    const silverSecondDiv = document.createElement("div")

    const silverLevelLabel = document.createElement('label');
    silverLevelLabel.innerText = 'Min.LV to send:';

    const silverLevel = document.createElement('select');
    silverLevel.style.outline = "1px solid white"
    silverLevel.style.background = 'rgb(8,8,8)';
    silverLevel.style.marginTop = '10px';
    silverLevel.style.marginBottom = '10px';
    silverLevel.style.marginLeft = '5px';
    Array.from(Array(MAX_LEVEL_PLANET+1).keys()).forEach(lvl => {
      let opt = document.createElement('option');
      opt.value = `${lvl}`;
      opt.innerText = `Level ${lvl}`;
      silverLevel.appendChild(opt);
    });
    silverLevel.value = `${this.minSilverPlanetLevel}`;

    silverLevel.onchange = (evt) => {
      try {
        this.minSilverPlanetLevel = parseInt(evt.target.value);
      } catch (e) {
        console.error('could not parse planet level', e);
      }
    }

    silverSecondDiv.appendChild(silverLevelLabel)
    silverSecondDiv.appendChild(silverLevel)

    const silverThirdDiv = document.createElement("div")

    const levelAsteroidLabel = document.createElement('label');
    levelAsteroidLabel.innerText = 'Max.Lv asteroid:';

    const levelAsteroid = document.createElement('select');
    levelAsteroid.style.outline = "1px solid white"
    levelAsteroid.style.background = 'rgb(8,8,8)';
    levelAsteroid.style.marginTop = '10px';
    levelAsteroid.style.marginBottom = '10px';
    levelAsteroid.style.marginLeft = '5px';
    Array.from(Array(MAX_LEVEL_PLANET+1).keys()).forEach(lvl => {
      let opt = document.createElement('option');
      opt.value = `${lvl}`;
      opt.innerText = `Level ${lvl}`;
      levelAsteroid.appendChild(opt);
    });
    levelAsteroid.value = `${this.minSilverPlanetLevel}`;

    levelAsteroid.onchange = (evt) => {
      try {
        this.maxAsteroidLevel = parseInt(evt.target.value);
      } catch (e) {
        console.error('could not parse planet level', e);
      }
    }

    silverThirdDiv.append(levelAsteroidLabel)
    silverThirdDiv.append(levelAsteroid)
    
    const silverMessage = document.createElement("div")
    let autoSendToPlanet

    const sendToPlanet = (isSpaceRift) => {
      silverMessage.innerText = 'Please wait...';
      let moves = 0;
      for (let planet of df.getMyPlanets()) {
        if (isAsteroid(planet) && planet.planetLevel <= this.maxAsteroidLevel) {
          setTimeout(() => {
            moves += distributeSilver(planet.locationId, this.maxSilverEnergyPercent, this.minSilverPlanetLevel, isSpaceRift);
            silverMessage.innerText = `Sending to ${moves} ${isSpaceRift ? "Space rifts" : "Planets"}.\n${new Date().toLocaleString()}`;
          }, 0);
        }
      }
    }

    const autoSendToPlanetBtn = document.createElement('button');
    autoSendToPlanetBtn.style.width = '100%';
    autoSendToPlanetBtn.style.marginBottom = '10px';
    autoSendToPlanetBtn.innerHTML = 'Auto to Planets'
    autoSendToPlanetBtn.onclick = () => {
      if(autoSendToPlanet == null) {
        sendToPlanet(false)
        autoSendToPlanet = setInterval(() => {
          sendToPlanet(false)
        }, 1000 * 60 * 10)
        autoSendToPlanetBtn.innerHTML = 'Stop Auto to Planets';
      } else {
        clearInterval(autoSendToPlanet)
        autoSendToPlanet = null
        autoSendToPlanetBtn.innerHTML = 'Auto to Planets';
      }
    }

    let autoSendToSpaceRift

    const autoToSpaceRiftBtn = document.createElement('button');
    autoToSpaceRiftBtn.style.width = '100%';
    autoToSpaceRiftBtn.style.marginBottom = '10px';
    autoToSpaceRiftBtn.innerHTML = 'Auto to Space Rift';
    autoToSpaceRiftBtn.onclick = () => {
      if(autoSendToSpaceRift == null) {
        sendToPlanet(true)
        autoSendToSpaceRift = setInterval(() => {
          sendToPlanet(true)
        }, 1000 * 60 * 10)
        autoToSpaceRiftBtn.innerHTML = 'Stop Auto to Space Rift';
      } else {
        clearInterval(autoSendToSpaceRift)
        autoSendToSpaceRift = null
        autoToSpaceRiftBtn.innerHTML = 'Auto to Space Rift';
      }
    }

    let autoWithdraw;

    const withdrawSilverFunc = () => {
      silverMessage.innerText = 'Please wait...';
      let moves = 0;
      let silver = 0;
      for (let planet of df.getMyPlanets()) {
        if (isSpaceRift(planet)) {
          setTimeout(() => {
            silver+= withdrawSilver(planet.locationId);
            moves+= 1;  
            silverMessage.innerText = `Withdrawing ${silver} from ${moves} space rifts.\n${new Date().toLocaleString()}`;
          }, 0);
        }
      }
    }

    const withdrawButton = document.createElement('button');
    withdrawButton.style.width = '100%';
    withdrawButton.style.marginBottom = '10px';
    withdrawButton.innerHTML = 'Auto Withdraw from Space Rift';
    withdrawButton.onclick = () => {
      if (autoWithdraw == null) {
        withdrawSilverFunc()
        autoWithdraw = setInterval(withdrawSilverFunc, 1000 * 60 * 10)
        withdrawButton.innerHTML = `Stop Auto Withdraw from Space Rift`;
      } else {
        clearInterval(autoWithdraw)
        autoWithdraw = null
        withdrawButton.innerHTML = `Auto Withdraw from Space Rift`;
      }
    }

    container.appendChild(silverFirstDiv)
    container.appendChild(silverSecondDiv)
    container.appendChild(silverThirdDiv);
    container.appendChild(autoSendToPlanetBtn);
    container.appendChild(autoToSpaceRiftBtn);
    container.appendChild(withdrawButton)
    container.appendChild(silverMessage)
    container.appendChild(document.createElement("br"))
    container.appendChild(document.createElement("hr"))
    container.appendChild(document.createElement("hr"))
    container.appendChild(document.createElement("br"))

    // Start of auto upgrade
    const autoUpgradeTitle = document.createElement("span")
    autoUpgradeTitle.innerHTML = "Auto Upgrade"
    container.appendChild(autoUpgradeTitle)
    container.appendChild(document.createElement("br"))

    const canPlanetUpgrade = planet => {
      if(!planet){
        return false
      }
      return df.entityStore.constructor.planetCanUpgrade(planet)
    }
    
    function upgrade(planet, branch) {
      if (planet && canPlanetUpgrade(planet) && canStatUpgrade(planet, branch)) {
        df.upgrade(planet.locationId, branch)
      }
    }

    const autoUpgradeMessage = document.createElement("div")

    let upgradeInterval
    let runningBranch

    function doUpgrade(branch) {
      let myPlanets = df.getMyPlanets() .filter(planet => canPlanetUpgrade(planet) && canStatUpgrade(planet, branch));

      if (myPlanets.length === 0) {
        autoUpgradeMessage.innerText = `[${branch == 0 ? "Def" : branch == 1 ? "Range" : "Speed"}]` + 'No planet can be upgraded.\n' + new Date().toLocaleString()
        return;
      }

      autoUpgradeMessage.innerText = `[${branch == 0 ? "Def" : branch == 1 ? "Range" : "Speed"}]` + myPlanets.length + ' planets can be upgraded.\n' + new Date().toLocaleString()

      eachLimit(myPlanets, 1, (planet, cb) => {
        setTimeout(() => {
          upgrade(planet, branch);
          cb();
        }, 250);
      }, () => {
        autoUpgradeMessage.innerText = `[${branch == 0 ? "Def" : branch == 1 ? "Range" : "Speed"}]` + myPlanets.length + ' Planets upgrades queued!\n' + new Date().toLocaleString()
      })
    }

    const upgradeDefBtn = document.createElement('button');
    const upgradeRangeBtn = document.createElement('button');
    const upgradeSpeedBtn = document.createElement('button');

    const upgradeBtnArr = [upgradeDefBtn, upgradeRangeBtn, upgradeSpeedBtn]

    function upgradeBtnOnClick(branch) {
      if (upgradeInterval == null && runningBranch == null) {
        doUpgrade(branch)
        upgradeInterval = setInterval(() => {
          doUpgrade(branch)
        }, 1000 * 60 * 15)
        runningBranch = branch
        upgradeBtnArr[branch].innerHTML = "Stop"
        upgradeBtnArr.forEach((v, i) => {
          if (i != branch) {
            v.disabled = true
            v.innerHTML = "/"
          }
        })
      } else if (upgradeInterval != null){

        if (runningBranch != branch) {
          autoUpgradeMessage.innerText = `Please stop auto upgrade first`
        } else {
          clearInterval(upgradeInterval)
          upgradeInterval = null
          runningBranch = null
          upgradeBtnArr.forEach((v, i) => {
            v.disabled = false
            v.innerHTML = i == 0 ? "Def" : i == 1 ? "Range" : "Speed"
          })
        }

      } else {
        runningBranch = null
      }
      autoUpgradeMessage.innerText = branch
    }
    
    const upgradeBtnDiv = document.createElement("div")
    upgradeBtnDiv.style.display = "flex"
    upgradeBtnDiv.style.flexDirection = "row"

    
    upgradeDefBtn.style.marginBottom = '10px'
    upgradeDefBtn.style.display = "flex"
    upgradeDefBtn.style.flexGrow = 1
    upgradeDefBtn.innerHTML = 'Def';
    upgradeDefBtn.onclick = () => upgradeBtnOnClick(UpgradeBranchName.Defense)

    
    upgradeRangeBtn.style.marginBottom = '10px'
    upgradeRangeBtn.style.display = "flex"
    upgradeRangeBtn.style.flexGrow = 1
    upgradeRangeBtn.innerHTML = 'Range';
    upgradeRangeBtn.onclick = () => upgradeBtnOnClick(UpgradeBranchName.Range)

    
    upgradeSpeedBtn.style.marginBottom = '10px'
    upgradeSpeedBtn.style.display = "flex"
    upgradeSpeedBtn.style.flexGrow = 1
    upgradeSpeedBtn.innerHTML = 'Speed';
    upgradeSpeedBtn.onclick = () => upgradeBtnOnClick(UpgradeBranchName.Speed)

    upgradeBtnDiv.appendChild(upgradeDefBtn)
    upgradeBtnDiv.appendChild(upgradeRangeBtn)
    upgradeBtnDiv.appendChild(upgradeSpeedBtn)
    
    container.append(upgradeBtnDiv)
    container.append(autoUpgradeMessage)

    container.appendChild(document.createElement("br"))
  }
}

export default Plugin;


function capturePlanets(fromId, minCaptureLevel, maxDistributeEnergyPercent) {
  const planet = df.getPlanetWithId(fromId);
  const from = df.getPlanetWithId(fromId);

  // Rejected if has pending outbound moves
  const unconfirmed = df.getUnconfirmedMoves().filter(move => move.from === fromId)
  if (unconfirmed.length !== 0) {
    return 0;
  }

  const candidates_ = df.getPlanetsInRange(fromId, maxDistributeEnergyPercent)
    .filter(p => (
      p.owner !== df.account &&
      p.owner === "0x0000000000000000000000000000000000000000" &&
      p.planetLevel >= minCaptureLevel
    ))
    .map(to => {
      return [to, distance(from, to)]
    })
    .sort((a, b) => a[1] - b[1]);

  let i = 0;
  const energyBudget = Math.floor((maxDistributeEnergyPercent / 100) * planet.energy);

  let energySpent = 0;
  let moves = 0;
  while (energyBudget - energySpent > 0 && i < candidates_.length) {

    const energyLeft = energyBudget - energySpent;

    // Remember its a tuple of candidates and their distance
    const candidate = candidates_[i++][0];

    // Rejected if has unconfirmed pending arrivals
    const unconfirmed = df.getUnconfirmedMoves().filter(move => move.to === candidate.locationId)
    if (unconfirmed.length !== 0) {
      continue;
    }

    // Rejected if has pending arrivals
    const arrivals = getArrivalsForPlanet(candidate.locationId);
    if (arrivals.length !== 0) {
      continue;
    }

    const energyArriving = (candidate.energyCap * 0.15) + (candidate.energy * (candidate.defense / 100));
    // needs to be a whole number for the contract
    const energyNeeded = Math.ceil(df.getEnergyNeededForMove(fromId, candidate.locationId, energyArriving));
    if (energyLeft - energyNeeded < 0) {
      continue;
    }

    move(fromId, candidate.locationId, energyNeeded, 0);
    energySpent += energyNeeded;
    moves += 1;
  }

  return moves;
}


function withdrawSilver(fromId) {
  const from = df.getPlanetWithId(fromId);
  const silver =  Math.floor(from.silver);
  if (silver === 0) {
    return 0;
  } 
  df.withdrawSilver(fromId, silver);
  return silver;
}

function toPlanetOrSpaceRift(planet, toSpaceRift) {
      return toSpaceRift ? isSpaceRift(planet) : isPlanet(planet);
}

function distributeSilver(fromId, maxDistributeEnergyPercent, minPLevel, toSpaceRift) {
  const from = df.getPlanetWithId(fromId);
  const silverBudget = Math.floor(from.silver);

  // we ignore 50 silvers or less
  if( silverBudget < 50 ) {
    return 0;
  }
  const candidates_ = df.getPlanetsInRange(fromId, maxDistributeEnergyPercent)
    .filter(p => p.owner === df.getAccount()) //get player planets
    .filter(p => toPlanetOrSpaceRift(p, toSpaceRift)) // filer planet or space rift 
    .filter(p => p.planetLevel >= minPLevel) // filer level
    .map(to => [to, distance(from, to)])
    .sort((a, b) => a[1] - b[1]);


  let i = 0;
  const energyBudget = Math.floor((maxDistributeEnergyPercent / 100) * from.energy);

  let energySpent = 0;
  let silverSpent = 0;
  let moves = 0;
  while (energyBudget - energySpent > 0 && i < candidates_.length) {

    const silverLeft = silverBudget - silverSpent;
    const energyLeft = energyBudget - energySpent;

    // Remember its a tuple of candidates and their distance
    const candidate = candidates_[i++][0];

    // Rejected if has more than 5 pending arrivals. Transactions are reverted when more arrives. You can't increase it
    const unconfirmed = df.getUnconfirmedMoves().filter(move => move.to === candidate.locationId)
    const arrivals = getArrivalsForPlanet(candidate.locationId);
    if (unconfirmed.length + arrivals.length> 4) {
      continue;
    }

    const silverRequested = Math.ceil(candidate.silverCap - candidate.silver);
    const silverNeeded = silverRequested > silverLeft ? silverLeft : silverRequested;


    // Setting a 100 silver guard here, but we could set this to 0
    if (silverNeeded < 100) {
      continue;
    }

    // needs to be a whole number for the contract
    const energyNeeded = Math.ceil(df.getEnergyNeededForMove(fromId, candidate.locationId, 1));
    if (energyLeft - energyNeeded < 0) {
      continue;
    }

    move(fromId, candidate.locationId, energyNeeded, silverNeeded);
    energySpent += energyNeeded;
    silverSpent += silverNeeded;
    moves += 1;
  }

  return moves;
}

function isAsteroid(planet) {
return planet.planetType === 1;
}

function isPlanet(planet) {
  return planet.planetType === 0;
}

function isSpaceRift(planet) {
  return planet.planetType === 3;
}

function getArrivalsForPlanet(planetId) {
  return df.getAllVoyages().filter(arrival => arrival.toPlanet === planetId).filter(p => p.arrivalTime > Date.now() / 1000);
}

//returns tuples of [planet,distance]
function distance(from, to) {
  let fromloc = from.location;
  let toloc = to.location;
  return Math.sqrt((fromloc.coords.x - toloc.coords.x) ** 2 + (fromloc.coords.y - toloc.coords.y) ** 2);
}