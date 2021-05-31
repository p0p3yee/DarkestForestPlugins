df.minerManager.miningPattern.__proto__.nextChunk = function(chunk) {
  const delta = this.chunkSideLength * 2;
  const homeX = this.fromChunk.bottomLeft.x;
  const homeY = this.fromChunk.bottomLeft.y;
  const currX = chunk.bottomLeft.x;
  const currY = chunk.bottomLeft.y;
  const cadd = currY + currX;
  const csub = currY - currX;
  const hadd = homeY + homeX;
  const hsub = homeY - homeX;
  const nextBottomLeft = { x: currX, y: currY };
  if (currX === homeX && currY === homeY) {
    nextBottomLeft.y = homeY + delta;
  } else if (csub > hsub && cadd >= hadd) {
    if (cadd === hadd) {
      nextBottomLeft.y = currY + delta;
    } else {
      nextBottomLeft.x = currX + delta;
    }
  } else if (cadd > hadd && csub <= hsub) {
    nextBottomLeft.y = currY - delta;
  } else if (cadd <= hadd && csub < hsub) {
    nextBottomLeft.x = currX - delta;
  } else {
    nextBottomLeft.y = currY + delta;
  }
  return {
    bottomLeft: nextBottomLeft,
    sideLength: this.chunkSideLength,
  };
}

// const delta = this.chunkSideLength * 2;
// 1 will make it mine normally
// 2 will give you the really small checker pattern (the best, imo)
// 4 will make a wider pattern (not too efficient, imo, unless just searching for space types)