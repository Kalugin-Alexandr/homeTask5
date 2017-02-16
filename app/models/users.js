"use strict";

const fs = require("fs"),
    Q = require("q"),
    databaseFileName = `${__dirname}/../databases/users.json`;

module.exports = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            fs.readFile(databaseFileName, (err, content) => {
                if (err) {
                    reject(err);
                } else {
                    let users = [];
                    try {
                        users = JSON.parse(content.toString())
                    } catch (e) {
                        /* @todo описать какое-то действие */
                    }
                    resolve(users);
                }
            });
        });
    },
    getById: (id) => {
        return Q.nfcall(fs.readFile, databaseFileName)
            .then((content) => {
                return content.toString(); //Buffer --> String
            })
            .then(JSON.parse) // String --> Object
            .get(Number(id)); // Object[index] --> Object
    },
    add: (params) => {
        return Q.nfcall(fs.readFile, databaseFileName)
            .then((content) => {
                let users = [];
                try {
                    users = JSON.parse(content.toString());
                } catch (e) {

                }
                users.push(params);
                return users;
            })
            .then((users) => {
                return Q.nfcall(fs.writeFile, databaseFileName, JSON.stringify(users, null, 2))
                    .then(() => {
                        return users.length - 1;
                    });
            });
    },
    update: (id, params) => {
        return Q.nfcall(fs.readFile, databaseFileName)
            .then((content) => {
                let users = [];
                try {
                    users = JSON.parse(content.toString());
                } catch (e) {

                }
                users[Number(id)] = params;
                return users;
            })
            .then((users) => {
                return Q.nfcall(fs.writeFile, databaseFileName, JSON.stringify(users, null, 2));
            });
    },
    remove: (id) => {
        return Q.nfcall(fs.readFile, databaseFileName)
            .then((content) => {
                let users = [];
                try {
                    users = JSON.parse(content.toString());
                } catch (e) {

                }
                delete users[Number(id)];
                return users;
            })
            .then((users) => {
                return Q.nfcall(fs.writeFile, databaseFileName, JSON.stringify(users, null, 2));
            });
    }
};