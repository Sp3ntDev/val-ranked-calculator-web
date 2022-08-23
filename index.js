
//Get relevent data from valorant api
//this includes:
//

var g_compTiers;
var currentCompIndex=4;


async function getValorantApiValues() {
    const compSeasonsRAW = await fetch('https://valorant-api.com/v1/seasons/competitive'); //probably dont need this
    const compTiersRAW = await fetch('https://valorant-api.com/v1/competitivetiers');
    const compSeasons = await compSeasonsRAW.json()
    const compTiers = await compTiersRAW.json()

    console.log(compSeasons)
    console.log(compTiers.data[compTiers.data.length-1])
    g_compTiers = compTiers.data;
}

function constructCompTiersHTMLDropdown() {
    //TODO
}

function constructCompTiersRankPicker(tierIndex) {
    console.log(g_compTiers)
    var rankPickerDiv = $('<div class="rankpicker hide">')
    var realCounter = 0;
    var objTHing = []
    for (var i = 0; i < g_compTiers[tierIndex].tiers.length; i++) {
        var openObj = g_compTiers[tierIndex].tiers[i];
        if (openObj.division == "ECompetitiveDivision::INVALID" || openObj.division == "ECompetitiveDivision::UNRANKED") {
            continue;
        }
        if (realCounter % 3 == 0) {
            objTHing.push([])
        }
        objTHing[objTHing.length-1].push(openObj)
       



        //rankPickerDiv.append($(`<img class="rankitem" src="${openObj.largeIcon}" alt="${openObj.tierName}" ranknum="${realCounter}" rawnum="${i}">`))
        realCounter++;
    }
    var sndCounter = 0;
    objTHing.forEach((item) => {
        var obj = $('<div class="rankdiv">')
        item.forEach((itemV) => {
            obj.append($(`<img class="rankitem" src="${itemV.largeIcon}" alt="${itemV.tierName}" ranknum="${sndCounter}" rawnum="${itemV.tier}">`))
            sndCounter++;
        })
        rankPickerDiv.append(obj)
    })

    console.log(rankPickerDiv)
    return rankPickerDiv;
}

function remakeAllRankPickers(tierIndex) {
    const rankPickerHTML = constructCompTiersRankPicker(tierIndex)
    $(".rankpicker").replaceWith(rankPickerHTML)
    assignEvents();
}


function assignEvents() {
    $(".playerlistitem").on("click", function() {
        var activePlayerListItem = $(this);
        var rankPickerobj = activePlayerListItem.children(".rankpicker");
        if (rankPickerobj.hasClass("hide")) {
            rankPickerobj.removeClass("hide");
            activePlayerListItem.css("background-image", "")
        } else {
            rankPickerobj.addClass("hide");
            
        }
    });
    $(".rankitem").on("click", function() {
        console.log("BEANS")
        var activeRankItem = $(this);
        var activePlayerListItem = $(this).parent().parent().parent();

        var rankNum = activeRankItem.attr("ranknum");
        var rawNum = activeRankItem.attr("rawnum");
        console.log(g_compTiers[currentCompIndex].tiers)
        activePlayerListItem.css("background-image", `url(${g_compTiers[currentCompIndex].tiers[rawNum].largeIcon})`);
        activePlayerListItem.attr("ranknum", rankNum);
        playerListUpdated();
    });
}




async function firstRun() {
    await getValorantApiValues()
    remakeAllRankPickers(4)
}

firstRun()