try{
const root = document.getElementById("root")
let obj = fileDo.read()

function element(tag, children, attributes){
    const cr = document.createElement(tag)
    for(let i of children){
        if(typeof(i) === 'string' || typeof(i) === 'number'){
            cr.innerHTML += i
        }else{
            cr.appendChild(i)
        }
    }
    for(let i in attributes){
        if(typeof(attributes[i]) === "object"){
            attributes[i] = Object.assign(cr[i], attributes[i])
        }else{
            cr[i] = attributes[i]
        }
    }
    return cr
}

let vobj = {}
function categ(ttl, buttons = [], children = [], ctg = true){
    const mg = element("img", [], {src: ctg? "arrow.svg": "", className: "arrow"})
    const bts = element("span", buttons, {style:{position: "absolute", left: "calc(100% - 150px)"}})
    const res = element("div", [element("div", [mg, ttl, bts], {style:{paddingBottom: "2px"}})].concat(children), {
        className: "categ"
    })
    return res;
}
function makeTree(nm, bj, vbj, pr = null, raw = false){
    vbj.name = nm
    vbj.itemsL = bj.items.length
    if(vbj.collapsed === undefined)
        vbj.collapsed = bj === obj? false: true
    const addCateg = (nm) => {
        let x = categ(nm, pr !== null? [
            element("img", [], {
                src: "add_category.svg",
                onclick: () => {
                    vbj.collapsed ^= 1
                    crpt = []
                    let x = vbj
                    while(x.parent !== null){
                        crpt.push(x.name)
                        x = x.parent
                    }
                    crpt.push("Home")
                    crpt.reverse()
                    cobj = obj
                    for(let i = 1; i < crpt.length; i++)
                        cobj = cobj.categories[crpt[i]]
                    AC.style.visibility = "visible"
                    AC.style.opacity = 1
                },
                className: "aButton"
            }),
            element("img", [], {
                src: "add_item.svg",
                onclick: () => {
                    vbj.collapsed ^= 1
                    crpt = []
                    let x = vbj
                    while(x.parent !== null){
                        crpt.push(x.name)
                        x = x.parent
                    }
                    crpt.push("Home")
                    crpt.reverse()
                    cobj = obj
                    for(let i = 1; i < crpt.length; i++)
                        cobj = cobj.categories[crpt[i]]
                    if(crpt[1][0] == "R"){
                        AM.style.visibility = "visible"
                        AM.style.opacity = 1
                    }else{
                        AMM.style.visibility = "visible"
                        AMM.style.opacity = 1
                        WMM = AMM
                        LMMCI = cobj.items.length
                    }
                },
                className: "aButton"
            })
        ]: [])
        if(!(pr !== null && pr.parent === null)){
            x.firstChild.lastChild.appendChild(element("img", [], {
                src: "edit.svg",
                onclick: () => {
                    vbj.collapsed ^= 1
                    crpt = []
                    let x = vbj
                    while(x.parent !== null){
                        crpt.push(x.name)
                        x = x.parent
                    }
                    crpt.push("Home")
                    crpt.reverse()
                    cobj = obj
                    for(let i = 1; i < crpt.length; i++)
                        cobj = cobj.categories[crpt[i]]
                    EC.style.visibility = "visible"
                    EC.style.opacity = 1
                    const t = EC.getElementsByTagName("input")[0]
                    t.value = crpt[crpt.length -1]
                    t.placeholder = crpt[crpt.length -1]
                },
                className: "aButton"
            }))
        }
        const f = () => {
            vbj.collapsed ^= 1
            const CH = (vv) => {
                let sum = 25
                if(vv !== vobj){
                    if(vv.collapsed){
                        vv.element.classList.remove("categexpand")
                        vv.element.firstChild.firstChild.classList.remove("arrowClicked")
                        return sum
                    }
                    vv.element.classList.add("categexpand")
                    vv.element.firstChild.firstChild.classList.add("arrowClicked")
                }
                for(let i in vv.categories){
                    let x = CH(vv.categories[i])
                    vv.categories[i].element.style.maxHeight = `${x}px`
                    sum += x +5
                }
                sum += vv.itemsL*32
                return sum
            }
            CH(vobj)
        }
        x.firstChild.addEventListener("click", f)
        x.firstChild.addEventListener("dblclick", () => {
            let f1 = (vv) => {
                let b = vv.collapsed
                for(let i in vv.categories)
                    b &= f1(vv.categories[i])
                return b
            }
            let f2 = (b, vv) => {
                vv.collapsed = b
                for(let i in vv.categories)
                    f2(b, vv.categories[i])
            }
            vbj.collapsed = true
            f2(!f1(vbj), vbj)
            vbj.collapsed = true
            f()
        })
        return x
    }
    vbj.element = bj === obj? element("div", [], {
        style:{
            backgroundColor: "#ffffff88",
            margin: "30px 30px",
            borderRadius: "20px"
        }
    }): addCateg(nm)
    vbj.parent = pr
    if(vbj.categories === undefined)
        vbj.categories = {}
    for(let i in bj.categories){
        if(vbj.categories[i] === undefined) vbj.categories[i] = {}
        vbj.element.appendChild(makeTree(i, bj.categories[i], vbj.categories[i], vbj, i === "Raw Materials" || raw))
    }
    const addItem = (d) => {
        let c = cost(d)
        const n = element("input", [], {value: parseFloat(c), type: "text", className: "addItemIn", disabled: !raw, onblur: () => {
            if(!raw) return
            crpt = []
            let x = vbj
            while(x.parent !== null){
                crpt.push(x.name)
                x = x.parent
            }
            crpt.push("Home")
            crpt.reverse()
            cobj = obj
            for(let i = 1; i < crpt.length; i++)
                cobj = cobj.categories[crpt[i]]
            for(let i in bj.items){
                if(bj.items[i][0].toLowerCase() == d[0].toLowerCase()){
                    n.value = n.value.trim()
                    if(Number.isNaN(parseFloat(n.value))){
                        n.style.backgroundColor = "red"
                        setTimeout(() => {n.style.backgroundColor = "white"}, 1000)
                        n.value = parseFloat(c)
                    }else{
                        cobj.items.splice(i, 1, [d[0], parseFloat(n.value), c.substring(c.search("/") +1)])
                        fileDo.write(obj)
                        bj.items[i][1] = parseFloat(n.value)
                    }
                }
            }
            FMT(false)
        }})
        let x = element("div", [
            d[0],
            n,
            element("span", [c.substring(c.search("/"))], {style:{position: "absolute", left: "65%"}}),
            element("img", [], {
                src: "edit.svg",
                onclick: () => {
                    crpt = []
                    let x = vbj
                    while(x.parent !== null){
                        crpt.push(x.name)
                        x = x.parent
                    }
                    crpt.push("Home")
                    crpt.reverse()
                    cobj = obj
                    for(let i = 1; i < crpt.length; i++)
                        cobj = cobj.categories[crpt[i]]
                    if(crpt[1][0] == "R"){
                        EM.style.visibility = "visible"
                        EM.style.opacity = 1
                        const x = EM.getElementsByTagName("input")
                        x[0].placeholder = d[0]
                        x[0].value = d[0]
                        x[1].value = parseFloat(d[1])
                        const s = EM.getElementsByTagName("select")[0]
                        s.value = cobj.items.find((v) => v[0] == d[0])[2]
                    }else{
                        EMM.style.visibility = "visible"
                        EMM.style.opacity = 1
                        const tm = cobj.items.find((c) => c[0] == d[0])
                        const n = EMM.getElementsByTagName("input")
                        n[0].placeholder = tm[0]
                        n[0].value = tm[0]
                        n[n.length -1].value = tm[1]
                        const cmnt = EMM.getElementsByTagName("textarea")[0]
                        cmnt.value = tm[4]
                        EMM.getElementsByTagName("select")[0].value = tm[2]
                        const tbl = EMM.getElementsByTagName("table")[0]
                        mTable([["Materials", "Cost", "Amount", "in", "Total", "X"]], () => {}, tbl)
                        for(let i of tm[3]){
                            const n = txtIn()
                            n.style.width = "80%"
                            n.style.textAlign = "center"
                            n.value = i[2]
                            const s = mSelect(["Kg", "g", "L", "mL", "Piece"])
                            s.value = i[3]
                            let x = obj
                            for(let k = 1; k < i[0].length; k++)
                                x = x.categories[i[0][k]]
                            const cst = cost(x.items[i[1]])
                            const p = element("p", [], {})
                            n.onblur = () => {
                                let res = 0
                                const y = parseFloat(cst)
                                const z = parseFloat(n.value)
                                const a = cst.substring(cst.search("/") +1)[0]
                                const b = s.value[0]
                                if(a == 'L' && b == 'm' || a == 'K' && b == 'g')
                                    res += y*z/1000
                                else if(a == 'm' && b == 'L' || a == 'g' && b == 'K')
                                    res += y*z*1000
                                else res += y*z
                                p.innerHTML = Math.round(res/10)*10
                            }
                            n.onblur()
                            const el = element("tr", [
                                element("td", [
                                    x.items[i[1]][0],
                                    element("p", [JSON.stringify(i[0])], {style:{display: "none"}}),
                                    element("p", [i[1]], {style:{display: "none"}})
                                ], {}),
                                element("td", [cst], {}),
                                element("td", [n], {}),
                                element("td", [s], {}),
                                element("td", [p], {}),
                                element("td", [mButton("X", () => {tbl.removeChild(el)})], {})
                            ])
                            tbl.appendChild(el)
                        }
                        WMM = EMM
                        const btns = EMM.getElementsByTagName("button")
                        const nextB = btns[btns.length -1]
                        const previousB = btns[btns.length -5]
                        for(let i = 0; i < cobj.items.length; i++){
                            if(cobj.items[i][0] == d[0]){
                                LMMCI = i
                                if(i === 0) previousB.disabled = true
                                else previousB.disabled = false
                                if(i +1 === cobj.items.length) nextB.disabled = true
                                else nextB.disabled = false
                                break
                            }
                        }
                    }
                },
                className: "aButton",
                style:{position: "absolute", left: "calc(100% - 60px)"}
            })
        ], {className: "categ"})
        return x
    }
    for(let i of bj.items){
        vbj.element.appendChild(addItem(i))
    }
    if(bj === obj){
        categs.replaceChildren(...vbj.element.children)
    }
    return vbj.element
}
function backgroundView(children){
    return element("div", children, {
        className: "backgroundView"
    })
}
function mainCont(children){
    return element("div", children, {
        className: "mainCont"
    })
}
function titleP(s){
    return element("p", [s], {
        className: "titleP"
    })
}
function address(children){
    return element("div", children, {
        className: "address"
    })
}
function categoryAddress(s, i = 1){
    return element("a", [s], {
        className: "categoryAddress",
        onclick: () => {
            crpt = crpt.slice(0, i +1)
            FMT()
        }
    })
}
function mButton(s, f, v = true){
    return element("button", [s], {
        className: "mButton",
        onclick: f,
        disabled: !v
    })
}
function mTable(lst, f, nd = null, v = 0){
    let trs = [], b = false
    for(let i of lst){
        let tds = []
        for(let j = 0; j < i.length -v; j++){
            tds.push(element("td", [i[j]], {}))
        }
        const tr = element("tr", tds, {})
        if(b) tr.addEventListener("click", () => {f(i)})
        b = true
        trs.push(tr)
    }
    if(nd == null){
        return element("table", trs, {
            className: "mTable"
        })
    }else{
        nd.replaceChildren(...trs)
        return nd
    }
}
function floatingWindow(children){
    return element("div", [
        element("div", children, {
            className: "floatingWindow"
        })
    ], {
        className: "floatingWindowBack"
    })
}
function txtIn(pl = "", v = ""){
    return element("input", [], {
        type: "text",
        placeholder: pl,
        className: "txtIn",
        value: v
    })
}
function mPara(s, l = []){
    return element("p", [s].concat(l), {
        className: "mPara"
    })
}
function mSelect(lst){
    return element("select",
        lst.map((c) => element("option", [c], {value: c})), {
        className: "mButton"
    })
}
function dfs(d = null, k = 0, ct = crpt){
    if(d != null && cobj.items.length > 0)
        cobj.items = cobj.items.map((c, i) => [d[k +i][0], d[k +i][1], c[2]])
    let res = cobj.items.map((c, i) => [c[0], parseFloat(cost(c)), c[2], ct, i])
    let x = cobj
    for(let i in cobj.categories){
        cobj = cobj.categories[i]
        res = res.concat(dfs(d, k +res.length, ct.concat([i])))
        cobj = x
    }
    return res
}
function whatDependsOn(m, c = ["Home"], x = null){
    let res = []
    if(c.length == 1){
        c = ["Home", "Semi-finished Materials"]
        res = whatDependsOn(m, c, obj.categories["Semi-finished Materials"])
        c = ["Home", "Finished Meal"]
        return res.concat(whatDependsOn(m, c, obj.categories["Finished Meal"]))
    }
    for(let i in x.items){
        for(let j of x.items[i][3]){
            if(JSON.stringify(m[0]) == JSON.stringify(j[0]) && m[1] == j[1]){
                res.push(c.concat([x.items[i][0]]))
                break
            }
        }
    }
    for(let i in x.categories){
        res = res.concat(whatDependsOn(m, c.concat([i]), x.categories[i]))
    }
    return res
}
function AddMaterial(){
    const MN = txtIn()
    const MC = txtIn()
    const MS = mSelect(["Kg", "g", "L", "mL", "Piece"])
    return floatingWindow([
        titleP("Add Raw Material"),
        mPara("Material Name:"),
        MN,
        mPara("Material Cost: in", [MS]),
        MC,
        mButton("Add", () => {
            MN.value = MN.value.trim()
            MC.value = MC.value.trim()
            let b = true
            if(MN.value == ""){
                MN.style.backgroundColor = "red"
                setTimeout(() =>{
                    MN.style.backgroundColor = "white"
                }, 1000)
                b = false
            }
            if(Number.isNaN(parseFloat(MC.value))){
                MC.style.backgroundColor = "red"
                setTimeout(() =>{
                    MC.style.backgroundColor = "white"
                }, 1000)
                b = false
            }
            for(let i of cobj.items){
                if(i[0].toLowerCase() == MN.value.toLowerCase()){
                    MN.style.backgroundColor = "red"
                    setTimeout(() =>{
                        MN.style.backgroundColor = "white"
                    }, 1000)
                    b = false
                }
            }
            if(b){
                cobj.items.push([MN.value, parseFloat(MC.value), MS.value])
                fileDo.write(obj)
                FMT()
                AM.style.opacity = 0
                setTimeout(() => {
                    AM.style.visibility = "hidden"
                    MN.value = ""
                    MC.value = ""
                    MS.value = "Kg"
                }, 400)
            }
        }),
        mButton("Cancel", () => {
            AM.style.opacity = 0
            setTimeout(() => {
                AM.style.visibility = "hidden"
                MN.value = ""
                MC.value = ""
                MS.value = "Kg"
            }, 400)
        })
    ])
}
function EditMaterial(){
    const MN = txtIn()
    const MC = txtIn()
    const MS = mSelect(["Kg", "g", "L", "mL", "Piece"])
    return floatingWindow([
        titleP("Edit Raw Material"),
        mPara("Material Name:"),
        MN,
        mPara("Material Cost:", [MS]),
        MC,
        mButton("Edit", () => {
            MN.value = MN.value.trim()
            MC.value = MC.value.trim()
            let b = false
            if(Number.isNaN(parseFloat(MC.value))){
                MC.style.backgroundColor = "red"
                setTimeout(() => {MC.style.backgroundColor = "white"}, 1000)
                b = true
            }
            if(MN.value == ""){
                MN.style.backgroundColor = "red"
                setTimeout(() => {MN.style.backgroundColor = "white"}, 1000)
                b = true
            }
            if(MN.value != MN.placeholder){
                for(let i of cobj.items){
                    if(i[0].toLowerCase() == MN.value.toLowerCase()){
                        MN.style.backgroundColor = "red"
                        setTimeout(() =>{
                            MN.style.backgroundColor = "white"
                        }, 1000)
                        b = false
                    }
                }
            }
            if(b) return
            for(let i in cobj.items){
                if(cobj.items[i][0].toLowerCase() == MN.placeholder.toLowerCase()){
                    cobj.items.splice(i, 1, [MN.value, parseFloat(MC.value), MS.value])
                    break;
                }
            }
            fileDo.write(obj)
            FMT()
            EM.style.opacity = 0
            setTimeout(() => {EM.style.visibility = "hidden"}, 400)
        }),
        mButton("Delete", () => {
            for(let i in cobj.items){
                if(cobj.items[i][0].toLowerCase() == MN.placeholder.toLowerCase()){
                    let w = whatDependsOn([crpt, i])
                    if(w.length > 0){
                        msg.style.opacity = 1
                        msg.style.visibility = "visible"
                        msg.getElementsByTagName("p")[1].innerHTML = "It's not possible to delete this item,<br>because the following items depend on it:<br>" +w.map((c) => c.join("/")).join("<br>")
                        return
                    }
                    cobj.items.splice(i, 1)
                    break
                }
            }
            fileDo.write(obj)
            FMT()
            EM.style.opacity = 0
            setTimeout(() => {EM.style.visibility = "hidden"}, 400)
        }),
        mButton("Cancel", () => {
            EM.style.opacity = 0
            setTimeout(() => {EM.style.visibility = "hidden"}, 400)
        })
    ])
}
function cost(d){
    if(d.length == 3) return Math.round(d[1]) +"/" +d[2]
    let res = 0
    for(let i of d[3]){
        let x = obj
        for(let j = 1; j < i[0].length; j++)
            x = x.categories[i[0][j]]
        const y = parseFloat(cost(x.items[i[1]]))
        const z = i[2]
        const a = x.items[i[1]][2][0]
        const b = i[3][0]
        if(a == 'L' && b == 'm' || a == 'K' && b == 'g')
            res += y*z/1000
        else if(a == 'm' && b == 'L' || a == 'g' && b == 'K')
            res += y*z*1000
        else res += y*z
    }
    res /= d[1]
    if(res > 100) res = Math.round(res/100)*100
    return Math.round(res) +"/" +d[2]
}
function noCycle(m, n){
    if(JSON.stringify(m[0]) == JSON.stringify(n[0]) && m[1] == n[1]) return false
    if(n[0][1][0] == "R") return true
    let x = obj
    for(let i = 1; i < n[0].length; i++)
        x = x.categories[n[0][i]]
    for(let i of x.items[n[1]][3])
        if(!noCycle(m, [i[0], i[1]]))
            return false
    return true
}
let LMMID = null, LMMF = () => {}, WMM = null, LMMCI = 0
function ListMM(){
    const tms = mTable([], (d) => {})
    const srh = txtIn("Search")
    let bl = true, cx, t1, t2, Lsrh = "!@#"
    LMMF = () => {
        if(Lsrh == srh.value) return
        Lsrh = srh.value
        if(bl){
            cx = cobj
            let cp = crpt
            cobj = obj.categories["Raw Materials"]
            crpt = ["Home", "Raw Materials"]
            t1 = dfs()
            cobj = obj.categories["Semi-finished Materials"]
            crpt = ["Home", "Semi-finished Materials"]
            t2 = dfs()
            cobj = cx
            crpt = cp
            bl = false
        }
        let lst = []
        srh.value = srh.value.trim()
        for(let i of t1.concat(t2)){
            if((srh.value == "" || i[0].toLowerCase().includes(srh.value.toLowerCase())) &&
                noCycle([crpt, LMMCI], [i[3], i[4]])){
                lst.push([i[0], i[1] +"/" +i[2], JSON.stringify(i[3]), i[4]])
            }
        }
        mTable([["Material/Mix", "Cost", "p", "i"]].concat(lst), (d) => {
            const n = txtIn()
            n.style.width = "80%"
            n.style.textAlign = "center"
            if(WMM == null) WMM = AMM;
            const tbl = WMM.getElementsByTagName("table")[0]
            const s = mSelect(["Kg", "g", "L", "mL", "Piece"])
            const cst = d[1]
            const p = element("p", [], {})
            n.onblur = () => {
                let res = 0
                const y = parseFloat(cst)
                const z = parseFloat(n.value)
                const a = cst.substring(cst.search("/") +1)[0]
                const b = s.value[0]
                if(a == 'L' && b == 'm' || a == 'K' && b == 'g')
                    res += y*z/1000
                else if(a == 'm' && b == 'L' || a == 'g' && b == 'K')
                    res += y*z*1000
                else res += y*z
                p.innerHTML = Math.round(res/10)*10
            }
            n.onblur()
            const el = element("tr", [
                element("td", [
                    d[0],
                    element("p", [JSON.stringify(d[2])], {style:{display: "none"}}),
                    element("p", [d[3]], {style:{display: "none"}})
                ], {}),
                element("td", [d[1]], {}),
                element("td", [n], {}),
                element("td", [s], {}),
                element("td", [p], {}),
                element("td", [mButton("X", () => {tbl.removeChild(el)})], {})
            ])
            tbl.appendChild(el)
        }, tms, 2)
    }
    return floatingWindow([
        titleP("Materials List"),
        srh,
        tms,
        mButton("Cancel", () => {
            LMM.style.opacity = 0
            setTimeout(() => {LMM.style.visibility = "hidden"}, 400)
            clearInterval(LMMID)
            bl = true
            Lsrh = "!@#"
        })
    ])
}
function AddMM(){
    const tbl = mTable([["Materials", "Cost", "Amount", "in", "Total", "X"]], () => {})
    const MMN = txtIn()
    const MS = mSelect(["Kg", "g", "L", "mL", "Piece"])
    const MI = txtIn("", 1)
    MI.style.width = "30px"
    const prnt = element("img", [], {src: "printer.svg", alt: "Print", className: "printer"})
    prnt.addEventListener("click", () => {
        const f = window.frames["mf"]
        let l = [["Material", "Cost", "Amount"]], b = true
        for(let i of tbl.getElementsByTagName("tr")){
            if(b){
                b = false
                continue
            }
            let j = i.getElementsByTagName("td")
            l.push([j[0].innerHTML.slice(0, j[0].innerHTML.search("<p")), j[1].innerHTML, j[2].firstChild.value +" " +j[3].firstChild.value])
        }
        l = l.map((c, i) => element("tr", c.map((c) => element("td", [c], {style:{border: "1px solid gray", padding: "3px 15px", background: (i%2 == 0? "gray": "white")}})), {}))
        f.document.body.replaceChildren(
            element("div", [
                element("h1", ["Item Details"], {style:{textAlign: "center"}}),
                element("p", ["Item Name: ", MMN.value], {}),
                element("p", ["Item Contents:"], {}),
                element("table", l, {style:{textAlign: "center", position: "relative", left: "50%", transform: "translateX(-50%)", borderCollapse: "collapse"}}),
                element("p", ["Comments:"], {}),
                element("p", [cmnt.value], {style:{border: "2px solid gray", borderRadius: "10px", padding: "5px"}})
            ], {})
        )
        f.document.close()
        f.focus()
        f.print()
    })
    const cmnt = element("textarea", [], {className: "txtIn", rows: 3})
    return floatingWindow([
        prnt,
        titleP("Add Item"),
        mPara("Item Name:"),
        MMN,
        mButton("Add Raw / Semi-finished Material", () => {
            LMM.style.opacity = 1
            LMM.style.visibility = "visible"
            LMMID = setInterval(LMMF, 500)
        }),
        tbl,
        mPara("The cost is for ", [MI, MS]),
        mPara("Comments:"),
        cmnt,
        mButton("Add", () => {
            const npts = tbl.getElementsByTagName("input")
            let b = true
            for(let i of npts){
                if(Number.isNaN(parseFloat(i.value))){
                    i.style.backgroundColor = "red"
                    setTimeout(() => {i.style.backgroundColor = "white"}, 1000)
                    b = false
                }
            }
            MMN.value = MMN.value.trim()
            for(let i of cobj.items){
                if(i[0].toLowerCase() == MMN.value.toLowerCase()){
                    b = false
                    MMN.style.backgroundColor = "red"
                    setTimeout(() => {MMN.style.backgroundColor = "white"}, 1000)
                    break
                }
            }
            if(MMN.value == ""){
                b = false
                MMN.style.backgroundColor = "red"
                setTimeout(() => {MMN.style.backgroundColor = "white"}, 1000)
            }
            if(MI.value == "" || Number.isNaN(parseFloat(MI.value))){
                b = false
                MI.style.backgroundColor = "red"
                setTimeout(() => {MI.style.backgroundColor = "white"}, 1000)
            }
            if(b){
                let cntnt = []
                const tds = tbl.getElementsByTagName("td")
                for(let i = 6; i < tds.length; i += 6){
                    let y = tds[i].getElementsByTagName("p")[0].innerHTML
                    while(typeof(y) === "string")
                        y = JSON.parse(y)
                    let x = [
                        y,
                        parseFloat(tds[i].getElementsByTagName("p")[1].innerHTML),
                        parseFloat(npts[i/6 -1].value),
                        tds[i +3].firstChild.value
                    ]
                    cntnt.push(x)
                }
                cobj.items.push([MMN.value, parseFloat(MI.value) , MS.value, cntnt, cmnt.value])
                FMT()
                fileDo.write(obj)
                AMM.style.opacity = 0
                setTimeout(() => {
                    AMM.style.visibility = "hidden"
                    mTable([["Materials", "Cost", "Amount", "in", "Total", "X"]], () => {}, tbl)
                    MMN.value = ""
                    MS.value = "Kg"
                    MI.value = 1
                    cmnt.value = ""
                }, 400)
            }
        }),
        mButton("Cancel", () => {
            AMM.style.opacity = 0
            setTimeout(() => {
                AMM.style.visibility = "hidden"
                mTable([["Materials", "Cost", "Amount", "in", "Total", "X"]], () => {}, tbl)
                MMN.value = ""
                MS.value = "Kg"
                MI.value = 1
                cmnt.value = ""
            }, 400)
        })
    ])
}
function EditMM(){
    const tbl = mTable([["Materials", "Cost", "Amount", "in", "Total", "X"]], () => {})
    const MMN = txtIn()
    const MS = mSelect(["Kg", "g", "L", "mL", "Piece"])
    const MI = txtIn("", 1)
    MI.style.width = "30px"
    const prnt = element("img", [], {src: "printer.svg", alt: "Print", className: "printer"})
    prnt.addEventListener("click", () => {
        const f = window.frames["mf"]
        let l = [["Material", "Cost", "Amount"]], b = true
        for(let i of tbl.getElementsByTagName("tr")){
            if(b){
                b = false
                continue
            }
            let j = i.getElementsByTagName("td")
            l.push([j[0].innerHTML.slice(0, j[0].innerHTML.search("<p")), j[1].innerHTML, j[2].firstChild.value +" " +j[3].firstChild.value])
        }
        l = l.map((c, i) => element("tr", c.map((c) => element("td", [c], {style:{border: "1px solid gray", padding: "3px 15px", background: (i%2 == 0? "gray": "white")}})), {}))
        f.document.body.replaceChildren(
            element("div", [
                element("h1", ["Item Details"], {style:{textAlign: "center"}}),
                element("p", ["Item Name: ", MMN.value], {}),
                element("p", ["Item Contents:"], {}),
                element("table", l, {style:{textAlign: "center", position: "relative", left: "50%", transform: "translateX(-50%)", borderCollapse: "collapse"}}),
                element("p", ["Comments:"], {}),
                element("p", [cmnt.value], {style:{border: "2px solid gray", borderRadius: "10px", padding: "5px"}})
            ], {})
        )
        f.document.close()
        f.focus()
        f.print()
    })
    const cmnt = element("textarea", [], {className: "txtIn", rows: 3})
    const editFct = () => {
        try{
        const npts = tbl.getElementsByTagName("input")
        let b = true
        for(let i of npts){
            if(Number.isNaN(parseFloat(i.value))){
                i.style.backgroundColor = "red"
                setTimeout(() => {i.style.backgroundColor = "white"}, 1000)
                b = false
            }
        }
        MMN.value = MMN.value.trim()
        if(MMN.value != MMN.placeholder){
            for(let i of cobj.items){
                if(i[0].toLowerCase() == MMN.value.toLowerCase()){
                    b = false
                    MMN.style.backgroundColor = "red"
                    setTimeout(() => {MMN.style.backgroundColor = "white"}, 1000)
                    break
                }
            }
        }
        if(MMN.value == ""){
            b = false
            MMN.style.backgroundColor = "red"
            setTimeout(() => {MMN.style.backgroundColor = "white"}, 1000)
        }
        if(MI.value == "" || Number.isNaN(parseFloat(MI.value))){
            b = false
            MI.style.backgroundColor = "red"
            setTimeout(() => {MI.style.backgroundColor = "white"}, 1000)
        }
        if(b){
            let cntnt = []
            const tds = tbl.getElementsByTagName("td")
            for(let i = 6; i < tds.length; i += 6){
                let y = tds[i].getElementsByTagName("p")[0].innerHTML
                while(typeof(y) === "string")
                    y = JSON.parse(y)
                let x = [
                    y,
                    parseFloat(tds[i].getElementsByTagName("p")[1].innerHTML),
                    parseFloat(npts[i/6 -1].value),
                    tds[i +3].firstChild.value
                ]
                cntnt.push(x)
            }
            for(let i in cobj.items){
                if(cobj.items[i][0].toLowerCase() == MMN.placeholder.toLowerCase()){
                    cobj.items.splice(i, 1, [MMN.value, parseFloat(MI.value), MS.value, cntnt, cmnt.value])
                    break
                }
            }
            FMT()
            fileDo.write(obj)
        }
        return b
        }catch(e){alert(e)}
    }
    const previousB = mButton("Previous", () => {
        if(!editFct()) return
        let tm = cobj.items.find((c) => c[0] == MMN.value)
        for(let i = 1; i < cobj.items.length; i++)
            if(cobj.items[i][0] == tm[0])
                tm = cobj.items[i -1]
        const n = EMM.getElementsByTagName("input")
        n[0].placeholder = tm[0]
        n[0].value = tm[0]
        n[n.length -1].value = tm[1]
        const cmnt = EMM.getElementsByTagName("textarea")[0]
        cmnt.value = tm[4]
        EMM.getElementsByTagName("select")[0].value = tm[2]
        const tbl = EMM.getElementsByTagName("table")[0]
        mTable([["Materials", "Cost", "Amount", "in", "Total", "X"]], () => {}, tbl)
        for(let i of tm[3]){
            const n = txtIn()
            n.style.width = "80%"
            n.style.textAlign = "center"
            n.value = i[2]
            const s = mSelect(["Kg", "g", "L", "mL", "Piece"])
            s.value = i[3]
            let x = obj
            for(let k = 1; k < i[0].length; k++)
                x = x.categories[i[0][k]]
            const cst = cost(x.items[i[1]])
            const p = element("p", [], {})
            n.onblur = () => {
                let res = 0
                const y = parseFloat(cst)
                const z = parseFloat(n.value)
                const a = cst.substring(cst.search("/") +1)[0]
                const b = s.value[0]
                if(a == 'L' && b == 'm' || a == 'K' && b == 'g')
                    res += y*z/1000
                else if(a == 'm' && b == 'L' || a == 'g' && b == 'K')
                    res += y*z*1000
                else res += y*z
                p.innerHTML = Math.round(res/10)*10
            }
            n.onblur()
            const el = element("tr", [
                element("td", [
                    x.items[i[1]][0],
                    element("p", [JSON.stringify(i[0])], {style:{display: "none"}}),
                    element("p", [i[1]], {style:{display: "none"}})
                ], {}),
                element("td", [cst], {}),
                element("td", [n], {}),
                element("td", [s], {}),
                element("td", [p], {}),
                element("td", [mButton("X", () => {tbl.removeChild(el)})], {})
            ])
            tbl.appendChild(el)
        }
        WMM = EMM
        const btns = EMM.getElementsByTagName("button")
        const nextB = btns[btns.length -1]
        const previousB = btns[btns.length -5]
        for(let i = 0; i < cobj.items.length; i++){
            if(cobj.items[i][0] == tm[0]){
                LMMCI = i
                if(i === 0) previousB.disabled = true
                else previousB.disabled = false
                if(i +1 === cobj.items.length) nextB.disabled = true
                else nextB.disabled = false
                break
            }
        }
    })
    const nextB = mButton("Next", () => {
        if(!editFct()) return
        let tm = cobj.items.find((c) => c[0] == MMN.value)
        for(let i = 0; i +1 < cobj.items.length; i++)
            if(cobj.items[i][0] == tm[0])
                tm = cobj.items[i +1]
        const n = EMM.getElementsByTagName("input")
        n[0].placeholder = tm[0]
        n[0].value = tm[0]
        n[n.length -1].value = tm[1]
        const cmnt = EMM.getElementsByTagName("textarea")[0]
        cmnt.value = tm[4]
        EMM.getElementsByTagName("select")[0].value = tm[2]
        const tbl = EMM.getElementsByTagName("table")[0]
        mTable([["Materials", "Cost", "Amount", "in", "Total", "X"]], () => {}, tbl)
        for(let i of tm[3]){
            const n = txtIn()
            n.style.width = "80%"
            n.style.textAlign = "center"
            n.value = i[2]
            const s = mSelect(["Kg", "g", "L", "mL", "Piece"])
            s.value = i[3]
            let x = obj
            for(let k = 1; k < i[0].length; k++)
                x = x.categories[i[0][k]]
            const cst = cost(x.items[i[1]])
            const p = element("p", [], {})
            n.onblur = () => {
                let res = 0
                const y = parseFloat(cst)
                const z = parseFloat(n.value)
                const a = cst.substring(cst.search("/") +1)[0]
                const b = s.value[0]
                if(a == 'L' && b == 'm' || a == 'K' && b == 'g')
                    res += y*z/1000
                else if(a == 'm' && b == 'L' || a == 'g' && b == 'K')
                    res += y*z*1000
                else res += y*z
                p.innerHTML = Math.round(res/10)*10
            }
            n.onblur()
            const el = element("tr", [
                element("td", [
                    x.items[i[1]][0],
                    element("p", [JSON.stringify(i[0])], {style:{display: "none"}}),
                    element("p", [i[1]], {style:{display: "none"}})
                ], {}),
                element("td", [cst], {}),
                element("td", [n], {}),
                element("td", [s], {}),
                element("td", [p], {}),
                element("td", [mButton("X", () => {tbl.removeChild(el)})], {})
            ])
            tbl.appendChild(el)
        }
        WMM = EMM
        const btns = EMM.getElementsByTagName("button")
        const nextB = btns[btns.length -1]
        const previousB = btns[btns.length -5]
        for(let i = 0; i < cobj.items.length; i++){
            if(cobj.items[i][0] == tm[0]){
                LMMCI = i
                if(i === 0) previousB.disabled = true
                else previousB.disabled = false
                if(i +1 === cobj.items.length) nextB.disabled = true
                else nextB.disabled = false
                break
            }
        }
    })
    return floatingWindow([
        prnt,
        titleP("Edit Item"),
        mPara("Item Name:"),
        MMN,
        mButton("Add Raw / Semi-finished Material", () => {
            LMM.style.opacity = 1
            LMM.style.visibility = "visible"
            LMMID = setInterval(LMMF, 500)
        }),
        tbl,
        mPara("The cost is for ", [MI, MS]),
        mPara("Comment:"),
        cmnt,
        previousB,
        mButton("Edit", () => {
            if(editFct()){
                EMM.style.opacity = 0
                setTimeout(() => {
                    EMM.style.visibility = "hidden"
                    mTable([["Materials", "Cost", "Amount", "in", "Total", "X"]], () => {}, tbl)
                    MMN.value = ""
                    MS.value = "Kg"
                }, 400)
            }
        }),
        mButton("Delete", () => {
            for(let i in cobj.items){
                if(cobj.items[i][0].toLowerCase() == MMN.placeholder.toLowerCase()){
                    let w = whatDependsOn([crpt, i])
                    if(w.length > 0){
                        msg.style.opacity = 1
                        msg.style.visibility = "visible"
                        msg.getElementsByTagName("p")[1].innerHTML = "It's not possible to delete this item,<br>because the following items depend on it:<br>" +w.map((c) => c.join("/")).join("<br>")
                        return
                    }
                    cobj.items.splice(i, 1)
                    break
                }
            }
            fileDo.write(obj)
            FMT()
            EMM.style.opacity = 0
            setTimeout(() => {
                EMM.style.visibility = "hidden"
                mTable([["Materials", "Cost", "Amount", "in", "Total", "X"]], () => {}, tbl)
                MMN.value = ""
                MS.value = "Kg"
            }, 400)
        }),
        mButton("Cancel", () => {
            EMM.style.opacity = 0
            setTimeout(() => {
                EMM.style.visibility = "hidden"
                mTable([["Materials", "Cost", "Amount", "in", "Total", "X"]], () => {}, tbl)
                MMN.value = ""
                MS.value = "Kg"
            }, 400)
        }),
        nextB
    ])
}
function AddCat(){
    const n = txtIn()
    return floatingWindow([
        titleP("Add Category"),
        mPara("Category Name:"),
        n,
        mButton("Add", () => {
            let b = true
            for(let i in cobj.categories){
                if(i.toLowerCase() == n.value.toLowerCase()){
                    b = false
                    break
                }
            }
            if(n.value.includes("/")) b = false
            if(!b || n.value == ""){
                n.style.backgroundColor = "red"
                setTimeout(() => {n.style.backgroundColor = "#00000000"}, 1000)
                b = false
            }else{
                cobj.categories[n.value] = {categories: {}, items: []}
                fileDo.write(obj)
                FMT()
                AC.style.opacity = 0
                setTimeout(() => {
                    AC.style.visibility = "hidden"
                    n.value = ""
                }, 400)
            }
        }),
        mButton("Cancel", () => {   
            AC.style.opacity = 0
            setTimeout(() => {
                AC.style.visibility = "hidden"
                n.value = ""
            }, 400)
        })
    ])
}
function EditCat(){
    const t = txtIn()
    return floatingWindow([
        titleP("Edit Category"),
        mPara("Category Name:"),
        t,
        mButton("Edit", () => {
            try{
            let cr = crpt[crpt.length -1]
            cobj = obj
            for(let i = 1; i +1 < crpt.length; i++)
                cobj = cobj.categories[crpt[i]]
            let lt = cobj.categories
            cobj = cobj.categories[cr]
            let b = true
            for(let i in lt){
                if(i.toLowerCase() == t.value.toLowerCase() && t.value != t.placeholder){
                    b = false
                    break
                }
            }
            if(t.value.includes("/")) b = false
            if(!b || t.value == ""){
                t.style.backgroundColor = "red"
                setTimeout(() => {t.style.backgroundColor = "#00000000"}, 1000)
            }else{
                const dfsCat = () => {
                    for(let i in cobj.items){
                        let w = whatDependsOn([crpt, i])
                        if(w.length > 0){
                            for(let j = 0; j < w.length; j++){
                                let x = obj
                                for(let k = 1; k +1 < w[j].length; k++){
                                    x = x.categories[w[j][k]]
                                }
                                for(let k in x.items){
                                    if(x.items[k][0] == w[j][w[j].length -1]){
                                        for(let dep in x.items[k][3]){
                                            for(let ii in mcrpt){
                                                if(ii >= x.items[k][3][dep].length) break
                                                if(mcrpt[ii] != x.items[k][3][dep][0][ii]) break
                                                if(ii == mcrpt.length -1){
                                                    x.items[k][3][dep][0][ii] = t.value
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    for(let i in cobj.categories){
                        let x = cobj
                        cobj = cobj.categories[i]
                        crpt.push(i)
                        let b = dfsCat()
                        crpt.pop()
                        cobj = x
                        if(!b) return false
                    }
                }
                let mcrpt = crpt.map((c) => c)
                dfsCat()
                crpt.pop()
                cobj = obj
                for(let i = 1; i < crpt.length; i++)
                    cobj = cobj.categories[crpt[i]]
                cobj.categories[t.value] = cobj.categories[cr]
                delete cobj.categories[cr]
                crpt.push(t.value)
                fileDo.write(obj)
                FMT()
                EC.style.opacity = 0
                setTimeout(() => {EC.style.visibility = "hidden"}, 400)
            }
            }catch(e){alert(e)}
        }),
        mButton("Delete", () => {
            const dfsCat = () => {
                for(let i in cobj.items){
                    let w = whatDependsOn([crpt, i])
                    if(w.length > 0){
                        msg.style.opacity = 1
                        msg.style.visibility = "visible"
                        msg.getElementsByTagName("p")[1].innerHTML = "It's not possible to delete this item,<br>because the following items depend on it:<br>" +w.map((c) => c.join("/")).join("<br>")
                        return false
                    }
                }
                for(let i in cobj.categories){
                    let x = cobj
                    cobj = cobj.categories[i]
                    crpt.push(i)
                    if(!dfsCat()) return false
                    crpt.pop()
                    cobj = x
                }
                return true
            }
            if(!dfsCat()) return
            let cr = crpt.pop()
            cobj = obj
            for(let i = 1; i < crpt.length; i++)
                cobj = cobj.categories[crpt[i]]
            delete cobj.categories[cr]
            fileDo.write(obj)
            FMT()
            EC.style.opacity = 0
            setTimeout(() => {EC.style.visibility = "hidden"}, 400)
        }),
        mButton("Cancel", () => {
            EC.style.opacity = 0
            setTimeout(() => {EC.style.visibility = "hidden"}, 400)
        })
    ])
}
function EditAll(){
    const t = mTable([["Material", "Cost"]], () => {})
    return floatingWindow([
        titleP("All Items"),
        t,
        mButton("Edit", () => {
            let l = [], b = true
            for(let i of t.getElementsByTagName("tr")){
                if(b){
                    b = false
                    continue
                }
                let ll = []
                for(let j of i.getElementsByTagName("td")){
                    ll.push(j.firstChild.value)
                }
                l.push(ll)
            }
            dfs(l)
            fileDo.write(obj)
            FMT()
            EL.style.opacity = 0
            setTimeout(() => {EL.style.visibility = "hidden"}, 400)
        }),
        mButton("Cancel", () => {
            EL.style.opacity = 0
            setTimeout(() => {EL.style.visibility = "hidden"}, 400)
        })
    ])
}
function FMT(an = true){
    const CH = (vv) => {
        let sum = 25
        if(vv !== vobj){
            if(vv.collapsed){
                vv.element.classList.remove("categexpand")
                vv.element.firstChild.firstChild.classList.remove("arrowClicked")
                return sum
            }
            vv.element.classList.add("categexpand")
            vv.element.firstChild.firstChild.classList.add("arrowClicked")
        }
        for(let i in vv.categories){
            let x = CH(vv.categories[i])
            vv.categories[i].element.style.maxHeight = `${x}px`
            sum += x +5
        }
        sum += vv.itemsL*32
        return sum
    }
    makeTree("", obj, vobj)
    CH(vobj)
    if(an){
        categs.classList.toggle("mainContAn")
        setTimeout(() => {categs.classList.toggle("mainContAn")}, 500)
    }
}

let crpt = ["Home"]
let cobj = obj


const AM = AddMaterial()
const EM = EditMaterial()
const AMM = AddMM()
const EMM = EditMM()
const LMM = ListMM()
const AC = AddCat()
const EC = EditCat()
const EL = EditAll()
const msg = floatingWindow([
    titleP("Message"),
    mPara(""),
    mButton("Ok", () => {
        msg.style.opacity = 0
        setTimeout(() => {msg.style.visibility = "hidden"}, 400)
    })
])
const frm = element("iframe", [], {id: "mf", name: "mf", style:{display: "none"}})
const categs = element("div", [], {
    style:{
        backgroundColor: "#ffffff88",
        margin: "30px 30px",
        borderRadius: "20px"
    }
})
FMT()
root.className = 'backgroundView'
root.replaceChildren(categs, AM, EM, AMM, EMM, LMM, AC, EC, EL, frm, msg)
}catch(e){alert(e)}