const sidebar = document.getElementById("sidebar")
const main = document.getElementById("main")
const title = document.getElementById("Title")
const list = document.getElementById("list")
const addThing = document.getElementById("AddThing")
const search = document.getElementById("Search")

let obj = fileDo.read()
const fillList = (str, data) => {
  list.innerHTML=`
    <tr>
        <td width="70%">${str}</td>
        <td width="30%">Cost</td>
    </tr>` +tableFromData(data)
  let rows = list.getElementsByTagName("tr");
  for (let i = 0; i < rows.length; i++) {
    let currentRow = list.rows[i];
    const createClickHandler = (row) => {
      return function() {
        let cells = row.getElementsByTagName("td");
        if(cells[1].innerHTML == "Cost") return;
        let data = [cells[0].innerHTML, cells[1].innerHTML]
        if(title.innerHTML[0] == 'P'){
          editTable(data);
        }else if(title.innerHTML[0] == 'S'){
          editMixes(data)
        }else{
          MeditMixes(data)
        }
      };
    };
    currentRow.onclick = createClickHandler(currentRow);
  }
}

let srhtxt = ""
setInterval(() => {
  if(search.value == srhtxt) return;
  srhtxt = search.value
  if(title.innerHTML[0] == 'P'){
    fillList("Material", searchIn(search.value, obj.primary))
  }else if(title.innerHTML[0] == 'S'){
    fillList("Mix", searchIn(search.value, obj.special))
  }else{
    fillList("Meals", searchIn(search.value, obj.meals))
  }
}, 500);

function tableFromData(data){
  let res = ''
  for(let i = 0; i < data.length; i++){
    res += '<tr>'
    for(let j = 0; j < data[i].length; j++){
      res += `<td>${data[i][j]}</td>`
    }
    res += '</tr>'
  }
  return res
}
function searchIn(str, data, mch = false){
  if(str == "") return data;
  let res = []
  str = str.toLowerCase()
  for(let i of data){
    let s = i[0].toLowerCase();
    if(s.includes(str) && !mch || s == str && mch){
      res.push(i)
    }
  }
  return res;
}

addThing.addEventListener("click", () => {
  if(title.innerHTML[0] == 'P'){
    addMaterial.style.visibility = "visible"
    addMaterial.style.opacity = 100
  }else if(title.innerHTML[0] == 'S'){
    addMix.style.visibility = "visible"
    addMix.style.opacity = 100
    AMTable.innerHTML = `
    <tr>
      <td>Material/Mix</td>
      <td>Cost Kg/L</td>
      <td>Amount g/mL</td>
      <td>X</td>
    </tr>`
  }else{
    addMeal.style.visibility = "visible"
    addMeal.style.opacity = 100
    MAMTable.innerHTML = `
    <tr>
      <td>Material/Mix</td>
      <td>Cost Kg/L</td>
      <td>Amount g/mL</td>
      <td>X</td>
    </tr>`
  }
})

function hideWindow(FWindow){
  FWindow.style.opacity = 0
  setTimeout(() => {
    FWindow.style.visibility = 'hidden'
  }, 400)
}
