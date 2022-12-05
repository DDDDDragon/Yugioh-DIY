const initSqlJs = require('sql.js')
const fs = require('fs')
const path = require('path')
const Cropper = require('cropperjs')

var myFontList = new Array()
var cardList = new Array()
var raceList = new Array()

window.onload = function(){
    var input = document.createElement("input")
    input.type = "file"
    input.id = "ttfInput"
    input.accept = ".ttf"
    initRace()
    initCDB()
    initTTF()
    initConfig()
    var button = document.getElementsByClassName("el-button")[10]
    var par = button.parentNode
    var parr = par.parentNode
    parr.removeChild(par)
    var div = document.createElement("div")
    div.id = "imgInputDiv"
    div.classList.add("mato-div")
    parr.appendChild(div)
    var input = document.createElement("input")
    input.addEventListener("change", (event) => {
        const files = event.target.files
        var path = files[0].path
        var cropper = document.getElementById("cropper")
        //cropper.src = path
        createMask()
    })
    input.id = "picInput"
    input.style.display = "none"
    input.type = "file"
    input.accept = "image/*"
    div.appendChild(input)
    var buttonRepl = document.createElement("button")
    buttonRepl.classList.add("mato-button")
    var span = document.createElement("span")
    span.innerHTML = "选择图片"
    buttonRepl.appendChild(span)
    buttonRepl.addEventListener("click", () => {
        var input = document.getElementById("picInput")
        input.click()
    })
    div.appendChild(buttonRepl)

    /*var app = document.getElementById("app")
    var image = document.createElement("img")
    image.id = "cropper"
    image.src = "icon.png"
    app.appendChild(image)
    var cropper = new Cropper(image, {
        viewMode: 1,
        aspectRadio: 1 / 1
    })*/
}

function createMask()
{
    if(document.getElementById("mask")) return true
    var mask = document.createElement("div")
    mask.id = "mask"
    mask.classList.add("mask")
    document.body.appendChild(mask)
    document.documentElement.classList.add("htmlMask")
    mask.addEventListener("click", deleteMask)
}

function deleteMask()
{
    var mask = document.getElementById("mask")
    if(mask)
    {
        mask.removeEventListener("click", deleteMask)
        mask.parentNode.removeChild(mask)
        document.documentElement.classList.remove("htmlMask")
    }
}

function initRace()
{
    raceList.push("战士", "魔法师", "天使", "恶魔", "不死", "机械", "水", "炎", "岩石", "鸟兽", "植物", "昆虫", "雷", "龙", "兽", "兽战士", "恐龙", "鱼", "海龙", "爬虫类", "念动力", "幻神兽", "创造神", "幻龙", "电子界")
}

async function initConfig(type)
{
    if(type == "monster")
    {
        var nameInput = document.getElementsByClassName("el-input__inner")[1]
        nameInput.id = "nameInput"

        var attribute = document.getElementsByClassName("el-radio-group")[1]
        attribute.id = "attribute"

        var level = document.getElementsByClassName("el-input__inner")[3]
        level.id = "level"

        var race = document.getElementsByClassName("el-input__inner")[4]
        race.id = "race"

        var atk = document.getElementsByClassName("el-input__inner")[5]
        atk.id = "atk"

        var def = document.getElementsByClassName("el-input__inner")[6]
        def.id = "def"

        var desc = document.getElementsByClassName("el-textarea__inner")[0]
        desc.id = "desc"

        var id = document.getElementsByClassName("el-input__inner")[8]
        id.id = "id"

        var scrolls = document.getElementsByClassName("el-select-dropdown__list")
        var typeScroll
        for(var i of scrolls)
        {
            if(i.childElementCount == 9) typeScroll = i
        }
        typeScroll.id = "typeScroll"
    }
    if(type == "spell")
    {
        var nameInput = document.getElementsByClassName("el-input__inner")[1]
        nameInput.id = "nameInput"

        var iconScroll = document.getElementsByClassName("el-select-dropdown__list")[3]
        iconScroll.id = "iconScroll"

        var id = document.getElementsByClassName("el-input__inner")[4]
        id.id = "id"

        var desc = document.getElementsByClassName("el-textarea__inner")[0]
        desc.id = "desc"
    }
    if(type == "trap")
    {
        var nameInput = document.getElementsByClassName("el-input__inner")[1]
        nameInput.id = "nameInput"

        var iconScroll = document.getElementsByClassName("el-select-dropdown__list")[3]
        iconScroll.id = "iconScroll"

        var id = document.getElementsByClassName("el-input__inner")[4]
        id.id = "id"

        var desc = document.getElementsByClassName("el-textarea__inner")[0]
        desc.id = "desc"
    }
    if(type == "bai")
    {
        var nameInput = document.getElementsByClassName("el-input__inner")[1]
        nameInput.id = "nameInput"

        var attribute = document.getElementsByClassName("el-radio-group")[1]
        attribute.id = "attribute"

        var level = document.getElementsByClassName("el-input__inner")[3]
        level.id = "level"

        var scale = document.getElementsByClassName("el-input__inner")[4]
        scale.id = "scale"

        var race = document.getElementsByClassName("el-input__inner")[5]
        race.id = "race"

        var atk = document.getElementsByClassName("el-input__inner")[6]
        atk.id = "atk"

        var def = document.getElementsByClassName("el-input__inner")[7]
        def.id = "def"

        var baiDesc = document.getElementsByClassName("el-textarea__inner")[0]
        baiDesc.id = "baiDesc"

        var desc = document.getElementsByClassName("el-textarea__inner")[1]
        desc.id = "desc"

        var id = document.getElementsByClassName("el-input__inner")[9]
        id.id = "id"

        var scrolls = document.getElementsByClassName("el-select-dropdown__list")
        var typeScroll
        for(var i of scrolls)
        {
            if(i.childElementCount == 8) typeScroll = i
        }
        typeScroll.id = "typeScroll"
    }
}
class Card {
    name
    type
    attribute
    level
    race
    atk
    def
    desc
    id
}

async function initCDB() 
{
    const SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
    })
    var ydk = document.getElementsByClassName("page-ydk")[0]
    var scrollbar = ydk.children[0].children[0]
    scrollbar.id = "CDBBar"

    var input = document.createElement("input")
    input.type = "file"
    input.id = "cdbInput"
    input.accept = ".cdb"
    input.addEventListener("change", (event) => {
        const files = event.target.files
        var cdb = files[0]
        var reader = new FileReader()
        reader.onload = function()
        {
            var uints = new Uint8Array(reader.result)
            var db = new SQL.Database(uints)
            var datas = db.exec("SELECT * FROM 'datas'")
            var names = db.exec("SELECT * FROM 'texts'")
            cardList = new Array()
            var buttons = document.getElementById("buttons")
            buttons.innerHTML = ""
            for(var data of datas[0].values)
            {
                var card = new Card()
                card.id = data[0]                
                card.type = data[4]
                card.atk = data[5]
                card.def = data[6]
                card.level = data[7]
                card.race = data[8]
                card.attribute = data[9]
                card.name = names[0].values.find(name => name[0] == card.id)[1]
                card.desc = names[0].values.find(name => name[0] == card.id)[2]
                cardList.push(card)
                var button = document.createElement("button")
                button.innerText = card.name
                button.id = card.id
                button.addEventListener("click", async (event) => {
                    var card = cardList.find(card => card.id == event.target.id)

                    var type = parseInt(card.type).toString(2)
                    while(type.length < 27)
                    {
                        type = "0" + type
                    }
                    var ct = document.getElementsByClassName("el-radio-group")[0]
                    if(type[26] == 1 && type[2] != 1) 
                    {
                        await ct.children[0].children[0].dispatchEvent(new Event("change"))
                        await initConfig("monster")
                        var level = document.getElementById("level")
                        level.value = card.level
                        level.dispatchEvent(new Event("change"))
                        
                        var atk = document.getElementById("atk")
                        atk.value = card.atk
                        atk.dispatchEvent(new Event("change"))
                        
                        var def = document.getElementById("def")
                        def.value = card.def
                        def.dispatchEvent(new Event("change"))
                        
                        var attribute = document.getElementById("attribute")
                        if(card.attribute == 1) attribute.children[2].children[0].dispatchEvent(new Event("change"))
                        if(card.attribute == 2) attribute.children[3].children[0].dispatchEvent(new Event("change"))
                        if(card.attribute == 4) attribute.children[4].children[0].dispatchEvent(new Event("change"))
                        if(card.attribute == 8) attribute.children[5].children[0].dispatchEvent(new Event("change"))
                        if(card.attribute == 16) attribute.children[1].children[0].dispatchEvent(new Event("change"))
                        if(card.attribute == 32) attribute.children[0].children[0].dispatchEvent(new Event("change"))
                        if(card.attribute == 64) attribute.children[6].children[0].dispatchEvent(new Event("change"))

                        var race = document.getElementById("race")
                        var raceText = raceList[Math.log2(card.race)] + "族"
                        if(type[22] == 1) raceText += "/通常"
                        if(type[21] == 1) raceText += "/效果"
                        if(type[19] == 1) raceText += "/仪式"
                        if(type[20] == 1) raceText += "/融合"
                        if(type[14] == 1) raceText += "/调整"
                        if(type[13] == 1) raceText += "/同调"
                        if(type[3] == 1) raceText += "/超量"
                        if(type[0] == 1) raceText += "/连接"
                        if(type[12] == 1) raceText += "/衍生物"
                        race.value = raceText
                        race.dispatchEvent(new Event("input"))

                        var scroll = document.getElementById("typeScroll")
                        if(type[22] == 1) scroll.children[0].click()
                        if(type[21] == 1) scroll.children[1].click()
                        if(type[19] == 1) scroll.children[2].click()
                        if(type[20] == 1) scroll.children[3].click()
                        if(type[13] == 1) scroll.children[4].click()
                        if(type[3] == 1) scroll.children[6].click()
                        if(type[0] == 1) scroll.children[7].click()
                        if(type[12] == 1) scroll.children[8].click()
                    }
                    if(type[25] == 1) 
                    {
                        await ct.children[1].children[0].dispatchEvent(new Event("change"))
                        await initConfig("spell")

                        var icon = document.getElementById("iconScroll")
                        if(type[8] == 1) icon.children[0].click()
                        if(type[7] == 1) icon.children[1].click()
                        if(type[10] == 1) icon.children[2].click()
                        if(type[19] == 1) icon.children[3].click()
                        if(type[6] == 1) icon.children[4].click()
                        if(type[9] == 1) icon.children[5].click()
                    }
                    if(type[24] == 1)
                    {
                        await ct.children[2].children[0].dispatchEvent(new Event("change"))
                        await initConfig("trap")

                        var icon = document.getElementById("iconScroll")
                        if(type[8] == 1) icon.children[0].click()
                        if(type[7] == 1) icon.children[1].click()
                        if(type[10] == 1) icon.children[2].click()
                        if(type[19] == 1) icon.children[3].click()
                        if(type[6] == 1) icon.children[4].click()
                        if(type[9] == 1) icon.children[5].click()
                    }
                    if(type[2] == 1) 
                    {
                        await ct.children[3].children[0].dispatchEvent(new Event("change"))
                        await initConfig("bai")

                        var level = document.getElementById("level")
                        level.value = card.level
                        level.dispatchEvent(new Event("change"))
                        
                        var atk = document.getElementById("atk")
                        atk.value = card.atk
                        atk.dispatchEvent(new Event("change"))
                        
                        var def = document.getElementById("def")
                        def.value = card.def
                        def.dispatchEvent(new Event("change"))
                        
                        var attribute = document.getElementById("attribute")
                        if(card.attribute == 1) attribute.children[2].children[0].dispatchEvent(new Event("change"))
                        if(card.attribute == 2) attribute.children[3].children[0].dispatchEvent(new Event("change"))
                        if(card.attribute == 4) attribute.children[4].children[0].dispatchEvent(new Event("change"))
                        if(card.attribute == 8) attribute.children[5].children[0].dispatchEvent(new Event("change"))
                        if(card.attribute == 16) attribute.children[1].children[0].dispatchEvent(new Event("change"))
                        if(card.attribute == 32) attribute.children[0].children[0].dispatchEvent(new Event("change"))
                        if(card.attribute == 64) attribute.children[6].children[0].dispatchEvent(new Event("change"))

                        var race = document.getElementById("race")
                        var raceText = raceList[Math.log2(card.race)] + "族"
                        if(type[22] == 1) raceText += "/通常"
                        if(type[21] == 1) raceText += "/效果"
                        if(type[19] == 1) raceText += "/仪式"
                        if(type[20] == 1) raceText += "/融合"
                        if(type[14] == 1) raceText += "/调整"
                        if(type[13] == 1) raceText += "/同调"
                        if(type[3] == 1) raceText += "/超量"
                        if(type[0] == 1) raceText += "/连接"
                        if(type[12] == 1) raceText += "/衍生物"
                        race.value = raceText
                        race.dispatchEvent(new Event("input"))

                        var scroll = document.getElementById("typeScroll")
                        if(type[22] == 1) scroll.children[0].click()
                        if(type[21] == 1) scroll.children[1].click()
                        if(type[19] == 1) scroll.children[2].click()
                        if(type[20] == 1) scroll.children[3].click()
                        if(type[13] == 1) scroll.children[4].click()
                        if(type[3] == 1) scroll.children[6].click()
                        if(type[0] == 1) scroll.children[7].click()
                        if(type[12] == 1) scroll.children[8].click()
                    }
                    var name = document.getElementById("nameInput")
                    name.value = card.name
                    name.dispatchEvent(new Event("input"))

                    var id = document.getElementById("id")
                    id.value = card.id
                    id.dispatchEvent(new Event("input"))

                    var desc = document.getElementById("desc")
                    if(type[2] == 1) 
                    {
                        var baiDesc = document.getElementById("baiDesc")
                        baiDesc.value = card.desc.split("【怪兽效果】")[0]
                        baiDesc.dispatchEvent(new Event("input"))
                        desc.value = card.desc.split("【怪兽效果】")[1]
                    }
                    else desc.value = card.desc
                    desc.dispatchEvent(new Event("input"))
                })
                buttons.appendChild(button)
            }
        }
        reader.readAsArrayBuffer(cdb)
    })
    input.style.display = "none"
    scrollbar.appendChild(input)

    var cdb = document.createElement("div")
    cdb.classList.add("el-scrollbar__view", "matoView")
    cdb.style.height = "108.4px"

    var form_c = document.createElement("div")
    form_c.classList.add("form-cdb")

    var el_form = document.createElement("form")
    el_form.classList.add("el-form")
    var form_item1 = document.createElement("div")
    form_item1.classList.add("el-form-item", "el-form-item--small")

    var label_wrap = document.createElement("div")
    label_wrap.classList.add("el-form-item__label-wrap")
    var label = document.createElement("label")
    label.classList.add("el-form-item__label")
    label.style.width = "auto"
    label.innerText = "CDB"
    label_wrap.appendChild(label)
    form_item1.appendChild(label_wrap)

    var item_content = document.createElement("div")
    item_content.style.marginLeft = "41px"
    item_content.classList.add("el-form-item__content")
    var el_row = document.createElement("div")
    el_row.classList.add("el-row")
    el_row.style.marginLeft = "-5px"
    el_row.style.marginRight = "-5px"
    var el_col = document.createElement("div")
    el_col.classList.add("el-col", "el-col-8", "is-guttered")
    el_col.style.paddingLeft = "5px"
    el_col.style.paddingRight = "5px"
    var div = document.createElement("div")
    var upload = document.createElement("div")
    upload.classList.add("el-upload", "el-upload--text")
    upload.tabIndex = 0
    upload.addEventListener("click", (event) => {
        input.click()
    })
    var button = document.createElement("button")
    button.classList.add("el-button", "el-button--success", "el-button--small")
    button.type = "button"
    var span = document.createElement("span")
    span.innerText = "导入 CDB"
    button.append(span)
    upload.appendChild(button)
    div.appendChild(upload)
    el_col.appendChild(div)
    el_row.appendChild(el_col)
    item_content.appendChild(el_row)
    form_item1.appendChild(item_content)

    el_form.appendChild(form_item1)
    form_c.appendChild(el_form)

    cdb.appendChild(form_c)
    scrollbar.appendChild(document.createElement("hr"))
    scrollbar.appendChild(cdb)

    var buttons = document.createElement("div")
    buttons.id = "buttons"
    scrollbar.appendChild(buttons)
}

function initTTF()
{
    var page_form = document.getElementsByClassName("page-form")[0]
    var input = document.createElement("input")
    input.type = "file"
    input.id = "ttfInput"
    input.accept = ".ttf"
    input.addEventListener("change", (event) => {
        const files = event.target.files
        var name = files[0].name.replace(".ttf","")
        uploadFont(name, files[0].path.replace(/\\/g, "/"))
    })
    input.style.display = "none"
    page_form.appendChild(input)

    var row = page_form.children[0].children[0].children[0].children[0].children[0].children[0].children[1].children[0]
    var div = document.createElement("div")
    div.classList.add("el-col", "el-col-4", "is-guttered")
    div.style.paddingLeft = "5px"
    div.style.paddingRight = "5px"
    div.onclick = function(){
        var input = document.getElementById("ttfInput")
        input.click()
    }
    var button = document.createElement("button")
    button.classList.add("el-button", "el-button--primary", "el-button--small")
    button.type = "button"
    var span = document.createElement("span")
    span.innerText = "字体"
    button.appendChild(span)
    div.appendChild(button)
    var child = row.children[3]
    row.insertBefore(div, child)

    var style = document.createElement("style")
    style.type = "text/css"
    style.rel = "stylesheet"
    style.id = "MyStyle"
    document.head.appendChild(style)

    var fonts = fs.readdirSync(__dirname + "/MyFonts")
    for(let i of fonts)
    {
        var fontFamily = i.split(".ttf")[0]
        console.log(path.join(__dirname, "MyFonts", i))
        let code = `@font-face 
        {
          font-family: ${fontFamily};
          src: url(${"./MyFonts/" + i});
          font-display: swap;
        }`
        var style = document.getElementById("MyStyle")
        if(!myFontList.includes(fontFamily)) 
        {
            style.appendChild(document.createTextNode(code))
            myFontList.push(fontFamily)
            addFont(fontFamily, true)
        }
    }
}

function uploadFont(fontFamily, fontUrl)
{
    fs.copyFileSync(fontUrl, __dirname + "/MyFonts/" + fontFamily + ".ttf")
    let code = `@font-face 
    {
      font-family: ${fontFamily};
      src: url(${"./MyFonts/" + fontFamily + ".ttf"});
      font-display: swap;
    }`
    var style = document.getElementById("MyStyle")
    if(!myFontList.includes(fontFamily)) 
    {
        style.appendChild(document.createTextNode(code))
        myFontList.push(fontFamily)
        addFont(fontFamily, false)
    }
    var ruby = document.getElementsByClassName("ruby")
    for(var i of ruby)
    {
        i.style.fontFamily = fontFamily
    }
    var input = document.getElementsByClassName("el-input__inner")[0]
    input.value = fontFamily
}

function addFont(fontFamily, isload)
{
    var list = document.getElementsByClassName("el-select-dropdown__list")[0]
    list.id = "langList"
    for(let i of list.children)
    {
        if(!isload) i.classList.remove("selected")
        if(!i.classList.contains("mato"))
        {
            i.addEventListener("click", (event) => {
                var list = document.getElementById("langList")
                for(var i of list.children)
                {
                    if(i.classList.contains("mato")) i.classList.remove("selected")
                }
                var target = event.target
                if(event.target.nodeName == "LI") target = event.target.children[0]
                var input = document.getElementsByClassName("el-input__inner")[0]
                input.value = target.innerText
                var ruby = document.getElementsByClassName("ruby")
                for(var i of ruby)
                {
                    switch (target.innerText)
                    {
                        case "简体中文" :
                            i.style.fontFamily = "ygo-sc"
                            break
                        case "繁体中文" :
                            i.style.fontFamily = "ygo-tc"
                            break
                        case "日文" :
                            i.style.fontFamily = "ygo-jp"
                            break
                        case "英文" :
                            i.style.fontFamily = "ygo-en"
                            break
                        case "韩文" :
                            i.style.fontFamily = "ygo-kr"
                            break
                        case "星光体" :
                            i.style.fontFamily = "ygo-astral"
                            break
                        case "奥利哈钢" :
                            i.style.fontFamily = "ygo-orichalcos"
                            break
                    }
                }
            })
        }
    }
    var li = document.createElement("li")
    li.classList.add(fontFamily, "el-select-dropdown__item", "mato")
    if(!isload) li.classList.add("selected")
    li.addEventListener("click", (event) => {
        var list = document.getElementById("langList")
        for(var i of list.children)
        {
            i.classList.remove("selected")
        }
        var target = event.target
        if(event.target.nodeName == "SPAN") target = event.target.parentNode
        target.classList.add("selected")
        var input = document.getElementsByClassName("el-input__inner")[0]
        input.value = target.classList[0]
        var ruby = document.getElementsByClassName("ruby")
        for(var i of ruby)
        {
            i.style.fontFamily = target.classList[0]
        }
    })
    var span = document.createElement("span")
    span.innerText = fontFamily + "(自定义字体)"
    li.appendChild(span)
    list.appendChild(li)
}