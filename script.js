"use strict";
const listOfStudents = [];
const password = "Password";
const login = "teacher001";
const form = document.querySelector('#loginpassword');
const filterhouse = document.querySelector(".househeading");
const sortinglist = document.querySelector('.sortbybutton');
let detailsOpened = false;

const housecolors = {
    Hufflepuff: '#F2CEA2',
    Ravenclaw: '#6CB0FF',
    Slytherin: '#7DED85',
    Gryffindor: '#FF6C6C',
}



document.addEventListener("DOMContentLoaded", start);

const HTML = {};

function start() {
    fetchdata();
    document.querySelector('.studen_login').addEventListener('click', validatePassword);
    form.addEventListener("submit", validatePassword);

    filterhouse.addEventListener('click', e => {
        document.querySelector('#listofhouses').classList.toggle('hide');
        document.querySelectorAll(".listfilter").forEach(e => {
            e.addEventListener('click', function () {
                filterstudents(e.textContent);
            })
        })
    });

    // sortinglist.addEventListener('click', e => {
    //     document.querySelector('#listofsorting').classList.toggle('hide');
       
    // })

    sortinglist.addEventListener('click', e => {
        document.querySelector('#listofsorting').classList.toggle('hide');
        document.querySelectorAll("#listofsorting > .listofsort").forEach(e => {
            e.addEventListener('click', function () {
                sortstudents(e.textContent);
            })
        })
        document.querySelectorAll("#listofsorting > .sortfilter").forEach(e => {
            e.addEventListener('click', function () {
                filterstudents(e.textContent);
            })
        })
    })
}

function validatePassword() {
    // console.log(form.username.value);
    // console.log(form.password.value);
    form.removeEventListener("submit", validatePassword);

    if (form.username.value === login && form.password.value === password) {
        document.querySelector("#loginpopup").classList.add('hide');
        document.querySelector('body').classList.add('teacherlogin')
        console.log('teacher logged in');
    } else {
        document.querySelector("#loginpopup").classList.add('hide');
        console.log('guest logged in');
    }

}


function fetchdata() {
    fetch('https://petlatkea.dk/2021/hogwarts/students.json')
        .then(function (response) {
            console.log('Student data fetched!');
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            dataRecived(data)
        })

};

function dataRecived(actors) {
    actors.forEach(createStudents);
    displayStudents(listOfStudents);
}

function createStudents(student) {

    const Student = {
        name: '',
        middlename: '',
        lastname: '',
        nickname: '',
        image: '',
        house: '',
        prefect: false,
        team: 'None',
    }
    const newStudent = Object.create(Student);

    let fullname = student.fullname.trim();
    let firstname;
    let lastname;
    let nickname = '';
    let middlename;
    let house;

    fullname = fullname.replace('-', ' ');

    //cleaning up names 
    if (fullname.includes(' ')) {
        let firstnameEnd = fullname.indexOf(' ');
        let lastnameStart = fullname.lastIndexOf(' ');
        firstname = fullname.substring(0, firstnameEnd);
        lastname = fullname.substring(lastnameStart, );

        if (firstnameEnd !== lastnameStart) {
            middlename = fullname.substring(firstnameEnd, lastnameStart);
            if (middlename.includes('"')) {
                nickname = middlename.replace('"', ' ');
                nickname = nickname.replace('"', ' ');
                nickname = nickname.trim();
                nickname = nickname.charAt(0).toUpperCase() + nickname.slice(1);
                middlename = '';

            } else {
                nickname = '';
            }
        } else {
            middlename = ''
        }

    } else {
        firstname = fullname;
        lastname = 'Unknown';
        middlename = '';
        nickname = '';
    }


    function cleanUp(str) {
        str = str.trim();
        str = str.toLowerCase();
        str = str.charAt(0).toUpperCase() + str.slice(1);
        return str;
    };
    firstname = cleanUp(firstname);
    middlename = cleanUp(middlename);
    lastname = cleanUp(lastname);

    console.log(`${firstname} ${lastname} ${middlename} ${nickname}`)

    //cleaning up houses
    house = cleanUp(student.house);

    // creating student objects 
    newStudent.firstname = firstname;
    newStudent.gender = student.gender;
    newStudent.lastname = lastname;
    newStudent.middlename = middlename;
    newStudent.nickname = nickname;
    newStudent.house = house;
    newStudent.image = `images/${lastname.toLowerCase()}_${firstname.charAt(0).toLowerCase()}.png`;

    listOfStudents.push(newStudent);
}

function displayStudents(students) {
    students.forEach(e => {
        const template = document.getElementById('stulist').content;
        const clone = template.cloneNode(true);

        clone.querySelector('.firstname').textContent = e.firstname;
        clone.querySelector('.lastname').textContent = e.lastname;
        clone.querySelector('.house').textContent = e.house;
        clone.querySelector('ul').addEventListener('click', function () {
            showDetailsModal(e.lastname)
        });
        document.querySelector("#students").appendChild(clone);

    })
}

function showDetailsModal(lastname) {
    const modal = document.querySelector("#studentModal");
    if (detailsOpened === false) {
        modal.classList.remove('hide');
        modal.addEventListener('click', e => {
            modal.classList.add('hide');
            detailsOpened = true;
        })
        listOfStudents.forEach(e => {
            if (e.lastname === lastname) {
                modal.querySelector('img').src = e.image;
                modal.querySelector('.modalfirstname').textContent = `${e.firstname} ${e.lastname}`;
                modal.querySelector('.modalgender').textContent = e.gender;
                modal.querySelector('.housemodal').textContent = e.house;

                switch (e.house) {
                    case 'Hufflepuff':
                        modal.querySelector('.housemodal').style.borderBottom = `${housecolors.Hufflepuff} solid 6px`;
                        break;
                    case 'Ravenclaw':
                        modal.querySelector('.housemodal').style.borderBottom = `${housecolors.Ravenclaw} solid 6px`;
                        break;
                    case 'Slytherin':
                        modal.querySelector('.housemodal').style.borderBottom = `${housecolors.Slytherin} solid 6px`;
                        break;
                    default:
                        modal.querySelector('.housemodal').style.borderBottom = `${housecolors.Gryffindor} solid 6px`;
                }

                if (e.prefect === false) {
                    modal.querySelector('.isprefect').classList.add('hide');
                }

            }
        })
        detailsOpened = true;
    } else {
        modal.classList.add('hide');
        detailsOpened = false;
    }
}
// let listToDisplay = [];

function filterstudents(houseSort) {
    cleanUpList();
    console.log(houseSort)
    const listToDisplay = listOfStudents.filter(student => student.house === houseSort );
    //  = listOfStudents.filter(student =>  === );
    // displayStudents(listToDisplay);
    console.log(`${listToDisplay} pressed filter`)
}

function sortstudents(sortBy) {
    cleanUpList();
    console.log(`${sortBy} pressed sorting`);
   
    if(sortBy === 'By Name'){
        listOfStudents.sort(compareFirstNames);
    }else{
        listOfStudents.sort(compareLastNames);
    }


    function compareFirstNames(a,b){
        if(a.firstname < b.firstname){
            return -1;
        } else {
            return 1
        }
    }
    
    function compareLastNames(a,b){
        if(a.lastname < b.lastname){
            return -1;
        } else {
            return 1
        }
    }
    console.log(listOfStudents);
    displayStudents(listOfStudents);
}

function cleanUpList() {
    const table = document.querySelector('#students');
    while (table.firstChild) {
        table.removeChild(table.lastChild);
    }
}
// console.log(listOfStudents);