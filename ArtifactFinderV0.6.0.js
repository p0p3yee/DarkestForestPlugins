class ArtifactFinder {
  constructor() {}

render(container) {

  let refreshBtn = document.createElement("button")
  refreshBtn.style.width = '100%';
  refreshBtn.style.marginBottom = '10px';
  refreshBtn.innerText = "Refresh"

  const find = () => {
    container.innerHTML = ""
    df.getMyPlanets().filter(p => p.location && df.isPlanetMineable(p)).forEach(x => {
      let message = document.createElement("div")
      let newLoc = document.createElement("button")
      newLoc.style.width = '100%';
      newLoc.style.marginBottom = '10px';
      newLoc.innerText = x.hasTriedFindingArtifact ? "Found, click to view planet" : "Not Found"
      // newLoc.disabled = x.hasTriedFindingArtifact
      newLoc.onclick = () => {
        ui.setSelectedId(x.locationId)
        if (x.hasTriedFindingArtifact) {
          return
        }
        df.findArtifact(x.locationId)
        message.innerHTML = "Finding Artifact..."
      }
  
      container.appendChild(newLoc)
      container.appendChild(refreshBtn)
      container.appendChild(message)
      // container.innerHTML += "<br />"
    })
  }

  refreshBtn.onclick = () => find()

  find()

}

  destroy() {}
}

export default ArtifactFinder;
