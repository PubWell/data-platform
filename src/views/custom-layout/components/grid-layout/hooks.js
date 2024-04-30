export const compact = (layoutdata) => {
  const compareWith = []
  const sorted = sortLayoutItemsByRowCol(layoutdata)
  const out = Array(sorted.length)

  sorted.forEach((l) => {

    l = compactItemByCol(compareWith, l)
    l = compactItemByRow(compareWith, l)
    // 加入对比数组，检测冲突时比较其中的元素
    compareWith.push(l);

    // 放入输出的数组，维持原来的顺序
    out[layoutdata.indexOf(l)] = l

    // Clear moved flag, if it exists.
    // l.moved = false;
  })
  return out
}

// 根据行列对元素重新排列
const sortLayoutItemsByRowCol = (layoutdata) => {
  return [].concat(layoutdata).sort(function (a, b) {
    if (a.y === b.y && a.x === b.x) {
      return 0
    }
    if (a.y > b.y || (a.y === b.y && a.x > b.x)) {
      return 1
    }
    return -1
  });
}

// 判断每一个元素的冲突情况，无冲突则y=0，有冲突则y=冲突项的y+冲突项的h
const compactItemByCol = (compareWith, item) => {
  while ((item.y == 0 && item.x > 0) || (item.y >= item.h)) {
    let next = {}
    if(item.x > 0){
      next = {
        ...item,
        x: item.x - 1
      }
      if(!getFirstCollision(compareWith, next)){
        item.x = item.x - 1
      }else{
        break
      }
    }else{
      next = {
        ...item,
        x: 12-item.w,
        y: item.y-item.h
      }
      if(!getFirstCollision(compareWith, next)){
        item.x = 12-item.w
        item.y = item.y-item.h
      }else{
        break
      }
    }
  }
  // let collides;
  // while ((collides = getFirstCollision(compareWith, item))) {
  //   console.log(collides)
  //   item.x = collides.x + collides.w;
  // }
  return item
}

const compactItemByRow = (compareWith, item) => {
  while (item.y > 0 && !getFirstCollision(compareWith, item)) {
    item.y--;
  }
  let collides;
  while ((collides = getFirstCollision(compareWith, item))) {
    item.y = collides.y + collides.h;
  }
  return item
}

// 找到第一个冲突的元素
const getFirstCollision = (compareWith, item) => {
  for (let i = 0, len = compareWith.length; i < len; i++) {
    if (collides(compareWith[i], item)) return compareWith[i]
  }
}

// 判断两个元素是否有冲突重叠
const collides = (item1, item2) => {
  if (item1 === item2) return false; // 同一个item
  if (item1.x + item1.w <= item2.x) return false; // item1 在 item2左边
  if (item1.x >= item2.x + item2.w) return false; // item1 在 item2右边
  if (item1.y + item1.h <= item2.y) return false; // item1 在 item2上边
  if (item1.y >= item2.y + item2.h) return false; // item1 在 item2下边
  return true // 其他情况则是有冲突重叠
}


// 重新排序
const compactLayout = (layoutValue) => {
  sortLayoutItemsByRowCol(layoutValue)
  nextTick(() => {
    // to do -- 0
    // layoutValue[0].x = 0
    // layoutValue[0].y = 0
    for(let i = 1; i < layoutValue.length; i++){
      let cy = {...layoutValue[i]}, pres = layoutValue.slice(0, i-1)
      let isCover = pres.filter((item) => item.y <= layoutValue[i-1].y && item.y + item.h > layoutValue[i-1].y + layoutValue[i-1].h)
      // if(isCover.length && cy.x >= layoutValue[i-1].x){

      // }
      // 行修改
      if(
        layoutValue[i].y > layoutValue[i-1].y + layoutValue[i-1].h
      ){
        let dy = layoutValue[i-1].y + layoutValue[i-1].h - cy.y
        // y
        if(isCover.length){
          isCover.sort((a,b) => {
            return a.y + a.h < b.y + b.h
          })
          dy = isCover[0].y + isCover[0].h - cy.y
        }
        layoutValue.forEach((l, idx) => {
          if(l.y >= cy.y){
            layoutValue[idx].y += dy
          }
        })
        console.log('行修改',i,layoutValue[i],layoutValue)
      }
    }
    return
    for(let i = 1; i < layoutValue.length; i++){
      // 列修改
      if(
        layoutValue[i].y < layoutValue[i-1].y + layoutValue[i-1].h
        && layoutValue[i].x >= layoutValue[i-1].x + layoutValue[i-1].w
        &&
        (
          (
            i < layoutValue.length - 1 
            && ( layoutValue[i+1].y == layoutValue[i].y || layoutValue[i+1].y >= layoutValue[i].y + layoutValue[i].h )
          )
          || i == layoutValue.length - 1
        )
      ){
        layoutValue[i].y = layoutValue[i-1].y
        layoutValue[i].x = layoutValue[i-1].x + layoutValue[i-1].w
        console.log('列修改1',i,layoutValue[i],layoutValue)
      }
  
      if(
        layoutValue[i].y >= layoutValue[i-1].y + layoutValue[i-1].h
        && layoutValue[i-1].x + layoutValue[i-1].w + layoutValue[i].w <= cols.value
        && !layoutValue.some((item) => item.y <= layoutValue[i-1].y && item.y + item.h >= layoutValue[i-1].y + layoutValue[i-1].h)
      ){
        layoutValue[i].y = layoutValue[i-1].y
        layoutValue[i].x = layoutValue[i-1].x + layoutValue[i-1].w
        console.log('列修改2',i,layoutValue[i],layoutValue)
      }

    }
    const fun = (a) => {
      for(let i = 1; i < a.length; i++){
        if(a[i].y > a[i-1].y + a[i-1].h){
          a[i].y = a[i-1].y + a[i-1].h
          a[i].x = 0
          console.log('行修改',[].concat(a))
          fun(a)
          break
        }
        if(
          a[i].y < a[i-1].y + a[i-1].h
          && a[i].x > a[i-1].x + a[i-1].w
          && i < a.length - 1 && a[i+1].y <= a[i].y + a[i].h
        ){
          a[i].y = a[i-1].y
          a[i].x = a[i-1].x + a[i-1].w
          console.log('列修改1',[].concat(a))
          fun(a)
          break
        }
        if(
          a[i].y > a[i-1].y + a[i-1].h
          && a[i].x + a[i].w + a[i-1].w <= cols.value
        ){
          a[i].y = a[i-1].y
          a[i].x = a[i-1].x + a[i-1].w
          console.log('列修改2',[].concat(a))
          fun(a)
          break
        }
      }
    }
    // fun(layoutValue)
  })
}