class Effect
{
    continuous = false//是否永续
    must = false//是否必发
    condition = ""//时机
    operation = ""//非永续的效果处理
    limit = ""//次数限制
    text = ""
    code = ""
    filter = new Array(filter)
}

class filter
{
    id = ""
    code = ""
}

function KAnalysis(code)
{
    var effectList
    effectList = code.split
}

function splitMonsterEffect(code)
{
    var effectList = new Array()
    var cache = code
    if(code.indexOf("【怪兽效果】") != -1) cache = code.split("【怪兽效果】")[1]
    var start = parseInt('0x2460', 16)
    var index = 0
    var effectBase = new Array()
    while(index <= 9)
    {
        cache = cache.split(unescape("%u" + start.toString(16)) + "：")
        effectBase[index] = cache[0].replace("\n", "")
        if(cache[1] == null) break
        cache = cache[1]
        index += 1
        start += 1
    }
    for(var value of effectBase)
    {
        if(effectBase.indexOf(value) == 0) continue
        var effect = new Effect()
        var effIndex = "e" + effectBase.indexOf(value).toString()
        effect.code = `\tlocal ${effIndex}=Effect.CreateEffect(c)\n\t`
        effect.text = value
        if(value.search("才能发动。") != -1 || value.search("可以发动。") != -1)
        {
            effect.continuous = false
            effect.must = false
            if(value.search("才能发动。") != -1)
            {
                effect.condition = value.split("才能发动。")[0] + "才能发动。"
                effect.operation = value.split("才能发动。")[1]
            }
            else
            {
                effect.condition = value.split("可以发动。")[0] + "可以发动。"
                effect.operation = value.split("可以发动。")[1]
            }
            effect.code += `${effIndex}:SetType(EFFECT_TYPE_IGNITION)\n\t${effIndex}:SetRange(LOCATION_MZONE)\n\t`
            if(value.search("1回合1次") != -1)
            {
                effect.limit = value.split("1回合1次")[0] + "1回合1次"
                effect.code += `${effIndex}:SetCountLimit(1)\n\t`
            }
        }
        else if(value.search("必定发动。") != -1)
        {
            effect.must = true
            effect.continuous = false
            effect.condition = value.split("必定发动。")[0] + "必定发动。"
        }
        else 
        {
            effect.continuous = true
            effect.must = false
        }
        effect.code += `c:RegisterEffect(${effIndex})`
        effectList.push(effect)
        var x = effect.text.match(/从(.*)把(.*)。/)
        //console.log(effect.code)
        if(x != null) console.log(x)
    }
    //console.log(effectList)
}

splitMonsterEffect(`①：1回合1次，可以发动。从卡组把1张卡加入手卡。②：effectBase，必定发动。`)