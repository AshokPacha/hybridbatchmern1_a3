const readline = require('readline');
const fs = require('fs');
var arr = [];
var i = -1;
var newarr = [];
var years = [];

for (var i = 1960; i <= 2015; i++) {
    years.push(i);
}
years.join().split(',');

const rl = readline.createInterface({
    input: fs.createReadStream('Indicators.csv')
});
rl.on('line', function(line) {

    arr = (line.match(/(?:"[^"]*"|[^,])+/g));

    var result = filter(arr);
    var result2 = filter2(arr);

}).on('close', function() {
    //console.log(result1);
    fs.writeFile('lifeExpectancy1.json', JSON.stringify(result, null, ' '));
    // fs.writeFile('BirthAndDeath.json',JSON.stringify(result1, null, ' '));
    //fs.writeFile('Total.json',((result2.sort(function(p1, p2) { return p2.LifeExp - p1.LifeExp; })).slice(0, 5),null,' '));
    fs.writeFile('Total.json', JSON.stringify(((result2.sort(function(p1, p2) {
        return p2.LifeExp - p1.LifeExp;
    })).slice(0, 5)), null, ' '));

});




var val = 0.0;
var country = ["Afghanistan", "Bahrain", "Bangladesh", "Bhutan", "Myanmar", "Cambodia", "China", "India", "Indonesia", "Iraq", "Israel", "Japan", "Jordan", "Kazakhstan", "Lebanon", "Malaysia", "Maldives", "Mongolia", "Nepal",
    "Oman", "Pakistan", "Philippines", "Qatar", "Saudi Arabia", "Singapore", "Sri Lanka", "Syrian Arab Republic", "Tajikistan", "Thailand", "Timor-Leste", "Turkmenistan", "United Arab Emirates", "Uzbekistan", "Vietnam", "Yemen"
];
var result = [];
var result2 = [];


function filter(line) {
    if (country.indexOf(line[0]) !== -1) {
        if (line[3] === "SP.DYN.LE00.FE.IN") {
            var ctr = 0;
            for (j = 0; j < result.length; j++) {
                if (result[j].Year === line[4]) {
                    //console.log("Doing female addition for year" + line[4] + "Country" + line[0]);
                    result[j].Female = parseFloat(result[j].Female) + parseFloat(line[5]);
                    ctr++
                    //console.log("ctr" + ctr);
                    break;
                }
            }
            if (ctr === 0) {
                //console.log("Inside Female Push");
                result.push({
					Year: line[4],
                    Female: line[5],
                    Male: 0,
                    
                });
            }

        } else if (line[3] === "SP.DYN.LE00.MA.IN") {
            var ctr = 0;
            for (j = 0; j < result.length; j++) {
                if (result[j].Year === line[4]) {
                    //console.log("Doing male addition for year" + line[4] + "Country" + line[0]);
                    result[j].Male = parseFloat(result[j].Male) + parseFloat(line[5]);
                    ctr++;
                    break;


                }
            }
            if (ctr === 0) {
                //console.log("Inside Male Push");
                result.push({
					Year: line[4],
                    Female: 0,
                    Male: line[5],
					
                  
                });
            }

        }

    }
    return JSON.stringify(result);
}


function filter2(line) {
    if (line[3] === "SP.DYN.LE00.IN") {
        var ctr = 0;
        for (j = 0; j < result2.length; j++) {
            if (result2[j].country === line[0]) {
                result2[j].LifeExp = result2[j].LifeExp + parseFloat(line[5]);
                ctr++;
                break;
            }
        }
        if (ctr === 0) {
            result2.push({
                country: line[0],
                LifeExp: parseFloat(line[5]),
                Year: line[4]
            });
        }

    }

    return result2;
}
