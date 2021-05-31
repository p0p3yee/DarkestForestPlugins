class ArtifactFinder {
  constructor() {}

render(container) {

  let refreshBtn = document.createElement("button")
  refreshBtn.style.width = '100%';
  refreshBtn.style.marginBottom = '10px';
  refreshBtn.innerText = "Refresh"

  const find = () => {
    container.innerHTML = ""
    let message = document.createElement("div")
    df.getMyPlanets().filter(p => p.location && df.isPlanetMineable(p)).forEach(x => {
      let newLoc = document.createElement("button")
      newLoc.style.width = '100%';
      newLoc.style.marginBottom = '10px';
      const enoughEnergy = x.energy >= x.energyCap * 0.95
      const isFound = x.hasTriedFindingArtifact
      if (isFound) return
      newLoc.innerText = x.prospectedBlockNumber == null ? enoughEnergy ? "Not Been Prospected" : "Not enought energy to prospect" : "Not Been Found"
      // newLoc.disabled = x.hasTriedFindingArtifact
      newLoc.onclick = async () => {
        ui.setSelectedId(x.locationId)
        if (x.hasTriedFindingArtifact) {
          return
        }

        if (x.prospectedBlockNumber == null) {
          if (enoughEnergy) {
            message.innerHTML = "Prospecting Planet..."
            await df.prospectPlanet(x.locationId)
          } else {
            message.innerHTML = `Not enough energy to prospect this planet<br/>Energy Required: ${x.energyCap * 0.95}<br/>Current Energy: ${x.energy}`
            return
          }
        }
        
        df.findArtifact(x.locationId)
        message.innerHTML = "Finding Artifact..."
      }
  
      container.appendChild(newLoc)
      
      // container.innerHTML += "<br />"
    })
    container.appendChild(refreshBtn)
    container.appendChild(message)
  }

  refreshBtn.onclick = () => find()

  find()

}

  destroy() {}
}

export default ArtifactFinder;
