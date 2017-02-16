'use strict'

module.exports = function () {
    let xhr = new XMLHttpRequest();

    function getAll() {
        return new Promise(function (resolve, reject) {
            xhr.open("GET", '/users', true);
            xhr.onload = function () {
                if (this.status != 200) {
                    reject(new Error(this.statusText));
                } else {
                    let userArray = JSON.parse(xhr.responseText);
                    resolve(userArray);
                }
            };
            xhr.send();

        })
    }

    function ready() {
        getAll()
            .then(userArray => {
                let id = 1;
                userArray.forEach(function (item, i, arr) {
                    if (item != null) {
                        let string = '<td>' + id + '</td><td id = "name' + id + '">' + item.name + '</td><td class = "form-inline">' +
                            '<button class = "btn btn-danger delete"  id = "' + id + '">Удалить</button><div> | </div><button class = "btn btn-success update" id ="' + id + '">Изменить</button></td>'
                        let tr = document.createElement('tr');
                        tr.setAttribute('id', 'tr' + id);
                        tr.innerHTML = string;
                        document.getElementById('userList').appendChild(tr);
                    }
                    id++;
                });
                return document;
            })
            .then(document => {
                let iterateCollection = function (collection) {
                    return function (f) {
                        for (let i = 0; collection[i]; i++) {
                            // console.log(collection[i])
                            f(collection[i], i);
                        }
                    }
                }

                let btnDelArray = document.getElementsByClassName('delete');
                let btnUpdateArray = document.getElementsByClassName('update');

                iterateCollection(btnDelArray)(function (node, i) {
                    node.addEventListener('click', function () {
                        var id = parseInt(this.getAttribute('id'));
                        new Promise(function (resolve, reject) {
                            xhr.open("DELETE", '/users/' + (id - 1), true);
                            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                            xhr.send();
                        });
                        document.getElementById('tr' + id).style.display = 'none'
                    })
                });

                iterateCollection(btnUpdateArray)(function (node, i) {
                    node.addEventListener('click', function Update() {
                        let id = parseInt(this.getAttribute('id'));
                        var parent = this.parentElement;
                        var temp = parent.childNodes;
                        console.log(temp.length)
                        for (let i = 0; i < temp.length; i++) {
                            temp[i].style.visibility = 'hidden';
                            console.log(temp[i])
                        }
                        let name = document.getElementById('name' + id).innerHTML;
                        let string = '<div class="form-group"><label for="updateName" class="sr-only">' +
                            'Имя</label><input class="form-control" type="text" id="updateName' + id + '" value="' + name + '">' +
                            '</div>&nbsp;<a  id = "update' + id + '" class="btn btn-primary" >Изменить</a>';
                        let form = document.createElement('form');
                        form.innerHTML = string;
                        form.classList.add('form-inline');
                        parent.insertBefore(form, parent.childNodes[0]);

                        let btnUpdate = document.getElementById('update' + id);
                        btnUpdate.addEventListener('click', function () {
                            let val = document.getElementById('updateName' + id).value;
                            let body = {
                                'name': val
                            };
                            new Promise(function (resolve, reject) {
                                xhr.open("PUT", '/users/' + (id - 1), true);
                                xhr.setRequestHeader('Content-Type', 'application/json');
                                xhr.onload = function () {
                                    if (this.status != 200) {
                                        reject(new Error(this.statusText));
                                    } else {
                                        document.getElementById('name' + id).innerHTML = val;
                                        form.remove();
                                        console.log(temp)
                                        iterateCollection(temp)(function (node, i) {
                                            node.style.visibility = "visible";
                                        })
                                        resolve(this.statusText);
                                    }
                                };
                                xhr.send(JSON.stringify(body));
                            })
                        })
                    })
                });
            })
    }


    //-------------------------------------------------------------------------------------------------------
    let btnCreate = document.getElementById('btnCreate');

    btnCreate.onclick = function () {
        let input = window.document.getElementById("name");
        let name = input.value;
        if (name) {
            let xhr = new XMLHttpRequest();
            let body = {"name": encodeURIComponent(name)};
            return new Promise(function (resolve, reject) {
                xhr.open("POST", '/users', true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify(body));
                xhr.onload = xhr.onerror = function () {
                    if (this.status == 200) {
                        resolve('ok')
                    } else {
                        reject(Error);
                    }
                };
            });
        }
        else alert('No input name')
    };


    document.addEventListener("DOMContentLoaded", ready);

}