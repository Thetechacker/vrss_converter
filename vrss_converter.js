Array.prototype.chunk = function(perChunk){
    if(!perChunk || typeof perChunk !== "number" || perChunk === Infinity || perChunk === NaN) return null

    return this.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / perChunk)

        if(!resultArray[chunkIndex]){
            resultArray[chunkIndex] = []
        }

        resultArray[chunkIndex].push(item)

        return resultArray
    }, [])
}

function generatePascalTriangle(m_level){
    if(!m_level || typeof m_level !== "number" || m_level === Infinity || m_level === NaN) return null

    var triangle = [ [ 1 ] ]

    for(var i = 0; i < m_level; i++){
        var pt = triangle[triangle.length - 1]
        var n_arr = []

        for(var i = 0; i < pt.length; i++){
            var prev_n = (pt[i - 1] || 0)
            var next_n = (pt[i + 1] || 0)

            n_arr.push(prev_n + pt[i])

            if(i === (pt.length - 1)) n_arr.push(next_n + pt[i])
        }

        triangle.push(n_arr)
    }

    return triangle
}

function generateScoreCouponsTable(){
    // var rows = 21
    // var tables = 14
    // var elements = 7

    var f_pascal = generatePascalTriangle(21).map((f, i) => f.slice((i >= 14 ? (i - 14) : 0) + 1)).filter(a => a.length !== 0) // 21 --> rows; 14 --> tables;
    var arr = []
    var f_table = {}

    function core(){
        for(var i = 0; i < f_pascal.length; i++){
            arr.push(f_pascal[i][f_pascal[i].length - 1])
        
            delete f_pascal[i][f_pascal[i].length - 1]
        
            f_pascal[i] = f_pascal[i].filter(v => typeof v !== "undefined")
        }
    
        f_pascal = f_pascal.filter(e => e.length !== 0)
    }

    const o = f_pascal.length
    
    for(var i = 0; i < o; i++){
        core()
    }

    var e = "abcdefghijklmno" // 14 tables = o -> b (1, 2, 3, ...) + 1 table (for 0) = o -> a (0, 1, 2, 3, ...)

    //0 = AAAAAAA
    //727 = FFFEEDA

    f_table[e[0]] = new Array(7).fill(0) // 7 --> elements;
    
    for(var i = 20; i >= 0; i--){ // { 20 = rows - 1 } = f{ (rows - 1) --> i; }
        if(arr.length === 0) break

        f_table[e[Object.keys(f_table).length]] = arr.splice(0, i).slice(0, 7) // 7 --> elements;
    }

    return f_table
}

function DecimalToScoreCoupons(int){
    if(typeof int !== "number") return null
    if(int === Infinity || int === NaN) return int

    var sequence = ""
    var n = Math.abs(int)

    var f_table = Object.entries(generateScoreCouponsTable())

    function getClosestValue(arr, val){
        if(!Array.isArray(arr) || val === NaN) return null
    
        return arr.length !== 0 ? arr.reduce(function(prev, curr) {
            return (Math.abs(curr[1] - val) < Math.abs(prev[1] - val) ? curr : prev);
        }) : null
    }
    
    var f_table = Object.entries(generateScoreCouponsTable()).map(k => [k[0], k[1].reverse()])

    for(var cur = 0; cur < 7; cur++){ // 7 rounds/elements.
        var k = getClosestValue(f_table.map(k => [k[0], k[1][cur]]).filter(v => !((n - v[1]) < 0)), n)

        sequence += k[0]
        n -= k[1]
    }

    return sequence.toUpperCase()
}

function ScoreCouponsToDecimal(str){
    if(!str || typeof str !== "string" || str.length !== 7) return NaN

    str = str.toLowerCase()

    var res = 0

    var f_table = Object.entries(generateScoreCouponsTable()).map(k => [k[0], k[1].reverse()])

    for(var cur = 0; cur < str.length; cur++){
        var k = f_table.find(k => k[0] === str[cur])

        k ? res += k[1][cur] : undefined
    }

    return res
}

console.log(DecimalToScoreCoupons(727)) // FFFEEDA
console.log(ScoreCouponsToDecimal("FFFEEDA")) // 727
