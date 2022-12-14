//비즈니스 선택 결과를 받아서 DB의 사용자 테이블에 저장
const db = require('../serverConfig');
const session = require("express-session");
const md5 = require('md5');
const { get } = require('express/lib/response');
const async = require('async');
const Connection = require('mysql/lib/Connection');


//body에 저장되어 들어오고, 해당 값을 텍스트로 받아오도록 해둠
exports.business = (req, res, next) => {
    var business_value = req.body.value.replace("'", "");
    var business_id = 0;
    var usr_id = req.session.userName;
    const usr_id_md5 = md5(usr_id);
    var update_sql = 'UPDATE usr_db.users SET usr_business=? WHERE usr_id_md5=?';
    var getBsnsID_sql = 'SELECT id_business FROM data_db.business WHERE name_business = ?';

    new Promise((resolve) => {
        db.query(getBsnsID_sql, business_value, function (err, rows, fields) {
            business_id = rows[0].id_business;
            console.log(business_id);
            resolve(business_id);
        })
    })
        .then((result) => db.query(update_sql, [result, usr_id_md5], function (err, rows, fields) {
            if (err) {
                console.log(err);

            }
            else {
                console.log('business value input successed!');
            }
        }));

}



//Anal_3 : show vulnerabilities 
exports.vuln = (req, res, next) => { //get method

    var category = req.query.category;
    console.log(category);
    var usr_id = req.session.userName;
    //console.log(usr_id);
    const md5_id = md5(usr_id);
    //console.log(md5_id);

    var select_assets_sql = 'SELECT distinct assets_id FROM usr_db.table_' + md5_id + ' WHERE big_assets_id=?' // bring assets id 
    //console.log(select_assets_sql);


    var json = "["
    let index = 0
    let len = -1
    lsy();


    function lsy() {

        if (index == len) { // finish
            console.log("hihi");
            json = json.slice(0, -1)
            json += ']'
            console.log("PARSHING ARRAY:", json)
            const obj = JSON.parse(json)
            console.log("obj:", obj)
            res.send(obj)
            return console.log("done");
        } else {
            db.query(select_assets_sql, category, function (err, rows, fields) {
                len = rows.length
                if (len == 0) {
                    console.log("there's no vulnerabilities")
                    var not = '{"id_threats":0,"name_vulns":"NO DATA"}'
                    console.log(not)
                    not = JSON.parse(not)
                    console.log("not:", not)
                    res.send(not)
                    return;
                }
                else {
                    var assets_id = rows[index].assets_id;
                    console.log("id_assets", assets_id);
                    var select_assets_name_sql = "SELECT name_assets FROM data_db.assets WHERE id_assets=?"
                    db.query(select_assets_name_sql, assets_id, function (err, rows, fields) {
                        var assets_name = rows[0].name_assets
                        console.log("assets_name:", assets_name)
                        lsy2(assets_id, assets_name).then(lsy)
                        index++;
                    })
                }
            })

        }
    }

    function lsy2(item, item2) {// item means assets_id
        return new Promise(function (resolve, reject) {
            var select_vulns_name_sql = "SELECT name_vulns,id_vulns FROM data_db.vulns WHERE id_assets=?"
            db.query(select_vulns_name_sql, item, function (err, rows, fields) {
                for (var i = 0; i < rows.length; i++) {
                    //let id_threats=array[i]
                    let id_vulns = rows[i].id_vulns
                    //console.log(id_threats)
                    let name_vulns = rows[i].name_vulns
                    //console.log(name_threats)
                    json += '{"id_vulns":' + id_vulns + ',"name_vulns":"' + name_vulns + '","name_assets":"' + item2 + '"},'
                }

                console.log(json)
                resolve();
            })
        })
    }

}



//Anal_3 : saving data and making grade

exports.save_vuln = async function (req, res, next) {

    var Arr = []

    var data = req.body.data
    console.log("요청 데이터", data)
    data = JSON.parse(data)
    console.log("크기", data.length)

    var usr_id = req.session.userName;
    const md5_id = md5(usr_id);

    var update_vulns_sql = 'UPDATE usr_db.table_' + md5_id + ' SET usr_vulns_rate=? WHERE vulns_id=?' // update vulnerability rate . several ...



    for (var i = 0; i < data.length; i++) {
        var id_vulns = data[i].num; // 취약성 고유 번호
        var serious_vulns = data[i].money;
        var exposed_vulns = data[i].frequency;
        console.log(id_vulns, serious_vulns, exposed_vulns); // 입력 값들 전부 출력 

        var innerArr = [id_vulns, serious_vulns * exposed_vulns]
        Arr.push(innerArr)

        if (Arr.length == data.length) {
            console.log("파라미터:", Arr)
            let result = await grade(Arr)
            console.log("등급 산정 결과:", result)
            console.log("등급 배열 크기:", result.length)
            for (var j = 0; j < result.length; j++) {
                db.query(update_vulns_sql, [result[j][1], result[j][0]], function (err, rows, fields) {
                    if (err) console.log(error)
                    else {
                        console.log(rows)
                    }
                })
            }
        }
    }


}



//Anal_4.html => show threats 
exports.threat = (req, res, next) => { //get method
    var category = req.query.category;
    console.log(category);
    var usr_id = req.session.userName;
    //console.log(usr_id);
    const md5_id = md5(usr_id);
    //console.log(md5_id);

    var select_assets_sql = 'SELECT distinct assets_id FROM usr_db.table_' + md5_id + ' WHERE big_assets_id=?' // bring vulnerability id 
    //console.log(select_threats_sql);


    var json = "["
    let index = 0
    let len = -1
    lsy();


    function lsy() {

        if (index == len) { // finish
            console.log("hihi");
            json = json.slice(0, -1)
            json += ']'
            console.log("PARSHING ARRAY:", json)
            const obj = JSON.parse(json)
            console.log("obj:", obj)
            res.send(obj)
            return console.log("done");
        } else {
            db.query(select_assets_sql, category, function (err, rows, fields) {
                len = rows.length
                if (len == 0) {
                    console.log("there's no threats")
                    var not = '{"id_threats":0,"name_threats":"NO DATA"}'
                    console.log(not)
                    not = JSON.parse(not)
                    console.log("not:", not)
                    res.send(not)
                    return;
                }
                else {
                    var assets_id = rows[index].assets_id;
                    console.log("id_assets", assets_id);
                    var select_assets_name_sql = "SELECT name_assets FROM data_db.assets WHERE id_assets=?"
                    db.query(select_assets_name_sql, assets_id, function (err, rows, fields) {
                        var assets_name = rows[0].name_assets
                        console.log("assets_name:", assets_name)
                        lsy2(assets_id, assets_name).then(lsy)
                        index++;
                    })
                }
            })

        }
    }

    function lsy2(item, item2) {// item means assets_id
        return new Promise(function (resolve, reject) {
            var select_threats_name_sql = "SELECT name_threats,id_threats FROM data_db.threats WHERE id_assets=?"
            db.query(select_threats_name_sql, item, function (err, rows, fields) {
                for (var i = 0; i < rows.length; i++) {
                    //let id_threats=array[i]
                    let id_threats = rows[i].id_threats
                    //console.log(id_threats)
                    let name_threats = rows[i].name_threats
                    //console.log(name_threats)
                    name_threats.replace('\\\\', '//')
                    name_threats.replace('\\', '//')



                    json += '{"id_threats":' + id_threats + ',"name_threats":"' + name_threats + '","name_assets":"' + item2 + '"},'
                }
                console.log(json)
                resolve();
            })
        })
    }
}


//Anal_4 : saving data and making grade 
exports.save_threat = async function (req, res, next) {

    var Arr = []
    var Arr_spend = []
    var data = req.body.data
    console.log("요청 데이터", data)
    data = JSON.parse(data)
    console.log("크기", data.length)

    var usr_id = req.session.userName;
    const md5_id = md5(usr_id);

    var update_threats_sql = 'UPDATE usr_db.table_' + md5_id + ' SET usr_threats_rate=?, usr_threats_spend=? WHERE threats_id=?' // update vulnerability rate


    for (var i = 0; i < data.length; i++) {
        var id_threats = data[i].num; // 위협 고유 번호
        var serious_threats = data[i].money; // store !!!! 
        Arr_spend.push(serious_threats)
        var exposed_threats = data[i].frequency;
        console.log(id_threats, serious_threats, exposed_threats)

        var innerArr = [id_threats, serious_threats, exposed_threats]
        Arr.push(innerArr)

        if (Arr.length == data.length) {
            console.log("파라미터", Arr)
            let result = await grade(Arr)
            console.log("등급 산정 결과:", result)
            console.log("등급 배열 크기:", result.length)
            console.log("위협 비용 배열:", Arr_spend)

            for (var j = 0; j < result.length; j++) {
                db.query(update_threats_sql, [result[j][1], Arr_spend[j], result[j][0]], function (err, rows, fields) {
                    if (err) console.log(err)
                    else {
                        console.log(rows)
                    }
                })
            }
        }

    }


}

//위험도 계산해서 위험도 분류, DB와의 인터렉션 필요
//async sync check. if error occurs, then use Promise
exports.result = async (req, res, next) => {
    let asset = 0;
    let vuln = 0;
    let threat = 0;
    let assetId = 0;
    let maxIdx = 0;
    let arr_rate = [];
    let risk_rate = [];
    let risk_rate_for_web = [];
    let riskRate = 0;
    let usr_id_md5 = md5(req.session.userName);
    let getRateSql = 'SELECT usr_risk_id, usr_assets_rate, usr_vulns_rate, usr_threats_rate FROM usr_db.table_' + usr_id_md5;

    //get the rates of assets, threats, vulnerabilities in order and put them in the array: arr_rate
    new Promise(function (resolve, reject) {
        db.query(getRateSql, function (err, rows, field) {
            if (err) {
                console.log(err);
            }
            else {
                maxIdx = rows.length;
                for (var idx = 0; idx < maxIdx; idx++) {
                    cursor = rows[idx];
                    arr_rate.push([cursor.usr_risk_id, cursor.usr_assets_rate * cursor.usr_vulns_rate * cursor.usr_threats_rate]);
                }
                resolve(arr_rate);
            }
        })
    })

        //give the array as a parameter of riskAssess()
        //store the risk rate into the array: risk_rate
        .then(async function (result) {
            let temp = await grade_5(result);
            return (temp);
        })
        .then(function (result) {
            //all data is in order, so don't need to check whether the risk rate is the right risk rate for (asset, threat, vuln)
            const updateSql = 'UPDATE usr_db.table_' + usr_id_md5 + ' SET usr_risk_rate=? WHERE usr_risk_id=?';
            //send the risk rate to the database
            for (var idx = 0; idx < maxIdx; idx++) {
                //this will be executed at the very last moment, but never mind; the data dependency is over at here
                db.query(updateSql, [result[idx][1], result[idx][0]], function (err, rows, field) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('risk rate update trial[' + idx + '] success');
                    }
                })
            }
            for (var idx = 0; idx < maxIdx; idx++) {
                risk_rate_for_web.push(result[idx][1]);
            }
            return (risk_rate_for_web);
        })
        .then(async function (result) {
            //count the number of risks per each rate
            let risk_1 = await result.filter(element => 1 === element).length;
            let risk_2 = await result.filter(element => 2 === element).length;
            let risk_3 = await result.filter(element => 3 === element).length;
            let risk_4 = await result.filter(element => 4 === element).length;
            let risk_5 = await result.filter(element => 5 === element).length;
            console.log("the very last one: " + result);

            //차례대로 1등급, 2등급, 3등급, 4등급, 5등급 개수를 보내주면 됨
            const json = '{"1":' + risk_1 + ', "2":' + risk_2 + ', "3":' + risk_3 + ', "4":' + risk_4 + ', "5":' + risk_5 + '}';
            const obj = JSON.parse(json);
            //GET /analysis/result?1=3&2=4&3=5&4=6&5=0 이런 식으로 response됨.
            console.log(obj);
            return (res.send(obj));
        });
}


//sends the list of user's risks whose level is 1
exports.risk1_list = (req, res, next) => {
    let usr_id = req.session.userName;
    let usr_id_md5 = md5(usr_id);
    let id_arr = [];
    let astId = 0;
    let vulId = 0;
    let thrtId = 0;
    let maxIdx = 0;
    let name_arr = [];
    const selectIdSql = 'SELECT assets_id, vulns_id, threats_id FROM usr_db.table_' + usr_id_md5 + ' WHERE usr_risk_rate=1';
    const selectNameSql = `SELECT 
    data_db.assets.name_assets, data_db.assets.id_assets, 
    data_db.threats.name_threats, data_db.threats.id_threats, 
    data_db.vulns.name_vulns, data_db.vulns.id_vulns 
    FROM 
    data_db.threats 
    RIGHT JOIN data_db.assets 
    ON data_db.assets.id_assets=data_db.threats.id_assets 
    RIGHT JOIN data_db.vulns 
    ON data_db.vulns.id_assets=data_db.assets.id_assets 
    WHERE 
    data_db.assets.id_assets=? AND data_db.vulns.id_vulns=? AND data_db.threats.id_threats=?`;

    new Promise(function (resolve, reject) {
        //getting asset id, vulnerability id and threat id from user's table.
        //the data will be stored in id_arr array.
        db.query(selectIdSql, function (err, rows, fields) {
            if (err) {
                console.log(err);
            }
            else {
                maxIdx = rows.length;
                for (var idx = 0; idx < maxIdx; idx++) {
                    astId = rows[idx].assets_id;
                    vulId = rows[idx].vulns_id;
                    thrtId = rows[idx].threats_id
                    id_arr.push([astId, vulId, thrtId]);
                }
                console.log(id_arr);
                resolve([id_arr, maxIdx])
            }
        })
    })
        //getting asset name, vulnerability name and threat name by asset id
        //store the dataset in the name_arr as a object type: {key}:{value}
        .then(async function (result) {
            id_arr = result[0];
            maxIdx = result[1];
            const mysql = require('mysql2/promise');
            try {
                const connection = await mysql.createConnection({
                    host: "14.40.31.222",
                    user: 'dev', //for now it is the root user, but gotta make a new user with limited privileged role 
                    password: '1918password',
                    port: 3306,
                    database: 'data_db'
                });
                for (var idx = 0; idx < maxIdx; idx++) {
                    let [rows, fields] = await connection.execute(selectNameSql, [id_arr[idx][0]/*assets_id*/, id_arr[idx][1]/*vulns_id*/, id_arr[idx][2]/*threats_id*/]); //function(err, rows, fields){

                    rows.forEach(function (k, value) {
                        let astname = k.name_assets;
                        let vulname = k.name_vulns;
                        let thrtname = k.name_threats;
                        name_arr.push({ riskRate: 1, risk: '' + astname + '의 ' + thrtname + '으로 인해 ' + vulname + ' 발생 가능' });
                        console.log(name_arr);
                    });
                }
                return (name_arr);
            }
            catch (err) {
                console.log(err);
            }
        })
        .then(function (result) {
            //const obj = JSON.parse(result);
            //console.log(obj);
            res.send(result);
        });


}

exports.risk2_list = (req, res, next) => {
    let usr_id = req.session.userName;
    let usr_id_md5 = md5(usr_id);
    let id_arr = [];
    let astId = 0;
    let vulId = 0;
    let thrtId = 0;
    let maxIdx = 0;
    let name_arr = [];
    const selectIdSql = 'SELECT assets_id, vulns_id, threats_id FROM usr_db.table_' + usr_id_md5 + ' WHERE usr_risk_rate=2';
    const selectNameSql = `SELECT 
    data_db.assets.name_assets, data_db.assets.id_assets, 
    data_db.threats.name_threats, data_db.threats.id_threats, 
    data_db.vulns.name_vulns, data_db.vulns.id_vulns 
    FROM 
    data_db.threats 
    RIGHT JOIN data_db.assets 
    ON data_db.assets.id_assets=data_db.threats.id_assets 
    RIGHT JOIN data_db.vulns 
    ON data_db.vulns.id_assets=data_db.assets.id_assets 
    WHERE 
    data_db.assets.id_assets=? AND data_db.vulns.id_vulns=? AND data_db.threats.id_threats=?`;

    new Promise(function (resolve, reject) {
        //getting asset id, vulnerability id and threat id from user's table.
        //the data will be stored in id_arr array.
        db.query(selectIdSql, function (err, rows, fields) {
            if (err) {
                console.log(err);
            }
            else {
                maxIdx = rows.length;
                for (var idx = 0; idx < maxIdx; idx++) {
                    astId = rows[idx].assets_id;
                    vulId = rows[idx].vulns_id;
                    thrtId = rows[idx].threats_id
                    id_arr.push([astId, vulId, thrtId]);
                }
                console.log(id_arr);
                resolve([id_arr, maxIdx])
            }
        })
    })
        //getting asset name, vulnerability name and threat name by asset id
        //store the dataset in the name_arr as a object type: {key}:{value}
        .then(async function (result) {
            id_arr = result[0];
            maxIdx = result[1];
            const mysql = require('mysql2/promise');
            try {
                const connection = await mysql.createConnection({
                    host: "14.40.31.222",
                    user: 'dev', //for now it is the root user, but gotta make a new user with limited privileged role 
                    password: '1918password',
                    port: 3306,
                    database: 'data_db'
                });
                for (var idx = 0; idx < maxIdx; idx++) {
                    let [rows, fields] = await connection.execute(selectNameSql, [id_arr[idx][0]/*assets_id*/, id_arr[idx][1]/*vulns_id*/, id_arr[idx][2]/*threats_id*/]); //function(err, rows, fields){

                    rows.forEach(function (k, value) {
                        let astname = k.name_assets;
                        let vulname = k.name_vulns;
                        let thrtname = k.name_threats;
                        name_arr.push({ riskRate: 2, risk: '' + astname + '의 ' + thrtname + '으로 인해 ' + vulname + ' 발생 가능' });
                        console.log(name_arr);
                    });
                }
                return (name_arr);
            }
            catch (err) {
                console.log(err);
            }
        })
        .then(function (result) {
            //const obj = JSON.parse(result);
            //console.log(obj);
            res.send(result);
        });


}

exports.risk3_list = (req, res, next) => {
    let usr_id = req.session.userName;
    let usr_id_md5 = md5(usr_id);
    let id_arr = [];
    let astId = 0;
    let vulId = 0;
    let thrtId = 0;
    let maxIdx = 0;
    let name_arr = [];
    const selectIdSql = 'SELECT assets_id, vulns_id, threats_id FROM usr_db.table_' + usr_id_md5 + ' WHERE usr_risk_rate=3';
    const selectNameSql = `SELECT 
    data_db.assets.name_assets, data_db.assets.id_assets, 
    data_db.threats.name_threats, data_db.threats.id_threats, 
    data_db.vulns.name_vulns, data_db.vulns.id_vulns 
    FROM 
    data_db.threats 
    RIGHT JOIN data_db.assets 
    ON data_db.assets.id_assets=data_db.threats.id_assets 
    RIGHT JOIN data_db.vulns 
    ON data_db.vulns.id_assets=data_db.assets.id_assets 
    WHERE 
    data_db.assets.id_assets=? AND data_db.vulns.id_vulns=? AND data_db.threats.id_threats=?`;

    new Promise(function (resolve, reject) {
        //getting asset id, vulnerability id and threat id from user's table.
        //the data will be stored in id_arr array.
        db.query(selectIdSql, function (err, rows, fields) {
            if (err) {
                console.log(err);
            }
            else {
                maxIdx = rows.length;
                for (var idx = 0; idx < maxIdx; idx++) {
                    astId = rows[idx].assets_id;
                    vulId = rows[idx].vulns_id;
                    thrtId = rows[idx].threats_id
                    id_arr.push([astId, vulId, thrtId]);
                }
                console.log(id_arr);
                resolve([id_arr, maxIdx])
            }
        })
    })
        //getting asset name, vulnerability name and threat name by asset id
        //store the dataset in the name_arr as a object type: {key}:{value}
        .then(async function (result) {
            id_arr = result[0];
            maxIdx = result[1];
            const mysql = require('mysql2/promise');
            try {
                const connection = await mysql.createConnection({
                    host: "14.40.31.222",
                    user: 'dev', //for now it is the root user, but gotta make a new user with limited privileged role 
                    password: '1918password',
                    port: 3306,
                    database: 'data_db'
                });
                for (var idx = 0; idx < maxIdx; idx++) {
                    let [rows, fields] = await connection.execute(selectNameSql, [id_arr[idx][0]/*assets_id*/, id_arr[idx][1]/*vulns_id*/, id_arr[idx][2]/*threats_id*/]); //function(err, rows, fields){

                    rows.forEach(function (k, value) {
                        let astname = k.name_assets;
                        let vulname = k.name_vulns;
                        let thrtname = k.name_threats;
                        name_arr.push({ riskRate: 3, risk: '' + astname + '의 ' + thrtname + '으로 인해 ' + vulname + ' 발생 가능' });
                        console.log(name_arr);
                    });
                }
                return (name_arr);
            }
            catch (err) {
                console.log(err);
            }
        })
        .then(function (result) {
            //const obj = JSON.parse(result);
            //console.log(obj);
            res.send(result);
        });


}

exports.risk4_list = (req, res, next) => {
    let usr_id = req.session.userName;
    let usr_id_md5 = md5(usr_id);
    let id_arr = [];
    let astId = 0;
    let vulId = 0;
    let thrtId = 0;
    let maxIdx = 0;
    let name_arr = [];
    const selectIdSql = 'SELECT assets_id, vulns_id, threats_id FROM usr_db.table_' + usr_id_md5 + ' WHERE usr_risk_rate=4';
    const selectNameSql = `SELECT 
    data_db.assets.name_assets, data_db.assets.id_assets, 
    data_db.threats.name_threats, data_db.threats.id_threats, 
    data_db.vulns.name_vulns, data_db.vulns.id_vulns 
    FROM 
    data_db.threats 
    RIGHT JOIN data_db.assets 
    ON data_db.assets.id_assets=data_db.threats.id_assets 
    RIGHT JOIN data_db.vulns 
    ON data_db.vulns.id_assets=data_db.assets.id_assets 
    WHERE 
    data_db.assets.id_assets=? AND data_db.vulns.id_vulns=? AND data_db.threats.id_threats=?`;

    new Promise(function (resolve, reject) {
        //getting asset id, vulnerability id and threat id from user's table.
        //the data will be stored in id_arr array.
        db.query(selectIdSql, function (err, rows, fields) {
            if (err) {
                console.log(err);
            }
            else {
                maxIdx = rows.length;
                for (var idx = 0; idx < maxIdx; idx++) {
                    astId = rows[idx].assets_id;
                    vulId = rows[idx].vulns_id;
                    thrtId = rows[idx].threats_id
                    id_arr.push([astId, vulId, thrtId]);
                }
                console.log(id_arr);
                resolve([id_arr, maxIdx])
            }
        })
    })
        //getting asset name, vulnerability name and threat name by asset id
        //store the dataset in the name_arr as a object type: {key}:{value}
        .then(async function (result) {
            id_arr = result[0];
            maxIdx = result[1];
            const mysql = require('mysql2/promise');
            try {
                const connection = await mysql.createConnection({
                    host: "14.40.31.222",
                    user: 'dev', //for now it is the root user, but gotta make a new user with limited privileged role 
                    password: '1918password',
                    port: 3306,
                    database: 'data_db'
                });
                for (var idx = 0; idx < maxIdx; idx++) {
                    let [rows, fields] = await connection.execute(selectNameSql, [id_arr[idx][0]/*assets_id*/, id_arr[idx][1]/*vulns_id*/, id_arr[idx][2]/*threats_id*/]); //function(err, rows, fields){

                    rows.forEach(function (k, value) {
                        let astname = k.name_assets;
                        let vulname = k.name_vulns;
                        let thrtname = k.name_threats;
                        name_arr.push({ riskRate: 4, risk: '' + astname + '의 ' + thrtname + '으로 인해 ' + vulname + ' 발생 가능' });
                        console.log(name_arr);
                    });
                }
                return (name_arr);
            }
            catch (err) {
                console.log(err);
            }
        })
        .then(function (result) {
            //const obj = JSON.parse(result);
            //console.log(obj);
            res.send(result);
        });


}

exports.risk5_list = (req, res, next) => {
    let usr_id = req.session.userName;
    let usr_id_md5 = md5(usr_id);
    let id_arr = [];
    let astId = 0;
    let vulId = 0;
    let thrtId = 0;
    let maxIdx = 0;
    let name_arr = [];
    const selectIdSql = 'SELECT assets_id, vulns_id, threats_id FROM usr_db.table_' + usr_id_md5 + ' WHERE usr_risk_rate=5';
    const selectNameSql = `SELECT 
    data_db.assets.name_assets, data_db.assets.id_assets, 
    data_db.threats.name_threats, data_db.threats.id_threats, 
    data_db.vulns.name_vulns, data_db.vulns.id_vulns 
    FROM 
    data_db.threats 
    RIGHT JOIN data_db.assets 
    ON data_db.assets.id_assets=data_db.threats.id_assets 
    RIGHT JOIN data_db.vulns 
    ON data_db.vulns.id_assets=data_db.assets.id_assets 
    WHERE 
    data_db.assets.id_assets=? AND data_db.vulns.id_vulns=? AND data_db.threats.id_threats=?`;

    new Promise(function (resolve, reject) {
        //getting asset id, vulnerability id and threat id from user's table.
        //the data will be stored in id_arr array.
        db.query(selectIdSql, function (err, rows, fields) {
            if (err) {
                console.log(err);
            }
            else {
                maxIdx = rows.length;
                for (var idx = 0; idx < maxIdx; idx++) {
                    astId = rows[idx].assets_id;
                    vulId = rows[idx].vulns_id;
                    thrtId = rows[idx].threats_id
                    id_arr.push([astId, vulId, thrtId]);
                }
                console.log(id_arr);
                resolve([id_arr, maxIdx])
            }
        })
    })
        //getting asset name, vulnerability name and threat name by asset id
        //store the dataset in the name_arr as a object type: {key}:{value}
        .then(async function (result) {
            id_arr = result[0];
            maxIdx = result[1];
            const mysql = require('mysql2/promise');
            try {
                const connection = await mysql.createConnection({
                    host: "14.40.31.222",
                    user: 'dev', //for now it is the root user, but gotta make a new user with limited privileged role 
                    password: '1918password',
                    port: 3306,
                    database: 'data_db'
                });
                for (var idx = 0; idx < maxIdx; idx++) {
                    let [rows, fields] = await connection.execute(selectNameSql, [id_arr[idx][0]/*assets_id*/, id_arr[idx][1]/*vulns_id*/, id_arr[idx][2]/*threats_id*/]); //function(err, rows, fields){

                    rows.forEach(function (k, value) {
                        let astname = k.name_assets;
                        let vulname = k.name_vulns;
                        let thrtname = k.name_threats;
                        name_arr.push({ riskRate: 5, risk: '' + astname + '의 ' + thrtname + '으로 인해 ' + vulname + ' 발생 가능' });
                        console.log(name_arr);
                    });
                }
                return (name_arr);
            }
            catch (err) {
                console.log(err);
            }
        })
        .then(function (result) {
            //const obj = JSON.parse(result);
            //console.log(obj);
            res.send(result);
        });
}

//function that assesses risks
//returns the risk level in int form
riskAssess = (asset, vuln, threat) => {
    return new Promise(async (resolve, reject) => {
        //switch
        switch (threat) {
            //When threat level is 1:
            case 1:
                switch (asset) {
                    case 1:
                        switch (vuln) {
                            case 1:
                                resolve(1);
                                break;
                            case 2:
                                resolve(1);
                                break;
                            case 3:
                                resolve(2);
                                break;
                            case 4:
                                resolve(2);
                                break;
                            case 5:
                                resolve(3);
                                break;
                            default:
                                console.log("valueError: vulnerability");
                                break;
                        }
                        break;
                    case 2:
                        switch (vuln) {
                            case 1:
                                resolve(1);
                                break;
                            case 2:
                                resolve(2);
                                break;
                            case 3:
                                resolve(2);
                                break;
                            case 4:
                                resolve(3);
                                break;
                            case 5:
                                resolve(3);
                                break;
                            default:
                                console.log("valueError: vulnerability");
                                break;
                        }
                        break;
                    case 3:
                        switch (vuln) {
                            case 1:
                                resolve(2);
                                break;
                            case 2:
                                resolve(2);
                                break;
                            case 3:
                                resolve(3);
                                break;
                            case 4:
                                resolve(3);
                                break;
                            case 5:
                                resolve(4);
                                break;
                            default:
                                console.log("valueError: vulnerability");
                                break;
                        }
                        break;
                    default:
                        console.log("valueError: assetValueError");
                }
                break;
            case 2: //when threat level is 2:
                switch (asset) {
                    case 1:
                        switch (vuln) {
                            case 1:
                                resolve(1);
                                break;
                            case 2:
                                resolve(2);
                                break;
                            case 3:
                                resolve(2);
                                break;
                            case 4:
                                resolve(3);
                                break;
                            case 5:
                                resolve(3);
                                break;
                            default:
                                console.log("valueError: vulnerability");
                                break;
                        }
                        break;
                    case 2:
                        switch (vuln) {
                            case 1:
                                resolve(2);
                                break;
                            case 2:
                                resolve(2);
                                break;
                            case 3:
                                resolve(3);
                                break;
                            case 4:
                                resolve(3);
                                break;
                            case 5:
                                resolve(4);
                                break;
                            default:
                                console.log("valueError: vulnerability");
                                break;
                        }
                        break;
                    case 3:
                        switch (vuln) {
                            case 1:
                                resolve(2);
                                break;
                            case 2:
                                resolve(3);
                                break;
                            case 3:
                                resolve(3);
                                break;
                            case 4:
                                resolve(4);
                                break;
                            case 5:
                                resolve(4);
                                break;
                            default:
                                console.log("valueError: vulnerability");
                                break;
                        }
                        break;
                    default:
                        console.log("valueError: assetValueError");
                }
                break;
            case 3: //When threat level is 3
                switch (asset) {
                    case 1:
                        switch (vuln) {
                            case 1:
                                resolve(2);
                                break;
                            case 2:
                                resolve(2);
                                break;
                            case 3:
                                resolve(3);
                                break;
                            case 4:
                                resolve(3);
                                break;
                            case 5:
                                resolve(4);
                                break;
                            default:
                                console.log("valueError: vulnerability");
                                break;
                        }
                        break;
                    case 2:
                        switch (vuln) {
                            case 1:
                                resolve(2);
                                break;
                            case 2:
                                resolve(3);
                                break;
                            case 3:
                                resolve(3);
                                break;
                            case 4:
                                resolve(4);
                                break;
                            case 5:
                                resolve(4);
                                break;
                            default:
                                console.log("valueError: vulnerability");
                                break;
                        }
                        break;
                    case 3:
                        switch (vuln) {
                            case 1:
                                resolve(3);
                                break;
                            case 2:
                                resolve(3);
                                break;
                            case 3:
                                resolve(4);
                                break;
                            case 4:
                                resolve(4);
                                break;
                            case 5:
                                resolve(5);
                                break;
                            default:
                                console.log("valueError: vulnerability");
                                break;
                        }
                        break;
                    default:
                        console.log("valueError: assetValueError");
                }
                break;
            case 4: //when threat level is 4
                switch (asset) {
                    case 1:
                        switch (vuln) {
                            case 1:
                                resolve(2);
                                break;
                            case 2:
                                resolve(3);
                                break;
                            case 3:
                                resolve(3);
                                break;
                            case 4:
                                resolve(4);
                                break;
                            case 5:
                                resolve(4);
                                break;
                            default:
                                console.log("valueError: vulnerability");
                                break;
                        }
                        break;
                    case 2:
                        switch (vuln) {
                            case 1:
                                resolve(3);
                                break;
                            case 2:
                                resolve(3);
                                break;
                            case 3:
                                resolve(4);
                                break;
                            case 4:
                                resolve(4);
                                break;
                            case 5:
                                resolve(5);
                                break;
                            default:
                                console.log("valueError: vulnerability");
                                break;
                        }
                        break;
                    case 3:
                        switch (vuln) {
                            case 1:
                                resolve(3);
                                break;
                            case 2:
                                resolve(4);
                                break;
                            case 3:
                                resolve(4);
                                break;
                            case 4:
                                resolve(5);
                                break;
                            case 5:
                                resolve(5);
                                break;
                            default:
                                console.log("valueError: vulnerability");
                                break;
                        }
                        break;
                    default:
                        console.log("valueError: assetValueError");
                }
                break;
            case 5: //when threat level is 5
                switch (asset) {
                    case 1:
                        switch (vuln) {
                            case 1:
                                resolve(3);
                                break;
                            case 2:
                                resolve(3);
                                break;
                            case 3:
                                resolve(4);
                                break;
                            case 4:
                                resolve(4);
                                break;
                            case 5:
                                resolve(5);
                                break;
                            default:
                                console.log("valueError: vulnerability");
                                break;
                        }
                        break;
                    case 2:
                        switch (vuln) {
                            case 1:
                                resolve(3);
                                break;
                            case 2:
                                resolve(4);
                                break;
                            case 3:
                                resolve(4);
                                break;
                            case 4:
                                resolve(5);
                                break;
                            case 5:
                                resolve(5);
                                break;
                            default:
                                console.log("valueError: vulnerability");
                                break;
                        }
                        break;
                    case 3:
                        switch (vuln) {
                            case 1:
                                resolve(4);
                                break;
                            case 2:
                                resolve(4);
                                break;
                            case 3:
                                resolve(5);
                                break;
                            case 4:
                                resolve(5);
                                break;
                            case 5:
                                resolve(5);
                                break;
                            default:
                                console.log("valueError: vulnerability");
                                break;
                        }
                        break;
                    default:
                        console.log("valueError: assetValueError");
                }
                break;
            default:
                console.log("valueError: threatValueError");
                break;
        }
    })
}
//대분류에 따른 중분류 리스트 보내기 (id_mid_assets, name_m_cat_ass)
exports.asset_big = (req, res, next) => {
    var index = req.query.id_big_assets; //대분류 id를 받음
    var Mid_assets_id = 'SELECT id_mid_assets FROM data_db.assets WHERE id_big_assets = ?'; //디비에서 해당 중분류 id들 조회
    var Mid_assets_name = 'SELECT id_m_cat_ass, name_m_cat_ass FROM data_db.mid_category_assets WHERE id_m_cat_ass = ?'; //중분류 id로 중분류 명 조회, ? 에 Mid_assets_id의 원소들 들어가야 함
    var data = '[';
    var Mid_list = [];

    db.query(Mid_assets_id, index, function (err, rows, fields) {
        for (var i = 0; i < rows.length; i++) {
            Mid_list.push(rows[i].id_mid_assets);
        }
        const set = new Set(Mid_list);
        const Mid_list_new = Array.from(set);
        let index = 0;
        test1();
        function test1() {
            if (Mid_list_new.length == index) {
                data = data.slice(0, -1);
                data += ']';
                const json = JSON.parse(data);
                res.send(json);
            } else {
                test2(Mid_list_new[index]).then(test1);
                index++;
            }
        }
        function test2(item) {
            return new Promise(function (resolve, reject) {
                db.query(Mid_assets_name, item, function (err, rows, fields) {
                    //비어있는 객체 생성
                    var obj;
                    //person1객체의 프로퍼티를 할당
                    obj = '{"id_m_cat_ass":"' + rows[0].id_m_cat_ass + '","name_m_cat_ass":"' + rows[0].name_m_cat_ass + '"}';
                    //data.push(obj);
                    data += obj;
                    data += ',';
                    resolve();
                })
            });
        }
    })
}

//대분류, 중분류, 자산 고유번호, 자산명, C, I, A, 업무의존도, 가치등급 리스트 보내기 (name_b_cat_ass, name_m_cat_ass, id_assets, name_assets, c_assets, i_assets, a_assets, dpdcy_assets, value_assets)
exports.asset_big_mid = (req, res, next) => {
    var big_index = req.query.id_big_assets; //대분류 id 받아옴
    var mid_index = req.query.id_mid_assets; //중분류 id 받아옴
    var DB_select_big = 'SELECT data_db.assets.name_assets, data_db.assets.id_assets, data_db.big_category_assets.name_b_cat_ass FROM data_db.assets LEFT OUTER JOIN data_db.big_category_assets ON data_db.assets.id_big_assets = data_db.big_category_assets.id_b_cat_ass WHERE data_db.assets.id_big_assets = ? AND data_db.assets.id_mid_assets = ?';
    var DB_select_mid = 'SELECT data_db.mid_category_assets.name_m_cat_ass, data_db.mid_category_assets.id_m_cat_ass FROM data_db.mid_category_assets WHERE data_db.mid_category_assets.id_m_cat_ass = ? AND data_db.mid_category_assets.id_m_cat_ass = ?';
    var data = '[';
    var obj; //비어있는 객체 생성
    var mid_name = [];

    new Promise(function (resolve, reject) {
        db.query(DB_select_big, [big_index, mid_index], function (err, rows, fields) {
            for (var i = 0; i < rows.length; i++) {
                mid_name.push(rows[i].name_assets);
                mid_name.push(rows[i].id_assets);
                mid_name.push(rows[i].name_b_cat_ass);
            }
            resolve(mid_name);
        })
    })
        .then(async function (result) {
            const mysql = require('mysql2/promise');
            try {
                const connection = await mysql.createConnection({
                    host: "14.40.31.222",
                    user: 'dev', //for now it is the root user, but gotta make a new user with limited privileged role 
                    password: '1918password',
                    port: 3306,
                    database: 'data_db'
                });

                for (var i = 0; i < result.length; i += 3) {
                    let [rows, field] = await connection.execute(DB_select_mid, [mid_index, mid_index]);
                    rows.forEach(function (k, value) {
                        let m_name = k.name_m_cat_ass;
                        obj = '{"name_assets":"' + result[i] + '","id_assets":"' + result[i + 1] + '","name_b_cat_ass":"' + result[i + 2] + '","name_m_cat_ass":"' + m_name + '"}';
                        //data.push(obj);
                        data += obj;
                        data += ',';
                    });

                }
                data = data.slice(0, -1);
                data += ']';
                console.log(data);
                const json = JSON.parse(data);
                res.send(json);

            } catch (err) {
                console.log(err);
            }
        })
}

//사용자 입력값들 모두 받아 디비에 저장
exports.save_ass = (req, res, next) => {
    var usr_id = req.session.userName;
    const usr_id_md5 = md5(usr_id);
    var data = req.body;
    var data_send = [];
    for (var i = 0; i < data.length; i++) {
        var obj = [];
        obj.push(parseInt(data[i].assets_id));
        obj.push(data[i].score);
        data_send.push(obj);
    }
    var data_rec = grade(data_send)
    var result = [];
    for (var i = 0; i < data.length; i++) {
        var obj = [];
        obj.push(data_rec[i][0]);
        obj.push(parseInt(data[i].big_assets_id));
        obj.push(parseInt(data[i].usr_assets_imp));
        obj.push(data_rec[i][1]);
        result.push(obj);
    }
    console.log(result);
    var ass_list = []
    for (var i = 0; i < data.length; i++) {
        ass_list.push(result[i][0]);
    }
    //----------------------------------------------------
    //let val1 = req.body.assets_id; //자산id
    //let val2 = req.body.big_assets_id; //자산대분류id
    //let val3 = req.body.usr_assets_imp; //핵심자산여부
    //let val4 = req.body.usr_assetss_rate; //자산중요도등급
    var update_sql = 'insert into usr_db.table_' + usr_id_md5 + '(assets_id, big_assets_id, usr_assets_imp, usr_assets_rate, vulns_id, threats_id) value (?,?,?,?,?,?)';
    //자산id, 취약성id, 위협id, 자산대분류id, 핵심자산여부, 자산중요도등급
    var select_id = 'select id_assets, id_vulns, id_threats from data_db.concerns where id_assets = ? AND id_assets = ?';
    //자산id, 취약성id, 위협id 조회
    con_name = [];
    var final_result = [];
    new Promise(async function (resolve, reject) {
        const mysql = require('mysql2/promise');
        try {
            const connection = await mysql.createConnection({
                host: "14.40.31.222",
                user: 'dev', //for now it is the root user, but gotta make a new user with limited privileged role 
                password: '1918password',
                port: 3306,
                database: 'data_db'
            });
            for (var i = 0; i < ass_list.length; i++) {
                let [rows, field] = await connection.execute(select_id, [ass_list[i], ass_list[i]]);
                rows.forEach(function (k, value) {
                    var obj = [];
                    obj.push(k.id_assets);
                    obj.push(result[i][1])
                    obj.push(result[i][2])
                    obj.push(result[i][3])
                    obj.push(k.id_vulns);
                    obj.push(k.id_threats);
                    con_name.push(obj);
                });
            }
            console.log(con_name);
            for (var i = 0; i < con_name.length; i++) {
                let [rows, field] = await connection.execute(update_sql, [con_name[i][0], con_name[i][1], con_name[i][2], con_name[i][3], con_name[i][4], con_name[i][5]]);
            }
            console.log('end');

        } catch (err) {
            console.log(err);
        }
        //resolve(con_name);

    })
        .then(async function (result) {
            //const mysql = require('mysql2/promise');
            try {
                /*const connection = await mysql.createConnection({
                    host: "14.40.31.222",
                    user: 'dev', //for now it is the root user, but gotta make a new user with limited privileged role 
                    password: '1918password',
                    port: 3306,
                    database: 'data_db'
                });

                for (var i = 0; i < result.length; i++) {
                    let [rows, field] = await connection.execute(update_sql, [result[0], result[1], result[2], result[3], result[4], result[5]]);
                }
                console.log('end');*/

            } catch (err) {
                console.log(err);
            }
        })
}

// will be changed to internal function
//gets doubel-layered array
grade = (num_Rate) => {
    console.log(num_Rate)
    let numRate = num_Rate
    let maxIdx = numRate.length
    const spawnSync = require('child_process').spawnSync;
    let rate = [];
    let id = [];
    let rate_result = [];
    let result_arr = [];

    for (var i = 0; i < maxIdx; i++) {
        id.push(numRate[i][0]);
        rate.push(numRate[i][1]);
    }


    const result = spawnSync('python3', ['routes/analysis/grade_Calculate.py', rate]); // python -> python3 변경함 
    //console.log("result:",result.stdout);
    let data = result.stdout.toString();
    //console.log("data:",data) 
    let temp = data.toString().replace("[", "");
    temp = temp.replace("]", "")
    temp = temp.split(", ");

    for (var i = 0; i < maxIdx; i++) {
        rate_result.push(Number(temp[i]));
    }
    // ============data preprocessing end=============
    console.log(rate_result);

    //compare data with the standard normal distribution chart, and input it into the new array which will be result_arr=[[id, rate]]
    for (var i = 0; i < maxIdx; i++) {
        if (0 >= rate_result[i]) // rate 1: 50% from min (-inf~0]
        {
            result_arr.push([id[i], 1]);
        }
        else {
            if (rate_result[i] > 0 && 0.95404 >= rate_result[i]) { //rate 2: 33% from the end of rate 1 (0~0.95404]
                result_arr.push([id[i], 2]);
            }
            else { // rate 3: (0.95404~inf)
                result_arr.push([id[i], 3]);
            }
        }
    }
    console.log(result_arr);
<<<<<<< HEAD
    console.log('error occurred: \n' + result.stderr);
    return (result_arr);
=======
    return(result_arr);
>>>>>>> 8934642a2e12681027663458c6d5c351934cd49d
}

grade_5 = async function (num_Rate) {
    let numRate = num_Rate
    let maxIdx = numRate.length
    const spawnSync = require('child_process').spawnSync;
    let rate = [];
    let id = [];
    let rate_result = [];
    let result_arr = [];

    for (var i = 0; i < maxIdx; i++) {
        id.push(numRate[i][0]);
        rate.push(numRate[i][1]);
    }

    const result = spawnSync('python3', ['routes/analysis/grade_Calculate.py', rate]);
    let data = result.stdout.toString();
    let temp = data.toString().replace("[", "");
    temp = temp.replace("]", "")
    temp = temp.split(", ");

    for (var i = 0; i < maxIdx; i++) {
        rate_result.push(Number(temp[i]));
    }
    // ============data preprocessing end=============
    console.log(rate_result);

    //compare data with the standard normal distribution chart, and input it into the new array which will be result_arr=[[id, rate]]
    for (var i = 0; i < maxIdx; i++) {
        if (-0.4648 >= rate_result[i]) // rate 1: 32% from min (-inf~0]
        {
            result_arr.push([id[i], 1]);
        }
        else {
            if (rate_result[i] > -0.4648 && 0.2045 >= rate_result[i]) { //rate 2: 26% from the end of rate 1 (0~0.95404]
                result_arr.push([id[i], 2]);
            }
            else { // rate 3: 20%
                if (rate_result[i] > 0.2045 && 0.7758 >= rate_result[i]) {
                    result_arr.push([id[i], 3]);
                }
                else {
                    //rate 4: 14%
                    if (rate_result[i] > 0.7758 && 1.41229 >= rate_result[i]) {
                        result_arr.push([id[i], 4]);
                    }
                    else { //rate 5: 8%
                        result_arr.push([id[i], 5]);
                    }
                }
            }
        }
    }
    console.log(result_arr);
    console.log('error occurred: \n' + result.stderr);
    return (result_arr);
}