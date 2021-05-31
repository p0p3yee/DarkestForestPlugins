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
      newLoc.innerText = x.prospectedBlockNumber == null ? enoughEnergy ? "Not Been Prospected" : "Not enought energy to prospect" : x.hasTriedFindingArtifact ? "Found, click to view planet" : "Not Been Found"
      // newLoc.disabled = x.hasTriedFindingArtifact
      newLoc.onclick = async () => {
        if (x.prospectedBlockNumber == null) {
          if (enoughEnergy) {
            await df.prospectPlanet(x.locationId)
          } else {
            ui.setSelectedId(x.locationId)
            message.innerHTML = "Not enough energy to prospect this planet"
            return
          }
        }
        ui.setSelectedId(x.locationId)
        if (x.hasTriedFindingArtifact) {
          return
        }
        df.findArtifact(x.locationId)
        message.innerHTML = "Finding Artifact..."
      }
  
      container.appendChild(newLoc)
      container.appendChild(refreshBtn)
      
      // container.innerHTML += "<br />"
    })
    container.appendChild(message)
  }

  refreshBtn.onclick = () => find()

  find()

}

  destroy() {}
}

export default ArtifactFinder;
